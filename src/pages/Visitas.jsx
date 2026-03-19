import { useState } from 'react';
import { Calendar, User, ClipboardList, ChevronDown, ChevronUp, AlertTriangle, Wrench } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

const tipoLabel = {
  auditoria: 'Auditoria',
  consultoria: 'Consultoria',
  monitoramento: 'Monitoramento',
};

const tipoBadge = {
  auditoria: 'bg-purple-100 text-purple-700',
  consultoria: 'bg-blue-100 text-blue-700',
  monitoramento: 'bg-teal-100 text-teal-700',
};

export function Visitas() {
  const { visitas } = useData();
  const [expanded, setExpanded] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const filtered = visitas.filter(v => {
    if (filtroTipo !== 'todos' && v.tipo !== filtroTipo) return false;
    if (filtroStatus !== 'todos' && v.status !== filtroStatus) return false;
    return true;
  });

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visitas na Indústria</h1>
        <p className="text-gray-500 text-sm mt-1">Registro e acompanhamento de visitas técnicas</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['auditoria', 'consultoria', 'monitoramento'].map(tipo => (
          <div key={tipo} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{visitas.filter(v => v.tipo === tipo).length}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{tipoLabel[tipo]}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os tipos</option>
          <option value="auditoria">Auditoria</option>
          <option value="consultoria">Consultoria</option>
          <option value="monitoramento">Monitoramento</option>
        </select>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os status</option>
          <option value="conforme">Conforme</option>
          <option value="nao-conforme">Não Conforme</option>
          <option value="pendente">Pendente</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(v => {
          const isOpen = expanded === v.id;
          return (
            <div key={v.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggle(v.id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipoBadge[v.tipo]}`}>
                        {tipoLabel[v.tipo]}
                      </span>
                      <StatusBadge status={v.status} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mt-1.5">{v.empresa}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">CNPJ: {v.cnpj}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{new Date(v.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{v.responsavel}</span>
                      </div>
                      {v.pontuacao && (
                        <span className={`text-sm font-bold ${v.pontuacao >= 80 ? 'text-green-600' : v.pontuacao >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          Pontuação: {v.pontuacao}%
                        </span>
                      )}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 mt-1 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 mt-1 shrink-0" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ClipboardList className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Observações</span>
                    </div>
                    <p className="text-sm text-gray-600">{v.observacoes}</p>
                  </div>

                  {v.naoConformidades.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-semibold text-red-700">Não Conformidades ({v.naoConformidades.length})</span>
                      </div>
                      <ul className="space-y-1">
                        {v.naoConformidades.map((nc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-red-200 text-red-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{idx + 1}</span>
                            <span className="text-sm text-red-800">{nc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {v.acoes.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Wrench className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-blue-700">Ações Corretivas ({v.acoes.length})</span>
                      </div>
                      <ul className="space-y-1">
                        {v.acoes.map((acao, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{idx + 1}</span>
                            <span className="text-sm text-blue-800">{acao}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
