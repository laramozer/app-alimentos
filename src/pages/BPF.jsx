import { useState, useRef, useEffect } from 'react';
import {
  CheckCircle2, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, ClipboardCheck, Pencil, Check, X,
} from 'lucide-react';
import { useData } from '../context/DataContext.jsx';

const STATUS_OPTIONS = [
  {
    key: 'conforme',
    label: 'Conforme',
    activeClass: 'bg-green-500 text-white border-green-500',
    hoverClass: 'hover:border-green-400 hover:text-green-600',
    dropdownHover: 'hover:bg-green-50',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  {
    key: 'nao-conforme',
    label: 'Não Conforme',
    activeClass: 'bg-red-500 text-white border-red-500',
    hoverClass: 'hover:border-red-400 hover:text-red-600',
    dropdownHover: 'hover:bg-red-50',
    textColor: 'text-red-700',
    dotColor: 'bg-red-500',
    icon: <XCircle className="w-4 h-4" />,
  },
  {
    key: 'pendente',
    label: 'Pendente',
    activeClass: 'bg-yellow-500 text-white border-yellow-500',
    hoverClass: 'hover:border-yellow-400 hover:text-yellow-600',
    dropdownHover: 'hover:bg-yellow-50',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
    icon: <Clock className="w-4 h-4" />,
  },
  {
    key: 'em-andamento',
    label: 'Em Andamento',
    activeClass: 'bg-blue-500 text-white border-blue-500',
    hoverClass: 'hover:border-blue-400 hover:text-blue-600',
    dropdownHover: 'hover:bg-blue-50',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
    icon: <AlertCircle className="w-4 h-4" />,
  },
];

function StatusDropdown({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = STATUS_OPTIONS.find(o => o.key === status);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (key) => {
    onChange(key === status ? null : key);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-150 ${
          selected
            ? `${selected.activeClass} shadow-sm`
            : 'border-gray-200 text-gray-400 bg-white hover:border-gray-300 hover:text-gray-500'
        }`}
      >
        {selected ? (
          <>
            {selected.icon}
            <span className="hidden sm:inline">{selected.label}</span>
          </>
        ) : (
          <span className="text-gray-400">Selecionar</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-20">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors ${opt.dropdownHover} ${
                status === opt.key ? `${opt.textColor} font-semibold` : 'text-gray-600'
              }`}
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
                onClick={() => handleSelect(null)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Limpar seleção
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ObservacaoEditor({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');

  const handleSave = () => {
    onSave(text);
    setEditing(false);
  };

  const handleCancel = () => {
    setText(value || '');
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="mt-2 flex items-center gap-2">
        <input
          autoFocus
          className="flex-1 text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
          placeholder="Adicionar observação..."
        />
        <button onClick={handleSave} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 shrink-0">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleCancel} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => setEditing(true)} className="mt-1 flex items-center gap-1 group/obs">
      {value
        ? <p className="text-xs text-gray-400 italic group-hover/obs:text-gray-600">{value}</p>
        : <p className="text-xs text-gray-300 italic group-hover/obs:text-gray-500">+ observação</p>
      }
      <Pencil className="w-3 h-3 text-gray-300 group-hover/obs:text-gray-400 shrink-0" />
    </button>
  );
}

export function BPF() {
  const { bpf, updateBPFItem } = useData();
  const [expanded, setExpanded] = useState(bpf.map(c => c.id));

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectStatus = (checklistId, itemId, status) => {
    updateBPFItem(checklistId, itemId, { status });
  };

  const saveObs = (checklistId, itemId, observacao) => {
    updateBPFItem(checklistId, itemId, { observacao });
  };

  const totalItens = bpf.reduce((acc, c) => acc + c.itens.length, 0);
  const respondidos = bpf.reduce((acc, c) => acc + c.itens.filter(i => i.status !== null).length, 0);
  const counts = {
    conforme: bpf.reduce((acc, c) => acc + c.itens.filter(i => i.status === 'conforme').length, 0),
    'nao-conforme': bpf.reduce((acc, c) => acc + c.itens.filter(i => i.status === 'nao-conforme').length, 0),
    pendente: bpf.reduce((acc, c) => acc + c.itens.filter(i => i.status === 'pendente').length, 0),
    'em-andamento': bpf.reduce((acc, c) => acc + c.itens.filter(i => i.status === 'em-andamento').length, 0),
  };

  const conformidadeGeral = respondidos === 0
    ? 0
    : Math.round((counts.conforme / respondidos) * 100);

  const progressoChecklist = Math.round((respondidos / totalItens) * 100);

  const statusCards = [
    { key: 'conforme', label: 'Conformes', dot: 'bg-green-500' },
    { key: 'nao-conforme', label: 'Não Conformes', dot: 'bg-red-500' },
    { key: 'pendente', label: 'Pendentes', dot: 'bg-yellow-500' },
    { key: 'em-andamento', label: 'Em Andamento', dot: 'bg-blue-500' },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Boas Práticas de Fabricação</h1>
        <p className="text-gray-500 text-sm mt-1">Selecione o status de cada item do checklist — RDC 216/2004 e RDC 275/2002</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statusCards.map(({ key, label, dot }) => (
          <div key={key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className={`w-3 h-3 rounded-full ${dot} mb-2`} />
            <p className="text-2xl font-bold text-gray-900">{counts[key]}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-800">Progresso do Checklist</span>
          </div>
          <span className="text-sm font-semibold text-gray-500">{respondidos}/{totalItens} respondidos</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${progressoChecklist}%` }}
          />
        </div>

        {respondidos > 0 && (
          <div className="flex items-center justify-between pt-1 border-t border-gray-100">
            <span className="text-sm text-gray-500">Conformidade dos respondidos</span>
            <span className={`text-lg font-bold ${conformidadeGeral >= 80 ? 'text-green-600' : conformidadeGeral >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {conformidadeGeral}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {bpf.map(checklist => {
          const isOpen = expanded.includes(checklist.id);
          const catTotal = checklist.itens.length;
          const catRespondidos = checklist.itens.filter(i => i.status !== null).length;
          const catConformes = checklist.itens.filter(i => i.status === 'conforme').length;

          return (
            <div key={checklist.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <button
                onClick={() => toggleExpand(checklist.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    catRespondidos === 0 ? 'bg-gray-200' :
                    catConformes / catRespondidos >= 0.8 ? 'bg-green-500' :
                    catConformes / catRespondidos >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-semibold text-gray-800">{checklist.categoria}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {catRespondidos}/{catTotal}
                  </span>
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-gray-400" />
                  : <ChevronDown className="w-4 h-4 text-gray-400" />
                }
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-gray-100 pt-3">
                  {checklist.itens.map(item => {
                    const cardBg = {
                      conforme: 'bg-green-50 border-green-200',
                      'nao-conforme': 'bg-red-50 border-red-200',
                      pendente: 'bg-yellow-50 border-yellow-200',
                      'em-andamento': 'bg-blue-50 border-blue-200',
                    }[item.status] ?? 'bg-white border-gray-100';

                    return (
                      <div
                        key={item.id}
                        className={`border rounded-xl p-3 transition-colors duration-200 ${cardBg}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-800 font-medium leading-snug pt-0.5">{item.descricao}</p>
                          <StatusDropdown
                            status={item.status}
                            onChange={(s) => selectStatus(checklist.id, item.id, s)}
                          />
                        </div>
                        <ObservacaoEditor
                          value={item.observacao}
                          onSave={(obs) => saveObs(checklist.id, item.id, obs)}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
