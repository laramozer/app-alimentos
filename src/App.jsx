import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DataProvider } from './context/DataContext.jsx';
import { Sidebar, Header } from './components/Sidebar.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { BPF } from './pages/BPF.jsx';
import { Visitas } from './pages/Visitas.jsx';
import { POPs } from './pages/POPs.jsx';
import { Vigilancia } from './pages/Vigilancia.jsx';
import { Legislacoes } from './pages/Legislacoes.jsx';

const pageTitles = {
  '/': 'Dashboard',
  '/bpf': 'Boas Práticas de Fabricação',
  '/visitas': 'Visitas na Indústria',
  '/pops': 'Procedimentos Operacionais Padronizados',
  '/vigilancia': 'Vigilância Sanitária',
  '/legislacoes': 'Legislações',
};

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'FoodConsult';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bpf" element={<BPF />} />
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/pops" element={<POPs />} />
            <Route path="/vigilancia" element={<Vigilancia />} />
            <Route path="/legislacoes" element={<Legislacoes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Layout />
      </DataProvider>
    </BrowserRouter>
  );
}
