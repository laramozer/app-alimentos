import { useState } from 'react';
import {
  FileText, Calendar, User, Tag, ChevronDown, ChevronUp,
  CheckSquare, Plus, Trash2, X, Save, Pencil, AlertTriangle,
  GripVertical,
} from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';

const EMPTY_FORM = {
  codigo: '',
  titulo: '',
  area: '',
  versao: '1.0',
  dataRevisao: new Date().toISOString().split('T')[0],
  responsavel: '',
  status: 'ativo',
  objetivo: '',
  procedimento: [''],
  registros: [''],
};

function POPForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const setListItem = (field, index, value) => {
    setForm(prev => {
      const arr = [...prev[field]];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addListItem = (field) => setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));

  const removeListItem = (field, index) => {
    setForm(prev => {
      const arr = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: arr.length ? arr : [''] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleaned = {
      ...form,
      procedimento: form.procedimento.filter(p => p.trim()),
      registros: form.registros.filter(r => r.trim()),
    };
    if (!cleaned.codigo || !cleaned.titulo || !cleaned.objetivo || cleaned.procedimento.length === 0) return;
    onSave(cleaned);
  };

  const isValid = form.codigo.trim() && form.titulo.trim() && form.objetivo.trim() && form.procedimento.some(p => p.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="font-bold text-gray-900">{initial ? 'Editar POP' : 'Novo POP'}</h2>
            <p className="text-xs text-gray-500 mt-0.5">Procedimento Operacional Padronizado</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-xl hover:bg-gray-200 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Código *</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 font-mono"
                  placeholder="POP-001"
                  value={form.codigo}
                  onChange={e => set('codigo', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Versão</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="1.0"
                  value={form.versao}
                  onChange={e => set('versao', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Título *</label>
              <input
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Ex: Higienização de Mãos"
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Área</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Ex: Higiene Pessoal"
                  value={form.area}
                  onChange={e => set('area', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                >
                  <option value="ativo">Ativo</option>
                  <option value="revisao">Em Revisão</option>
                  <option value="obsoleto">Obsoleto</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Responsável</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Nome do responsável"
                  value={form.responsavel}
                  onChange={e => set('responsavel', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Data de Revisão</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.dataRevisao}
                  onChange={e => set('dataRevisao', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Objetivo *</label>
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                placeholder="Descreva o objetivo deste procedimento..."
                value={form.objetivo}
                onChange={e => set('objetivo', e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">Procedimento (passos) *</label>
                <button
                  type="button"
                  onClick={() => addListItem('procedimento')}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar passo
                </button>
              </div>
              <div className="space-y-2">
                {form.procedimento.map((passo, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-bold shrink-0 mt-2">
                      {idx + 1}
                    </span>
                    <input
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder={`Passo ${idx + 1}...`}
                      value={passo}
                      onChange={e => setListItem('procedimento', idx, e.target.value)}
                    />
                    {form.procedimento.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('procedimento', idx)}
                        className="mt-2 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">Registros necessários</label>
                <button
                  type="button"
                  onClick={() => addListItem('registros')}
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar registro
                </button>
              </div>
              <div className="space-y-2">
                {form.registros.map((reg, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    <input
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      placeholder="Ex: Planilha de controle..."
                      value={reg}
                      onChange={e => setListItem('registros', idx, e.target.value)}
                    />
                    {form.registros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeListItem('registros', idx)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>

        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {initial ? 'Salvar alterações' : 'Criar POP'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ pop, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Excluir POP</h3>
            <p className="text-sm text-gray-500">{pop.codigo} — {pop.titulo}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">Esta ação não pode ser desfeita. Tem certeza que deseja excluir este procedimento?</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700">Excluir</button>
        </div>
      </div>
    </div>
  );
}

export function POPs() {
  const { pops, createPOP, updatePOP, deletePOP } = useData();
  const [expanded, setExpanded] = useState(null);
  const [filtroArea, setFiltroArea] = useState('todas');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingPOP, setEditingPOP] = useState(null);
  const [deletingPOP, setDeletingPOP] = useState(null);

  const areas = ['todas', ...Array.from(new Set(pops.map(p => p.area).filter(Boolean)))];
  const filtered = pops.filter(p => {
    if (filtroArea !== 'todas' && p.area !== filtroArea) return false;
    if (filtroStatus !== 'todos' && p.status !== filtroStatus) return false;
    return true;
  });

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const handleSaveNew = (data) => {
    createPOP(data);
    setShowForm(false);
  };

  const handleSaveEdit = (data) => {
    updatePOP(editingPOP.id, data);
    setEditingPOP(null);
  };

  const handleDelete = () => {
    deletePOP(deletingPOP.id);
    setDeletingPOP(null);
    if (expanded === deletingPOP.id) setExpanded(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {(showForm || editingPOP) && (
        <POPForm
          initial={editingPOP}
          onSave={editingPOP ? handleSaveEdit : handleSaveNew}
          onCancel={() => { setShowForm(false); setEditingPOP(null); }}
        />
      )}
      {deletingPOP && (
        <DeleteConfirm
          pop={deletingPOP}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPOP(null)}
        />
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procedimentos Operacionais Padronizados</h1>
          <p className="text-gray-500 text-sm mt-1">Biblioteca de POPs — RDC 275/2002</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo POP
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {['ativo', 'revisao', 'obsoleto'].map((status) => (
          <div key={status} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{pops.filter(p => p.status === status).length}</p>
            <div className="flex justify-center mt-1">
              <StatusBadge status={status} size="md" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap">
        <select
          value={filtroArea}
          onChange={e => setFiltroArea(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {areas.map(a => (
            <option key={a} value={a}>{a === 'todas' ? 'Todas as áreas' : a}</option>
          ))}
        </select>
        <select
          value={filtroStatus}
          onChange={e => setFiltroStatus(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="todos">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="revisao">Em Revisão</option>
          <option value="obsoleto">Obsoleto</option>
        </select>
        <span className="ml-auto self-center text-sm text-gray-400">{filtered.length} POP{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 flex flex-col items-center text-gray-400">
          <FileText className="w-12 h-12 mb-3 opacity-40" />
          <p className="font-medium">Nenhum POP encontrado</p>
          <p className="text-sm mt-1">Crie o primeiro procedimento clicando em "Novo POP"</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(pop => {
          const isOpen = expanded === pop.id;
          return (
            <div key={pop.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-start gap-2 p-4">
                <button
                  onClick={() => toggle(pop.id)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                      {pop.codigo}
                    </span>
                    <StatusBadge status={pop.status} />
                    <span className="text-xs text-gray-400">v{pop.versao}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{pop.titulo}</h3>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    {pop.area && (
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{pop.area}</span>
                      </div>
                    )}
                    {pop.dataRevisao && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">Revisado em {new Date(pop.dataRevisao).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    {pop.responsavel && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">{pop.responsavel}</span>
                      </div>
                    )}
                  </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingPOP(pop)}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingPOP(pop)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => toggle(pop.id)} className="p-2 text-gray-400">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Objetivo</p>
                    <p className="text-sm text-gray-700">{pop.objetivo}</p>
                  </div>

                  {pop.procedimento?.length > 0 && (
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-1.5 mb-3">
                        <CheckSquare className="w-4 h-4 text-gray-500" />
                        <p className="text-sm font-semibold text-gray-700">Procedimento</p>
                      </div>
                      <ol className="space-y-2">
                        {pop.procedimento.map((passo, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-sm text-gray-700">{passo}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {pop.registros?.filter(Boolean).length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <p className="text-sm font-semibold text-blue-700">Registros Necessários</p>
                      </div>
                      <ul className="space-y-1">
                        {pop.registros.filter(Boolean).map((reg, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="text-sm text-blue-800">{reg}</span>
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
