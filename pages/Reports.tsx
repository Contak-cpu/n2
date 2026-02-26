import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Transaction, Product, Egreso } from '../types';
import { TransactionType } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const COLORS_PIE = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
  egresos: Egreso[];
  currentBalance: number;
}

export const Reports: React.FC<ReportsProps> = ({ transactions, products, egresos, currentBalance }) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');

    const todayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === today.getTime() && t.type === TransactionType.INCOME;
    });

    const totalSales = todayTransactions.reduce((acc, t) => acc + t.amount, 0);
    const transactionCount = todayTransactions.length;
    const avgPerTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;

    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    todayTransactions.forEach(t => {
      t.items?.forEach(item => {
        const existing = productSales.get(item.id) || { name: item.name, quantity: 0, revenue: 0 };
        productSales.set(item.id, {
          name: item.name,
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + (item.appliedPrice * item.quantity),
        });
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    const paymentMethods = new Map<string, number>();
    todayTransactions.forEach(t => {
      const method = String(t.method);
      paymentMethods.set(method, (paymentMethods.get(method) || 0) + t.amount);
    });

    const salesByHour = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h.toString().padStart(2, '0')}:00`,
      ventas: 0,
    }));
    todayTransactions.forEach(t => {
      const h = new Date(t.date).getHours();
      salesByHour[h].ventas += t.amount;
    });

    const lowStockProducts = products.filter(p => p.stockGondola < 10).length;

    const ingresosMes = transactions
      .filter(t => t.type === TransactionType.INCOME && t.date.slice(0, 7) === currentMonth)
      .reduce((acc, t) => acc + t.amount, 0);
    const egresosMes = egresos
      .filter(e => e.date.slice(0, 7) === currentMonth)
      .reduce((acc, e) => acc + e.amount, 0);

    const egresosPorCategoria = egresos
      .filter(e => e.date.slice(0, 7) === currentMonth)
      .reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + e.amount;
        return acc;
      }, {} as Record<string, number>);
    const egresosCategoriaData = Object.entries(egresosPorCategoria)
      .map(([name, value]) => ({ name: name.length > 18 ? name.slice(0, 18) + '…' : name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      totalSales,
      transactionCount,
      avgPerTransaction,
      topProducts,
      paymentMethods,
      salesByHour,
      lowStockProducts,
      currentBalance,
      ingresosMes,
      egresosMes,
      egresosCategoriaData,
    };
  }, [transactions, products, egresos]);

  return (
    <div className="p-4 sm:p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <BarChart3 className="text-blue-600 flex-shrink-0" size={28} />
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <StatCard
          label="Ventas Hoy"
          value={`$${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          trend={stats.totalSales > 0 ? { value: 12, direction: 'up' } : undefined}
        />
        <StatCard
          label="Transacciones"
          value={stats.transactionCount.toString()}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          label="Promedio por Venta"
          value={`$${stats.avgPerTransaction.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          label="Balance Actual"
          value={`$${stats.currentBalance.toLocaleString()}`}
          icon={DollarSign}
          color={stats.currentBalance >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Ventas por hora (área, solo franja 7-22) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ventas por Hora (Hoy)</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={stats.salesByHour.filter((_, i) => i >= 7 && i <= 22)}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="ventasGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={v => v >= 1000 ? `$${v / 1000}k` : `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, 'Ventas']} contentStyle={{ borderRadius: 8 }} />
              <Area type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={2} fill="url(#ventasGradient)" name="Ventas" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ingresos vs Egresos (mes actual) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="text-emerald-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Ingresos del mes</p>
            <p className="text-2xl font-bold text-emerald-700">${stats.ingresosMes.toLocaleString('es-AR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center">
            <TrendingDown className="text-red-600" size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Egresos del mes</p>
            <p className="text-2xl font-bold text-red-700">${stats.egresosMes.toLocaleString('es-AR')}</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Products (barras) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos (Hoy)</h2>
          {stats.topProducts.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topProducts.map(p => ({ ...p, name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name }))}
                  layout="vertical"
                  margin={{ top: 5, right: 40, left: 90, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={v => `$${v >= 1000 ? v / 1000 + 'k' : v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, 'Ventas']} contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 6, 6, 0]} name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
          )}
        </div>

        {/* Métodos de Pago (pie) */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Métodos de Pago (Hoy)</h2>
          {stats.paymentMethods.size > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Array.from(stats.paymentMethods.entries()).map(([name, value]) => ({
                      name: name.replace(' (QR)', '').replace('MercadoPago', 'MP').replace('Débito/Crédito', 'Tarjeta'),
                      value,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={40}
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Array.from(stats.paymentMethods.entries()).map((_, i) => (
                      <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} stroke="#fff" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
          )}
        </div>
      </div>

      {/* Egresos por categoría (mes) */}
      {stats.egresosCategoriaData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Egresos por Categoría (Mes Actual)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.egresosCategoriaData}
                layout="vertical"
                margin={{ top: 5, right: 50, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={v => `$${v >= 1000 ? v / 1000 + 'k' : v}`} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={96} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 6, 6, 0]} name="Egresos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Inventory Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Estado del Inventario</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Productos</p>
            <p className="text-2xl font-bold text-blue-800 mt-2">{products.length}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Stock Bajo</p>
            <p className="text-2xl font-bold text-yellow-800 mt-2">{stats.lowStockProducts}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Stock Normal</p>
            <p className="text-2xl font-bold text-green-800 mt-2">{products.length - stats.lowStockProducts}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Valor Total Stock</p>
            <p className="text-xl font-bold text-purple-800 mt-2">
              ${products.reduce((acc, p) => acc + (p.cost * (p.stockDepot + p.stockGondola)), 0).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Transactions (solo ventas) */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Ventas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Hora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cajero</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Método</th>
              </tr>
            </thead>
            <tbody>
              {transactions.filter(t => t.type === TransactionType.INCOME).slice(0, 10).map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(t.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{t.clientName || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-700">{t.cashierName || 'N/A'}</td>
                  <td className="py-3 px-4 text-right font-medium text-green-600">${t.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" size="sm">{String(t.method)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.filter(t => t.type === TransactionType.INCOME).length === 0 && (
            <p className="text-gray-500 text-center py-8">Sin ventas registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};
