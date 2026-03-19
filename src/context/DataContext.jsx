import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { bpfChecklists as initialBPF, visitas as initialVisitas, pops as initialPOPs, ocorrenciasVigilancia as initialVigilancia, legislacoes as initialLegislacoes } from '../data/mockData.js';

const DataContext = createContext(null);
const DATA_VERSION = 'v3';

// Limpa dados antigos do localStorage se a versão mudou
if (localStorage.getItem('fc_version') !== DATA_VERSION) {
  ['fc_bpf', 'fc_visitas', 'fc_pops', 'fc_vigilancia', 'fc_legislacoes'].forEach(k => localStorage.removeItem(k));
  localStorage.setItem('fc_version', DATA_VERSION);
}

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function DataProvider({ children }) {
  const [bpf, setBpf] = useState(() => loadFromStorage('fc_bpf', initialBPF));
  const [visitas, setVisitas] = useState(() => loadFromStorage('fc_visitas', initialVisitas));
  const [pops, setPops] = useState(() => loadFromStorage('fc_pops', initialPOPs));
  const [vigilancia, setVigilancia] = useState(() => loadFromStorage('fc_vigilancia', initialVigilancia));
  const [legislacoes] = useState(() => loadFromStorage('fc_legislacoes', initialLegislacoes));

  useEffect(() => { localStorage.setItem('fc_bpf', JSON.stringify(bpf)); }, [bpf]);
  useEffect(() => { localStorage.setItem('fc_visitas', JSON.stringify(visitas)); }, [visitas]);
  useEffect(() => { localStorage.setItem('fc_pops', JSON.stringify(pops)); }, [pops]);
  useEffect(() => { localStorage.setItem('fc_vigilancia', JSON.stringify(vigilancia)); }, [vigilancia]);

  const updateBPFItem = useCallback((checklistId, itemId, changes) => {
    setBpf(prev => prev.map(checklist =>
      checklist.id !== checklistId ? checklist : {
        ...checklist,
        itens: checklist.itens.map(item =>
          item.id !== itemId ? item : { ...item, ...changes }
        ),
      }
    ));
  }, []);

  const createPOP = useCallback((popData) => {
    const newPOP = {
      ...popData,
      id: Date.now().toString(),
    };
    setPops(prev => [newPOP, ...prev]);
  }, []);

  const updatePOP = useCallback((id, changes) => {
    setPops(prev => prev.map(p => p.id !== id ? p : { ...p, ...changes }));
  }, []);

  const deletePOP = useCallback((id) => {
    setPops(prev => prev.filter(p => p.id !== id));
  }, []);

  const createVisita = useCallback((visitaData) => {
    setVisitas(prev => [{ ...visitaData, id: Date.now().toString() }, ...prev]);
  }, []);

  const createOcorrencia = useCallback((data) => {
    setVigilancia(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
  }, []);

  return (
    <DataContext.Provider value={{
      bpf, visitas, pops, vigilancia, legislacoes,
      updateBPFItem,
      createPOP, updatePOP, deletePOP,
      createVisita, createOcorrencia,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
