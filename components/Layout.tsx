import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, DollarSign, Truck, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: any) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <nav className="bg-slate-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              Nueva<span className="text-blue-400">Era</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Mayorista & Distribuidora</p>
          </div>
          <div className="p-4 space-y-2">
            <button
              onClick={() => onTabChange('pos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'pos' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <ShoppingCart size={20} />
              <span className="font-medium">Punto de Venta</span>
            </button>
            
            {isAdmin && (
              <>
                <button
                  onClick={() => onTabChange('inventory')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Package size={20} />
                  <span className="font-medium">Inventario</span>
                </button>
                
                <button
                  onClick={() => onTabChange('finance')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'finance' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <DollarSign size={20} />
                  <span className="font-medium">Caja y Finanzas</span>
                </button>

                <button
                  onClick={() => onTabChange('suppliers')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'suppliers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Truck size={20} />
                  <span className="font-medium">Proveedores</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{currentUser?.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser?.role === 'ADMIN' ? 'Administrador' : 'Cajero'}</p>
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