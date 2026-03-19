import { useState } from 'react';
import { BookOpen, Calendar, Building, ExternalLink, Search } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

const tipoBadge = {
  RDC: 'bg-green-100 text-green-700',
  IN: 'bg-blue-100 text-blue-700',
  Lei: 'bg-purple-100 text-purple-700',
  Decreto: 'bg-orange-100 text-orange-700',
  Portaria: 'bg-teal-100 text-teal-700',
  Resolução: 'bg-indigo-100 text-indigo-700',
};

export function Legislacoes() {
  const { legislacoes } = useData();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroArea, setFiltroArea] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const areas = ['todas', ...Array.from(new Set(legislacoes.map(l => l.area)))];
  const tipos = ['todos', ...Array.from(new Set(legislacoes.map(l => l.tipo)))];

  const filtered = legislacoes.filter(l => {
    if (filtroTipo !== 'todos' && l.tipo !== filtroTipo) return false;
    if (filtroArea !== 'todas' && l.area !== filtroArea) return false;
    if (filtroStatus !== 'todos' && l.status !== filtroStatus) return false;
    if (busca) {
      const q = busca.toLowerCase();
      return l.numero.toLowerCase().includes(q) || l.titulo.toLowerCase().includes(q) || l.ementa.toLowerCase().includes(q) || l.area.toLowerCase().includes(q);
    }
    return true;
  });

  const vigentes = legislacoes.filter(l => l.status === 'vigente').length;
  const revogadas = legislacoes.filter(l => l.status === 'revogada').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Legislações</h1>
        <p className="text-gray-500 text-sm mt-1">Banco de normas e regulamentos sanitários</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{legislacoes.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100 text-center">
          <p className="text-2xl font-bold text-green-600">{vigentes}</p>
          <p className="text-xs text-green-500 mt-1">Vigentes</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-400">{revogadas}</p>
          <p className="text-xs text-gray-400 mt-1">Revogadas</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por número, título, área..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {tipos.map(t => <option key={t} value={t}>{t === 'todos' ? 'Todos os tipos' : t}</option>)}
        </select>
        <select
          value={filtroArea}
          onChange={e => setFiltroArea(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {areas.map(a => <option key={a} value={a}>{a === 'todas' ? 'Todas as áreas' : a}</option>)}
        </select>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os status</option>
          <option value="vigente">Vigente</option>
          <option value="revogada">Revogada</option>
          <option value="suspensa">Suspensa</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

      <div className="space-y-3">
        {filtered.map(leg => (
          <div key={leg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tipoBadge[leg.tipo] ?? 'bg-gray-100 text-gray-600'}`}>
                    {leg.tipo}
                  </span>
                  <span className="text-xs font-mono font-semibold text-gray-600">{leg.numero}</span>
                  <StatusBadge status={leg.status} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{leg.titulo}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{leg.ementa}</p>

                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{leg.orgao}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">Publicação: {new Date(leg.dataPublicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-500">{leg.area}</span>
                  </div>
                </div>
              </div>
              {leg.link && (
                <a
                  href={leg.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                  title="Acessar legislação"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
