import React, { useState } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, DollarSign, Truck,
  Gift, BarChart3, LogOut, User as UserIcon, TrendingDown, ClipboardList,
  FileText, Users, Settings as SettingsIcon, Menu, X
} from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: any) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  CASHIER: 'Cajero/a',
  REPOSITOR: 'Repositor/a',
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, currentUser, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = currentUser?.role ?? 'CASHIER';
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR';
  const isRepositor = role === 'REPOSITOR';

  const navBtn = (tab: string, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => { onTabChange(tab); setMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
        activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-blue-400" />
          Nueva<span className="text-blue-400">Era</span>
        </h1>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar: overlay on mobile when open, fixed on md+ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden
        />
      )}
      <nav className={`bg-slate-900 text-white w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 z-50
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden'} md:flex md:relative`}>
        <div>
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              Nueva<span className="text-blue-400">Era</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Supermercado</p>
          </div>

          <div className="p-4 space-y-1">
            {/* CAJERO: solo POS */}
            {(isAdmin || isSupervisor || role === 'CASHIER') && navBtn('pos', 'Punto de Venta', ShoppingCart)}

            {/* REPOSITOR: solo su módulo */}
            {isRepositor && navBtn('repositor', 'Reposición de Stock', ClipboardList)}

            {/* SUPERVISOR y ADMIN */}
            {(isAdmin || isSupervisor) && navBtn('inventory', 'Inventario', Package)}
            {(isAdmin || isSupervisor) && navBtn('reports', 'Reportes', BarChart3)}

            {/* SOLO ADMIN */}
            {isAdmin && (
              <>
                {navBtn('finance', 'Caja y Finanzas', DollarSign)}
                {navBtn('egresos', 'Egresos', TrendingDown)}
                {navBtn('suppliers', 'Proveedores', Truck)}
                {navBtn('promotions', 'Promociones', Gift)}
                {navBtn('audit', 'Auditoría', FileText)}
                {navBtn('users', 'Usuarios', Users)}
                {navBtn('settings', 'Configuración', SettingsIcon)}
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {currentUser?.fullName?.charAt(0) ?? 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{ROLE_LABELS[role] ?? role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen relative">
        {children}
      </main>
    </div>
  );
};
