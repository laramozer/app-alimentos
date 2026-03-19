import { ClipboardCheck, Building2, FileText, ShieldAlert, BookOpen, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';

export function Dashboard() {
  const { bpf: bpfChecklists, visitas, pops, vigilancia: ocorrenciasVigilancia, legislacoes } = useData();

  const totalBPF = bpfChecklists.reduce((acc, c) => acc + c.itens.length, 0);
  const conformesBPF = bpfChecklists.reduce((acc, c) => acc + c.itens.filter(i => i.status === 'conforme').length, 0);
  const bpfPercent = Math.round((conformesBPF / totalBPF) * 100);

  const visitasConforme = visitas.filter(v => v.status === 'conforme').length;
  const popsAtivos = pops.filter(p => p.status === 'ativo').length;
  const ocorrenciasAbertas = ocorrenciasVigilancia.filter(o => o.status !== 'encerrada').length;
  const legislacoesVigentes = legislacoes.filter(l => l.status === 'vigente').length;

  const recentVisitas = visitas.slice(0, 3);
  const urgentes = ocorrenciasVigilancia.filter(o => o.status === 'em-andamento');

  const cards = [
    {
      to: '/bpf',
      icon: ClipboardCheck,
      label: 'BPF',
      value: `${bpfPercent}%`,
      sub: `${conformesBPF} de ${totalBPF} itens conformes`,
      color: 'from-green-500 to-green-700',
      textColor: 'text-green-700',
    },
    {
      to: '/visitas',
      icon: Building2,
      label: 'Visitas',
      value: visitas.length,
      sub: `${visitasConforme} conformes`,
      color: 'from-blue-500 to-blue-700',
      textColor: 'text-blue-700',
    },
    {
      to: '/pops',
      icon: FileText,
      label: 'POPs',
      value: pops.length,
      sub: `${popsAtivos} ativos`,
      color: 'from-purple-500 to-purple-700',
      textColor: 'text-purple-700',
    },
    {
      to: '/vigilancia',
      icon: ShieldAlert,
      label: 'Vigilância Sanitária',
      value: ocorrenciasVigilancia.length,
      sub: `${ocorrenciasAbertas} ocorrências abertas`,
      color: 'from-orange-500 to-orange-700',
      textColor: 'text-orange-700',
    },
    {
      to: '/legislacoes',
      icon: BookOpen,
      label: 'Legislações',
      value: legislacoes.length,
      sub: `${legislacoesVigentes} vigentes`,
      color: 'from-teal-500 to-teal-700',
      textColor: 'text-teal-700',
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral da consultoria — {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(({ to, icon: Icon, label, value, sub, color, textColor }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{value}</p>
            <p className="text-xs font-semibold text-gray-700 mt-0.5">{label}</p>
            <p className={`text-xs mt-1 font-medium ${textColor}`}>{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Últimas Visitas</h3>
            </div>
            <Link to="/visitas" className="text-sm text-green-600 hover:text-green-800 font-medium">Ver todas</Link>
          </div>
          <div className="space-y-3">
            {recentVisitas.map(v => (
              <div key={v.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  v.status === 'conforme' ? 'bg-green-500' :
                  v.status === 'nao-conforme' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{v.empresa}</p>
                  <p className="text-xs text-gray-500">{new Date(v.data).toLocaleDateString('pt-BR')} · {v.tipo}</p>
                </div>
                {v.pontuacao && (
                  <span className={`text-sm font-bold ${v.pontuacao >= 80 ? 'text-green-600' : v.pontuacao >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {v.pontuacao}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-800">Pendências</h3>
          </div>
          <div className="space-y-3">
            {urgentes.length === 0 ? (
              <div className="flex flex-col items-center py-6 text-gray-400">
                <CheckCircle2 className="w-10 h-10 mb-2" />
                <p className="text-sm">Sem pendências</p>
              </div>
            ) : (
              urgentes.map(o => (
                <div key={o.id} className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">{o.tipo}</p>
                  <p className="text-sm text-gray-700 mt-0.5 line-clamp-2">{o.descricao}</p>
                  {o.prazo && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <p className="text-xs text-orange-600">Prazo: {new Date(o.prazo).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardCheck className="w-5 h-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Conformidade BPF por Categoria</h3>
        </div>
        <div className="space-y-3">
          {bpfChecklists.map(checklist => {
            const total = checklist.itens.length;
            const conformes = checklist.itens.filter(i => i.status === 'conforme').length;
            const percent = Math.round((conformes / total) * 100);
            return (
              <div key={checklist.id}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-700">{checklist.categoria}</span>
                  <span className={`text-sm font-semibold ${percent >= 80 ? 'text-green-600' : percent >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {percent}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${percent >= 80 ? 'bg-green-500' : percent >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
