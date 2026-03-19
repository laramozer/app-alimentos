import { useState } from 'react';
import { ShieldAlert, Calendar, Building, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

const tipoConfig = {
  notificacao: { label: 'Notificação', className: 'bg-yellow-100 text-yellow-700' },
  inspecao: { label: 'Inspeção', className: 'bg-blue-100 text-blue-700' },
  embargo: { label: 'Embargo', className: 'bg-red-100 text-red-700' },
  autuacao: { label: 'Autuação', className: 'bg-orange-100 text-orange-700' },
};

export function Vigilancia() {
  const { vigilancia: ocorrenciasVigilancia } = useData();
  const [expanded, setExpanded] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const filtered = ocorrenciasVigilancia.filter(o => {
    if (filtroTipo !== 'todos' && o.tipo !== filtroTipo) return false;
    if (filtroStatus !== 'todos' && o.status !== filtroStatus) return false;
    return true;
  });

  const abertas = ocorrenciasVigilancia.filter(o => o.status === 'aberta').length;
  const emAndamento = ocorrenciasVigilancia.filter(o => o.status === 'em-andamento').length;
  const encerradas = ocorrenciasVigilancia.filter(o => o.status === 'encerrada').length;

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vigilância Sanitária</h1>
        <p className="text-gray-500 text-sm mt-1">Ocorrências e acompanhamento de demandas sanitárias</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-900">{ocorrenciasVigilancia.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 text-center">
          <p className="text-2xl font-bold text-red-600">{abertas}</p>
          <p className="text-xs text-red-500 mt-1">Abertas</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 text-center">
          <p className="text-2xl font-bold text-blue-600">{emAndamento}</p>
          <p className="text-xs text-blue-500 mt-1">Em Andamento</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-gray-500">{encerradas}</p>
          <p className="text-xs text-gray-400 mt-1">Encerradas</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os tipos</option>
          <option value="notificacao">Notificação</option>
          <option value="inspecao">Inspeção</option>
          <option value="embargo">Embargo</option>
          <option value="autuacao">Autuação</option>
        </select>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os status</option>
          <option value="aberta">Aberta</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="encerrada">Encerrada</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map(o => {
          const isOpen = expanded === o.id;
          const tipoInfo = tipoConfig[o.tipo];
          const isUrgente = o.status !== 'encerrada';

          return (
            <div
              key={o.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isUrgente && o.status === 'aberta' ? 'border-red-200' : 'border-gray-100'}`}
            >
              <button
                onClick={() => toggle(o.id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipoInfo.className}`}>
                        {tipoInfo.label}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">{o.descricao}</p>
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{o.orgao}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{new Date(o.data).toLocaleDateString('pt-BR')}</span>
                      </div>
                      {o.prazo && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-orange-400" />
                          <span className="text-xs text-orange-600 font-medium">Prazo: {new Date(o.prazo).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 mt-1 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 mt-1 shrink-0" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldAlert className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">Ação / Encaminhamento</p>
                    </div>
                    <p className="text-sm text-gray-600">{o.acao}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
