const statusConfig = {
  conforme: { label: 'Conforme', className: 'bg-green-100 text-green-800' },
  'nao-conforme': { label: 'Não Conforme', className: 'bg-red-100 text-red-800' },
  pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  'em-andamento': { label: 'Em Andamento', className: 'bg-blue-100 text-blue-800' },
  ativo: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
  revisao: { label: 'Em Revisão', className: 'bg-orange-100 text-orange-800' },
  obsoleto: { label: 'Obsoleto', className: 'bg-gray-100 text-gray-600' },
  vigente: { label: 'Vigente', className: 'bg-green-100 text-green-800' },
  revogada: { label: 'Revogada', className: 'bg-red-100 text-red-800' },
  suspensa: { label: 'Suspensa', className: 'bg-orange-100 text-orange-800' },
  aberta: { label: 'Aberta', className: 'bg-red-100 text-red-800' },
  encerrada: { label: 'Encerrada', className: 'bg-gray-100 text-gray-600' },
};

export function StatusBadge({ status, size = 'sm' }) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${config.className}`}>
      {config.label}
    </span>
  );
}
