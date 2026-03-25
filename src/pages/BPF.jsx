import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, ClipboardCheck, Pencil, Check, X,
  Plus, Trash2, MapPin, AlertTriangle, RotateCcw,
} from 'lucide-react';
import { useData } from '../context/DataContext.jsx';

const STATUS_OPTIONS = [
  {
    key: 'conforme',
    label: 'Conforme',
    activeClass: 'bg-green-500 text-white border-green-500',
    dropdownHover: 'hover:bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    key: 'nao-conforme',
    label: 'Não Conforme',
    activeClass: 'bg-red-500 text-white border-red-500',
    dropdownHover: 'hover:bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    icon: <XCircle className="w-4 h-4" />,
  },
  {
    key: 'pendente',
    label: 'Pendente',
    activeClass: 'bg-yellow-500 text-white border-yellow-500',
    dropdownHover: 'hover:bg-yellow-50',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: 'em-andamento',
    label: 'Em Andamento',
    activeClass: 'bg-blue-500 text-white border-blue-500',
    dropdownHover: 'hover:bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    icon: <AlertCircle className="w-4 h-4" />,
  },
];

const CARD_BG = {
  conforme: 'bg-green-50 border-green-200',
  'nao-conforme': 'bg-red-50 border-red-200',
  pendente: 'bg-yellow-50 border-yellow-200',
  'em-andamento': 'bg-blue-50 border-blue-200',
};

function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = STATUS_OPTIONS.find(o => o.key === status);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
          selected
            ? `${selected.activeClass} shadow-sm`
            : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300 hover:text-gray-500'
        }`}
      >
        {selected ? (<>{selected.icon}<span className="hidden sm:inline">{selected.label}</span></>) : <span>Selecionar</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-20">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => { onChange(status === opt.key ? null : opt.key); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${opt.dropdownHover} ${status === opt.key ? `${opt.textColor} font-semibold` : 'text-gray-600'}`}
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dotColor}`} />
              {opt.label}
              {status === opt.key && <Check className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
          {status && (
            <>
              <div className="border-t border-gray-100 mx-2" />
              <button
                onClick={() => { onChange(null); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50"
              >
                <X className="w-3.5 h-3.5" /> Limpar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ObsEditor({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');

  const save = () => { onSave(text); setEditing(false); };
  const cancel = () => { setText(value || ''); setEditing(false); };

  if (editing) return (
    <div className="mt-2 flex items-center gap-2">
      <input autoFocus className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400"
        value={text} onChange={e => setText(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
        placeholder="Adicionar observação..." />
      <button onClick={save} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 shrink-0"><Check className="w-3.5 h-3.5" /></button>
      <button onClick={cancel} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 shrink-0"><X className="w-3.5 h-3.5" /></button>
    </div>
  );

  return (
    <button onClick={() => setEditing(true)} className="mt-1 flex items-center gap-1 group/obs">
      {value
        ? <p className="text-xs text-gray-400 italic group-hover/obs:text-gray-600">{value}</p>
        : <p className="text-xs text-gray-300 italic group-hover/obs:text-gray-500">+ observação</p>}
      <Pencil className="w-3 h-3 text-gray-300 group-hover/obs:text-gray-400 shrink-0" />
    </button>
  );
}

function NovaAreaModal({ onConfirm, onCancel }) {
  const [nome, setNome] = useState('');
  const [usarPadrao, setUsarPadrao] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim()) return;
    onConfirm(nome.trim(), usarPadrao);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Nova Área de Inspeção</h3>
            <p className="text-xs text-gray-500">Adicione um local para avaliar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome da área / local *</label>
            <input
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Ex: Cozinha Fria, Depósito, Linha de Envase..."
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div
            onClick={() => setUsarPadrao(p => !p)}
            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${usarPadrao ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${usarPadrao ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
              {usarPadrao && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Iniciar com itens padrão BPF</p>
              <p className="text-xs text-gray-400 mt-0.5">10 itens de avaliação pré-definidos (limpeza, iluminação, pragas, temperatura...)</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={!nome.trim()} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" /> Criar Área
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteAreaConfirm({ area, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Excluir Área</h3>
            <p className="text-sm text-gray-500">{area.nome}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">Todos os itens e avaliações desta área serão perdidos. Deseja continuar?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Excluir</button>
        </div>
      </div>
    </div>
  );
}

function AreaCard({ area }) {
  const { updateBPFItem, addBPFItem, deleteBPFItem, renameBPFArea, deleteBPFArea } = useData();
  const [open, setOpen] = useState(true);
  const [editingNome, setEditingNome] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(area.nome);
  const [novoItem, setNovoItem] = useState('');
  const [showDeleteArea, setShowDeleteArea] = useState(false);

  const respondidos = area.itens.filter(i => i.status !== null).length;
  const total = area.itens.length;
  const conformes = area.itens.filter(i => i.status === 'conforme').length;
  const naoConformes = area.itens.filter(i => i.status === 'nao-conforme').length;
  const progresso = total === 0 ? 0 : Math.round((respondidos / total) * 100);
  const conformidade = respondidos === 0 ? null : Math.round((conformes / respondidos) * 100);

  const saveNome = () => {
    if (nomeTemp.trim()) renameBPFArea(area.id, nomeTemp.trim());
    else setNomeTemp(area.nome);
    setEditingNome(false);
  };

  const handleAddItem = () => {
    if (!novoItem.trim()) return;
    addBPFItem(area.id, novoItem.trim());
    setNovoItem('');
  };

  const resetArea = () => {
    area.itens.forEach(item => updateBPFItem(area.id, item.id, { status: null, observacao: '' }));
  };

  return (
    <>
      {showDeleteArea && (
        <DeleteAreaConfirm
          area={area}
          onConfirm={() => { deleteBPFArea(area.id); setShowDeleteArea(false); }}
          onCancel={() => setShowDeleteArea(false)}
        />
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header da área */}
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
          <MapPin className="w-4 h-4 text-green-600 shrink-0" />

          {editingNome ? (
            <input
              autoFocus
              className="flex-1 text-sm font-semibold border border-green-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={nomeTemp}
              onChange={e => setNomeTemp(e.target.value)}
              onBlur={saveNome}
              onKeyDown={e => { if (e.key === 'Enter') saveNome(); if (e.key === 'Escape') { setNomeTemp(area.nome); setEditingNome(false); } }}
            />
          ) : (
            <button onClick={() => setEditingNome(true)} className="flex-1 text-left text-sm font-semibold text-gray-800 hover:text-green-700 group flex items-center gap-1.5">
              {area.nome}
              <Pencil className="w-3 h-3 text-gray-300 group-hover:text-green-500 shrink-0" />
            </button>
          )}

          <div className="flex items-center gap-1 shrink-0">
            {/* Contador de progresso */}
            <span className="text-xs text-gray-400 mr-1">{respondidos}/{total}</span>

            {/* Conformidade */}
            {conformidade !== null && (
              <span className={`text-xs font-bold mr-2 ${conformidade >= 80 ? 'text-green-600' : conformidade >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {conformidade}%
              </span>
            )}

            <button onClick={resetArea} title="Limpar todas as avaliações" className="p-1.5 rounded-lg text-gray-300 hover:text-yellow-600 hover:bg-yellow-50 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setShowDeleteArea(true)} title="Excluir área" className="p-1.5 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setOpen(p => !p)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 transition-colors">
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-1 bg-gray-100">
          <div
            className={`h-1 transition-all duration-500 ${naoConformes > 0 ? 'bg-red-400' : 'bg-green-500'}`}
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* Itens */}
        {open && (
          <div className="p-4 space-y-2">
            {area.itens.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Nenhum item. Adicione abaixo.</p>
            )}

            {area.itens.map(item => {
              const cardBg = CARD_BG[item.status] ?? 'bg-white border-gray-100';
              return (
                <div key={item.id} className={`border rounded-xl p-3 transition-colors duration-200 ${cardBg}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-gray-800 font-medium leading-snug pt-0.5 flex-1">{item.descricao}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <StatusDropdown
                        status={item.status}
                        onChange={(s) => updateBPFItem(area.id, item.id, { status: s })}
                      />
                      <button
                        onClick={() => deleteBPFItem(area.id, item.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remover item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <ObsEditor
                    value={item.observacao}
                    onSave={(obs) => updateBPFItem(area.id, item.id, { observacao: obs })}
                  />
                </div>
              );
            })}

            {/* Adicionar item */}
            <div className="flex items-center gap-2 pt-1">
              <input
                className="flex-1 border border-dashed border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 placeholder-gray-400"
                placeholder="+ Adicionar item de avaliação..."
                value={novoItem}
                onChange={e => setNovoItem(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddItem(); }}
              />
              <button
                onClick={handleAddItem}
                disabled={!novoItem.trim()}
                className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export function BPF() {
  const { bpf } = useData();
  const { createBPFArea } = useData();
  const [showNovaArea, setShowNovaArea] = useState(false);

  const totalItens = bpf.reduce((acc, a) => acc + a.itens.length, 0);
  const respondidos = bpf.reduce((acc, a) => acc + a.itens.filter(i => i.status !== null).length, 0);
  const conformes = bpf.reduce((acc, a) => acc + a.itens.filter(i => i.status === 'conforme').length, 0);
  const naoConformes = bpf.reduce((acc, a) => acc + a.itens.filter(i => i.status === 'nao-conforme').length, 0);
  const pendentes = bpf.reduce((acc, a) => acc + a.itens.filter(i => i.status === 'pendente').length, 0);
  const emAndamento = bpf.reduce((acc, a) => acc + a.itens.filter(i => i.status === 'em-andamento').length, 0);

  const progresso = totalItens === 0 ? 0 : Math.round((respondidos / totalItens) * 100);
  const conformidade = respondidos === 0 ? 0 : Math.round((conformes / respondidos) * 100);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {showNovaArea && (
        <NovaAreaModal
          onConfirm={(nome, usarPadrao) => { createBPFArea(nome, usarPadrao); setShowNovaArea(false); }}
          onCancel={() => setShowNovaArea(false)}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Boas Práticas de Fabricação</h1>
          <p className="text-gray-500 text-sm mt-1">Avaliação por área/local — RDC 216/2004 e RDC 275/2002</p>
        </div>
        <button
          onClick={() => setShowNovaArea(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nova Área
        </button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Conformes', value: conformes, dot: 'bg-green-500' },
          { label: 'Não Conformes', value: naoConformes, dot: 'bg-red-500' },
          { label: 'Pendentes', value: pendentes, dot: 'bg-yellow-500' },
          { label: 'Em Andamento', value: emAndamento, dot: 'bg-blue-500' },
        ].map(({ label, value, dot }) => (
          <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-3 h-3 rounded-full ${dot} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Progresso geral */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">Progresso Geral</span>
          </div>
          <span className="text-sm text-gray-500">{bpf.length} área{bpf.length !== 1 ? 's' : ''} · {respondidos}/{totalItens} itens</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div className="h-2.5 rounded-full bg-green-500 transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>
        {respondidos > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{progresso}% respondido</span>
            <span className={`font-bold ${conformidade >= 80 ? 'text-green-600' : conformidade >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {conformidade}% de conformidade
            </span>
          </div>
        )}
      </div>

      {/* Áreas */}
      {bpf.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 flex flex-col items-center text-gray-400">
          <MapPin className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-medium text-gray-500">Nenhuma área cadastrada</p>
          <p className="text-sm mt-1">Clique em "Nova Área" para começar a avaliação</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bpf.map(area => <AreaCard key={area.id} area={area} />)}
        </div>
      )}
    </div>
  );
}
