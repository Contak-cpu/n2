import React, { useMemo } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  LayoutGrid,
  BarChart3,
  Wallet,
  ArrowRight,
  Users,
  Calendar,
} from 'lucide-react';
import { User, Product, Restocking, Transaction, CheckoutLine, Egreso } from '../types';
import { TransactionType } from '../types';
import { getFeatureSettings } from '../utils/featureSettings';

const LOW = 10;
const CRITICAL = 5;

interface InicioProps {
  currentUser: User;
  products: Product[];
  restocking: Restocking[];
  transactions: Transaction[];
  checkoutLines: CheckoutLine[];
  users: User[];
  currentBalance: number;
  egresos: Egreso[];
  onNavigate: (tab: string) => void;
}

export const Inicio: React.FC<InicioProps> = ({
  currentUser,
  products,
  restocking,
  transactions,
  checkoutLines,
  users,
  currentBalance,
  egresos,
  onNavigate,
}) => {
  const features = getFeatureSettings();
  const role = currentUser.role;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useMemo(() => {
    const todayTx = transactions.filter(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === today && t.type === TransactionType.INCOME;
    });
    const ventasHoy = todayTx.reduce((acc, t) => acc + (t.amount ?? 0), 0);
    const cajasAbiertas = checkoutLines.filter(l => l.status === 'OPEN').length;
    const critical = products.filter(p => p.stockGondola < CRITICAL).length;
    const low = products.filter(p => p.stockGondola >= CRITICAL && p.stockGondola < LOW).length;
    const restockedToday = restocking.filter(r => {
      const t = new Date(typeof r.timestamp === 'string' ? r.timestamp : (r as any).timestamp);
      t.setHours(0, 0, 0, 0);
      return t.getTime() === today;
    }).length;
    const unidadesRepuestas = restocking.filter(r => {
      const t = new Date(typeof r.timestamp === 'string' ? r.timestamp : (r as any).timestamp);
      t.setHours(0, 0, 0, 0);
      return t.getTime() === today;
    }).reduce((acc, r) => acc + r.quantity, 0);
    const egresosMes = egresos
      .filter(e => e.date.slice(0, 7) === new Date().toISOString().slice(0, 7))
      .reduce((acc, e) => acc + e.amount, 0);

    return {
      ventasHoy,
      transaccionesHoy: todayTx.length,
      cajasAbiertas,
      totalCajas: checkoutLines.length,
      critical,
      low,
      restockedToday,
      unidadesRepuestas,
      egresosMes,
    };
  }, [transactions, today, checkoutLines, products, restocking, egresos]);

  const myOpenLine = useMemo(() => {
    if (role !== 'CASHIER') return null;
    return checkoutLines.find(l => l.status === 'OPEN' && l.cashierId === currentUser.id);
  }, [checkoutLines, currentUser.id, role]);

  const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );

  const LinkCard: React.FC<{
    title: string;
    subtitle?: string;
    icon: React.ElementType;
    tab: string;
  }> = ({ title, subtitle, icon: Icon, tab }) => (
    <button
      type="button"
      onClick={() => onNavigate(tab)}
      className="w-full text-left bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4 group"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600 group-hover:scale-105 transition-transform">
        <Icon size={24} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <ArrowRight className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" size={20} />
    </button>
  );

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutDashboard className="text-blue-600" size={28} />
          Inicio
        </h1>
      </div>

      {/* Tarjeta de bienvenida (todos) */}
      <Card className="mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border-0 text-white">
        <p className="text-slate-300 text-sm font-medium mb-1">Bienvenido</p>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">{currentUser.fullName}</h2>
        <p className="text-slate-400 text-sm">¿Cómo estuvo tu día?</p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* REPOSITOR */}
        {role === 'REPOSITOR' && (
          <>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-red-500" size={22} />
                <span className="font-semibold text-gray-800">Stock crítico</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-xs text-gray-500 mt-1">Productos con menos de 5 un. en góndola</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Package className="text-orange-500" size={22} />
                <span className="font-semibold text-gray-800">Stock bajo</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.low}</p>
              <p className="text-xs text-gray-500 mt-1">Entre 5 y 10 unidades</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-green-500" size={22} />
                <span className="font-semibold text-gray-800">Reposiciones hoy</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{stats.restockedToday}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.unidadesRepuestas} un. repuestas (equipo)</p>
            </Card>
            {features.moduloRepositor && (
              <div className="sm:col-span-2 lg:col-span-3">
                <LinkCard
                  title="Ir a Reposición de Stock"
                  subtitle="Escanear y reponer depósito → góndola. Historial compartido con todo el equipo."
                  icon={ClipboardList}
                  tab="repositor"
                />
              </div>
            )}
          </>
        )}

        {/* CAJERO */}
        {role === 'CASHIER' && (
          <>
            {myOpenLine && (
              <Card>
                <div className="flex items-center gap-3 mb-2">
                  <LayoutGrid className="text-green-600" size={22} />
                  <span className="font-semibold text-gray-800">Mi caja</span>
                </div>
                <p className="text-lg font-bold text-gray-800">{myOpenLine.name}</p>
                <p className="text-sm text-gray-500 mt-1">Abierta · ${myOpenLine.totalSales.toLocaleString()} vendido</p>
              </Card>
            )}
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-blue-600" size={22} />
                <span className="font-semibold text-gray-800">Ventas hoy</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">${stats.ventasHoy.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.transaccionesHoy} transacciones</p>
            </Card>
            <div className={myOpenLine ? '' : 'sm:col-span-2'}>
              <LinkCard title="Ir a Punto de Venta" subtitle="Cobrar y escanear productos" icon={ShoppingCart} tab="pos" />
            </div>
          </>
        )}

        {/* SUPERVISOR */}
        {(role === 'SUPERVISOR') && (
          <>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <LayoutGrid className="text-blue-600" size={22} />
                <span className="font-semibold text-gray-800">Cajas</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.cajasAbiertas} / {stats.totalCajas}</p>
              <p className="text-xs text-gray-500 mt-1">Abiertas ahora</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-green-600" size={22} />
                <span className="font-semibold text-gray-800">Ventas hoy</span>
              </div>
              <p className="text-2xl font-bold text-green-700">${stats.ventasHoy.toLocaleString()}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Package className="text-orange-500" size={22} />
                <span className="font-semibold text-gray-800">Stock bajo</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">{stats.critical + stats.low}</p>
              <p className="text-xs text-gray-500 mt-1">Productos a vigilar</p>
            </Card>
            {features.moduloCajas && (
              <LinkCard title="Ir a Cajas" subtitle="Abrir/cerrar líneas de cobro" icon={LayoutGrid} tab="cajas" />
            )}
            {features.moduloReportes && (
              <LinkCard title="Ir a Reportes" subtitle="Ventas y estadísticas" icon={BarChart3} tab="reports" />
            )}
            <LinkCard title="Ir a Inventario" subtitle="Stock depósito y góndola" icon={Package} tab="inventory" />
          </>
        )}

        {/* ADMIN */}
        {role === 'ADMIN' && (
          <>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="text-emerald-600" size={22} />
                <span className="font-semibold text-gray-800">Balance en caja</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">${currentBalance.toLocaleString()}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="text-green-600" size={22} />
                <span className="font-semibold text-gray-800">Ventas hoy</span>
              </div>
              <p className="text-2xl font-bold text-green-700">${stats.ventasHoy.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.transaccionesHoy} transacciones</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <LayoutGrid className="text-blue-600" size={22} />
                <span className="font-semibold text-gray-800">Cajas abiertas</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.cajasAbiertas} / {stats.totalCajas}</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="text-red-500" size={22} />
                <span className="font-semibold text-gray-800">Stock crítico / bajo</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              <p className="text-sm text-orange-600 font-medium">{stats.low} bajo</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="text-emerald-500" size={22} />
                <span className="font-semibold text-gray-800">Reposiciones hoy</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.restockedToday}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.unidadesRepuestas} un. (equipo)</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="text-purple-500" size={22} />
                <span className="font-semibold text-gray-800">Egresos del mes</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">${stats.egresosMes.toLocaleString()}</p>
            </Card>
            <LinkCard title="Caja y Finanzas" subtitle="Movimientos y balance" icon={Wallet} tab="finance" />
            {features.moduloReportes && (
              <LinkCard title="Reportes" subtitle="Estadísticas y gráficos" icon={BarChart3} tab="reports" />
            )}
            {features.moduloCajas && (
              <LinkCard title="Cajas" subtitle="Líneas de cobro" icon={LayoutGrid} tab="cajas" />
            )}
            <LinkCard title="Inventario" subtitle="Productos y stock" icon={Package} tab="inventory" />
            {features.moduloRepositor && (
              <LinkCard title="Reposición de Stock" subtitle="Historial compartido del equipo" icon={ClipboardList} tab="repositor" />
            )}
            <LinkCard title="Usuarios" subtitle="Gestión de accesos" icon={Users} tab="users" />
          </>
        )}
      </div>
    </div>
  );
};
