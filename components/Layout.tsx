import React, { useState } from 'react';
import {
  LayoutDashboard, Home, ShoppingCart, Package, DollarSign, Truck,
  Gift, BarChart3, LogOut, User as UserIcon, TrendingDown, ClipboardList,
  FileText, Users, Settings as SettingsIcon, Menu, X, LayoutGrid, PackageCheck
} from 'lucide-react';
import { User, Branch } from '../types';
import { getFeatureSettings } from '../utils/featureSettings';
import { SELECTED_BRANCH_ALL } from '../hooks/useStore';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: any) => void;
  currentUser: User | null;
  onLogout: () => void;
  branches?: Branch[];
  selectedBranchId?: string;
  onSelectedBranchChange?: (branchId: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  CASHIER: 'Cajero/a',
  REPOSITOR: 'Repositor/a',
};

export const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  branches = [],
  selectedBranchId = SELECTED_BRANCH_ALL,
  onSelectedBranchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const features = getFeatureSettings();
  const role = currentUser?.role ?? 'CASHIER';
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR';
  const isRepositor = role === 'REPOSITOR';
  const showBranchSelector = (isAdmin || isSupervisor) && branches.length > 0 && onSelectedBranchChange;

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
    <div className="h-screen max-h-screen bg-gray-100 flex flex-col md:flex-row overflow-hidden">
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
      <nav className={`bg-slate-900 text-white w-64 flex-shrink-0 flex flex-col h-screen min-h-0 sticky top-0 z-50
        ${mobileMenuOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden'} md:flex md:relative`}>
        {/* Solo esta zona hace scroll; el pie (usuario / Cerrar sesión) queda fijo abajo */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              Nueva<span className="text-blue-400">Era</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Supermercado</p>
            {showBranchSelector && (
              <div className="mt-3">
                <label className="text-xs text-slate-400 block mb-1">Ver como sucursal</label>
                <select
                  value={selectedBranchId}
                  onChange={(e) => onSelectedBranchChange(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-600 text-white text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={SELECTED_BRANCH_ALL}>Todas</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="p-4 space-y-1">
            {/* INICIO: todos los roles */}
            {navBtn('inicio', 'Inicio', Home)}

            {/* CAJERO: solo POS */}
            {(isAdmin || isSupervisor || role === 'CASHIER') && navBtn('pos', 'Punto de Venta', ShoppingCart)}

            {/* Cajas: Admin y Supervisor (respeta configuración) */}
            {features.moduloCajas && (isAdmin || isSupervisor) && navBtn('cajas', 'Cajas', LayoutGrid)}

            {/* REPOSITOR: solo su módulo */}
            {features.moduloRepositor && (isRepositor || isAdmin) && navBtn('repositor', 'Reposición de Stock', ClipboardList)}

            {/* SUPERVISOR y ADMIN */}
            {(isAdmin || isSupervisor) && navBtn('inventory', 'Inventario', Package)}
            {features.moduloReportes && (isAdmin || isSupervisor) && navBtn('reports', 'Reportes', BarChart3)}
            {features.moduloDistribucion && (isAdmin || isSupervisor) && navBtn('distribucion', 'Distribución', PackageCheck)}

            {/* SOLO ADMIN */}
            {isAdmin && (
              <>
                {navBtn('finance', 'Caja y Finanzas', DollarSign)}
                {features.moduloEgresos && navBtn('egresos', 'Egresos', TrendingDown)}
                {features.moduloProveedores && navBtn('suppliers', 'Proveedores', Truck)}
                {features.moduloPromociones && navBtn('promotions', 'Promociones', Gift)}
                {features.moduloAuditoria && navBtn('audit', 'Auditoría', FileText)}
                {navBtn('users', 'Usuarios', Users)}
                {navBtn('settings', 'Configuración', SettingsIcon)}
              </>
            )}
          </div>
        </div>

        {/* Pie fijo: usuario y Cerrar sesión (no tapan el menú) */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900 mt-auto">
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
      <main className="flex-1 min-h-0 overflow-auto relative pb-[env(safe-area-inset-bottom)]">
        {children}
      </main>
    </div>
  );
};
