import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  FileText,
  ShieldAlert,
  BookOpen,
  Leaf,
  X,
  Menu,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bpf', icon: ClipboardCheck, label: 'BPF' },
  { to: '/visitas', icon: Building2, label: 'Visitas na Indústria' },
  { to: '/pops', icon: FileText, label: 'POPs' },
  { to: '/vigilancia', icon: ShieldAlert, label: 'Vigilância Sanitária' },
  { to: '/legislacoes', icon: BookOpen, label: 'Legislações' },
];

export function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-green-800 to-green-950 text-white z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between p-5 border-b border-green-700">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-xl p-1.5">
              <Leaf className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">FoodConsult</h1>
              <p className="text-green-300 text-xs">Consultoria em Alimentos</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 hover:bg-green-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-white text-green-800 shadow-md'
                  : 'text-green-100 hover:bg-green-700/60'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center text-sm font-bold">
              RT
            </div>
            <div>
              <p className="text-sm font-medium">Resp. Técnico</p>
              <p className="text-green-400 text-xs">rt@foodconsult.com.br</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Header({ onMenuClick, title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5 text-gray-600" />
      </button>
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    </header>
  );
}
