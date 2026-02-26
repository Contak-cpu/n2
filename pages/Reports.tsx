import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Transaction, Product } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';

interface ReportsProps {
  transactions: Transaction[];
  products: Product[];
  currentBalance: number;
}

export const Reports: React.FC<ReportsProps> = ({ transactions, products, currentBalance }) => {
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      tDate.setHours(0, 0, 0, 0);
      return tDate.getTime() === today.getTime();
    });

    const totalSales = todayTransactions.reduce((acc, t) => acc + t.amount, 0);
    const transactionCount = todayTransactions.length;
    const avgPerTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;

    // Top products
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
      .slice(0, 5);

    // Payment methods
    const paymentMethods = new Map<string, number>();
    todayTransactions.forEach(t => {
      const method = String(t.method);
      paymentMethods.set(method, (paymentMethods.get(method) || 0) + t.amount);
    });

    // Sales by hour (today)
    const salesByHour = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h.toString().padStart(2, '0')}:00`,
      ventas: 0,
    }));
    todayTransactions.forEach(t => {
      const h = new Date(t.date).getHours();
      salesByHour[h].ventas += t.amount;
    });

    // Low stock
    const lowStockProducts = products.filter(p => p.stockGondola < 10).length;

    return {
      totalSales,
      transactionCount,
      avgPerTransaction,
      topProducts,
      paymentMethods,
      salesByHour,
      lowStockProducts,
      currentBalance,
    };
  }, [transactions, products]);

  return (
    <div className="p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      {/* Ventas por hora (línea) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ventas por Hora (Hoy)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.salesByHour} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={v => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Ventas']} labelFormatter={l => `Hora ${l}`} />
              <Line type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} name="Ventas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Products (barras) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Productos Más Vendidos (Hoy)</h2>
          {stats.topProducts.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topProducts.map(p => ({ ...p, name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name }))}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tickFormatter={v => `$${v}`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={78} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => [`$${Number(v).toLocaleString()}`, 'Ventas']} />
                  <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} name="Ventas" />
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
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Array.from(stats.paymentMethods.entries()).map(([name, value]) => ({ name, value }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Array.from(stats.paymentMethods.entries()).map((_, i) => (
                      <Cell key={i} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${Number(v).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Sin datos disponibles</p>
          )}
        </div>
      </div>

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

      {/* Detailed Transactions */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Últimas Transacciones</h2>
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
              {transactions.slice(0, 10).map(t => (
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
          {transactions.length === 0 && (
            <p className="text-gray-500 text-center py-8">Sin transacciones registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};
