import React, { useState, useMemo } from 'react';
import { TrendingDown, Plus, Trash2, Filter, DollarSign, Calendar, Tag } from 'lucide-react';
import { Egreso, EgresoCategory, PaymentMethod } from '../types';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';

interface EgresosProps {
  egresos: Egreso[];
  onAdd: (egreso: Egreso) => void;
  onRemove: (id: string) => void;
  currentUser: string;
}

const CATEGORIAS: EgresoCategory[] = [
  'Sueldos y Honorarios',
  'Alquiler',
  'Servicios (Luz/Gas/Internet)',
  'Compra de Mercadería',
  'Mantenimiento',
  'Impuestos y Tasas',
  'Logística y Flete',
  'Otros',
];

const CATEGORY_COLORS: Record<EgresoCategory, string> = {
  'Sueldos y Honorarios': 'bg-blue-100 text-blue-700',
  'Alquiler': 'bg-purple-100 text-purple-700',
  'Servicios (Luz/Gas/Internet)': 'bg-yellow-100 text-yellow-700',
  'Compra de Mercadería': 'bg-orange-100 text-orange-700',
  'Mantenimiento': 'bg-gray-100 text-gray-700',
  'Impuestos y Tasas': 'bg-red-100 text-red-700',
  'Logística y Flete': 'bg-cyan-100 text-cyan-700',
  'Otros': 'bg-slate-100 text-slate-700',
};

const EMPTY_FORM = {
  description: '',
  amount: '',
  category: 'Otros' as EgresoCategory,
  method: PaymentMethod.CASH as any,
};

export const Egresos: React.FC<EgresosProps> = ({ egresos, onAdd, onRemove, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<EgresoCategory | 'Todos'>('Todos');
  const [filterMonth, setFilterMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return egresos.filter(e => {
      const eMonth = e.date.slice(0, 7);
      const matchMonth = !filterMonth || eMonth === filterMonth;
      const matchCat = filterCategory === 'Todos' || e.category === filterCategory;
      return matchMonth && matchCat;
    });
  }, [egresos, filterCategory, filterMonth]);

  const stats = useMemo(() => {
    const totalMes = filtered.reduce((acc, e) => acc + e.amount, 0);
    const totalGeneral = egresos.reduce((acc, e) => acc + e.amount, 0);
    const byCat = CATEGORIAS.map(cat => ({
      name: cat,
      total: filtered.filter(e => e.category === cat).reduce((acc, e) => acc + e.amount, 0),
    })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
    return { totalMes, totalGeneral, byCat };
  }, [filtered, egresos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;

    const nuevo: Egreso = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: parseFloat(form.amount),
      category: form.category,
      description: form.description.trim(),
      method: form.method,
      registeredBy: currentUser,
    };
    onAdd(nuevo);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col min-h-0 h-full bg-gray-50 overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <TrendingDown className="text-red-500" size={32} />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Egresos</h1>
            <p className="text-sm text-gray-500">Registro de gastos y salidas de dinero</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Nuevo Egreso
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-xl border border-red-100 shadow-sm mb-6 overflow-visible">
          <div className="bg-red-50 px-6 py-3 border-b border-red-100">
            <h2 className="font-semibold text-red-700 flex items-center gap-2">
              <Plus size={18} /> Registrar nuevo egreso
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[70vh]">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
              <input
                type="text"
                placeholder="Ej: Pago sueldo Enero, Factura luz..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto ($) *</label>
              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm"
                value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm bg-white"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as EgresoCategory }))}
              >
                {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-400 text-sm bg-white"
                value={form.method}
                onChange={e => setForm(f => ({ ...f, method: e.target.value }))}
              >
                <option value={PaymentMethod.CASH}>Efectivo</option>
                <option value={PaymentMethod.CARD}>Débito/Crédito</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value={PaymentMethod.MERCADOPAGO}>MercadoPago</option>
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}
                className="px-5 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 text-sm"
              >
                Registrar Egreso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Egresos Este Mes"
          value={`$${stats.totalMes.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          label="Total Egresos General"
          value={`$${stats.totalGeneral.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`}
          icon={DollarSign}
          color="purple"
        />
        <StatCard
          label="Cantidad Este Mes"
          value={filtered.length.toString()}
          icon={Tag}
          color="yellow"
        />
      </div>

      {/* Desglose por categoría */}
      {stats.byCat.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Desglose por Categoría (Mes Actual)</h3>
          <div className="space-y-2">
            {stats.byCat.map(cat => {
              const pct = stats.totalMes > 0 ? (cat.total / stats.totalMes) * 100 : 0;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat.name}</span>
                    <span className="font-semibold text-gray-800">${cat.total.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtros y lista */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <Filter size={16} />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <input
              type="month"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-400"
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-red-400 bg-white"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as any)}
          >
            <option value="Todos">Todas las categorías</option>
            {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} registro(s)</span>
        </div>

        {/* Tabla: scroll vertical y horizontal en el detalle */}
        <div className="overflow-auto max-h-[50vh] sm:max-h-[60vh]" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Categoría</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Método</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Registrado por</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Monto</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    <TrendingDown size={40} className="mx-auto mb-2 opacity-30" />
                    <p>No hay egresos registrados para este período</p>
                  </td>
                </tr>
              ) : (
                filtered.map(egreso => (
                  <tr key={egreso.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(egreso.date).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                      })}
                      <br />
                      <span className="text-gray-400">
                        {new Date(egreso.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-800 max-w-xs">
                      {egreso.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[egreso.category]}`}>
                        {egreso.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">{String(egreso.method)}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{egreso.registeredBy}</td>
                    <td className="py-3 px-4 text-right font-bold text-red-600">
                      ${egreso.amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3 px-4">
                      {confirmDelete === egreso.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => { onRemove(egreso.id); setConfirmDelete(null); }}
                            className="text-xs px-2 py-1 bg-red-600 text-white rounded font-medium"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded font-medium"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(egreso.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total del período</p>
              <p className="text-2xl font-bold text-red-600">
                ${stats.totalMes.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
