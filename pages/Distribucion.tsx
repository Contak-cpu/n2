import React, { useState, useMemo } from 'react';
import {
  PackageCheck,
  Plus,
  Clock,
  User,
  Truck,
  MapPin,
  ChevronDown,
  X,
} from 'lucide-react';
import { Despacho, DespachoItem, DespachoEstado, Client, Product, Branch } from '../types';
import { MEDIO_SALIDA_OPTIONS } from '../constants';

interface DistribucionProps {
  despachos: Despacho[];
  branches: Branch[];
  clients: Client[];
  products: Product[];
  onAddDespacho: (d: Despacho) => void;
  onUpdateDespacho: (id: string, updates: Partial<Despacho>) => void;
}

const ESTADO_LABELS: Record<DespachoEstado, string> = {
  PENDIENTE: 'Pendiente',
  EN_CAMINO: 'En camino',
  ENTREGADO: 'Entregado',
};

const ESTADO_COLORS: Record<DespachoEstado, string> = {
  PENDIENTE: 'bg-amber-100 text-amber-800',
  EN_CAMINO: 'bg-blue-100 text-blue-800',
  ENTREGADO: 'bg-green-100 text-green-800',
};

export const Distribucion: React.FC<DistribucionProps> = ({
  despachos,
  branches,
  clients,
  products,
  onAddDespacho,
  onUpdateDespacho,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string>('');
  const [filterEstado, setFilterEstado] = useState<string>('');
  const [filterCliente, setFilterCliente] = useState('');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [detailId, setDetailId] = useState<string | null>(null);

  // Form state
  const [clientId, setClientId] = useState<string>('');
  const [clientNameFree, setClientNameFree] = useState('');
  const [branchId, setBranchId] = useState<string>(branches[0]?.id ?? '');
  const [items, setItems] = useState<DespachoItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [quienLleva, setQuienLleva] = useState('');
  const [horaSalida, setHoraSalida] = useState('');
  const [medioSalida, setMedioSalida] = useState(MEDIO_SALIDA_OPTIONS[0] ?? '');
  const [observaciones, setObservaciones] = useState('');

  const filteredDespachos = useMemo(() => {
    return despachos.filter((d) => {
      if (filterBranch && d.branchId !== filterBranch) return false;
      if (filterEstado && d.estado !== filterEstado) return false;
      if (filterCliente && !d.clientName.toLowerCase().includes(filterCliente.toLowerCase())) return false;
      if (filterFechaDesde && d.date.slice(0, 10) < filterFechaDesde) return false;
      if (filterFechaHasta && d.date.slice(0, 10) > filterFechaHasta) return false;
      return true;
    });
  }, [despachos, filterBranch, filterEstado, filterCliente, filterFechaDesde, filterFechaHasta]);

  const addItem = () => {
    if (!selectedProductId) return;
    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;
    const existing = items.find((i) => i.productId === selectedProductId);
    if (existing) {
      setItems((prev) =>
        prev.map((i) =>
          i.productId === selectedProductId
            ? { ...i, quantity: i.quantity + selectedQty }
            : i
        )
      );
    } else {
      setItems((prev) => [
        ...prev,
        { productId: product.id, name: product.name, quantity: selectedQty, unitPrice: product.price },
      ]);
    }
    setSelectedProductId('');
    setSelectedQty(1);
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const getClientName = (): string => {
    if (clientId) {
      const c = clients.find((x) => x.id === clientId);
      return c?.name ?? clientNameFree;
    }
    return clientNameFree.trim() || 'Sin especificar';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientName = getClientName();
    if (!clientName.trim()) return;
    if (items.length === 0) return;
    const now = new Date();
    const hora = horaSalida || now.toTimeString().slice(0, 5);
    const despacho: Despacho = {
      id: Date.now().toString(),
      date: now.toISOString(),
      clientId: clientId || undefined,
      clientName,
      branchId,
      items: [...items],
      quienLleva: quienLleva.trim() || 'No indicado',
      horaSalida: hora,
      medioSalida: medioSalida || MEDIO_SALIDA_OPTIONS[0],
      estado: 'PENDIENTE',
      observaciones: observaciones.trim() || undefined,
    };
    onAddDespacho(despacho);
    setShowForm(false);
    setClientId('');
    setClientNameFree('');
    setBranchId(branches[0]?.id ?? '');
    setItems([]);
    setQuienLleva('');
    setHoraSalida('');
    setMedioSalida(MEDIO_SALIDA_OPTIONS[0] ?? '');
    setObservaciones('');
  };

  const branchName = (id: string) => branches.find((b) => b.id === id)?.name ?? id;

  return (
    <div className="p-4 sm:p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <PackageCheck className="text-blue-600 flex-shrink-0" size={28} />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Distribución</h1>
            <p className="text-sm text-gray-500">Trazabilidad de ventas mayoristas: qué se vendió, a dónde, quién lleva y cómo sale</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo despacho
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Filtrar por cliente"
          value={filterCliente}
          onChange={(e) => setFilterCliente(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
        />
        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48"
        >
          <option value="">Todas las sucursales</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
        >
          <option value="">Todos los estados</option>
          {(Object.keys(ESTADO_LABELS) as DespachoEstado[]).map((e) => (
            <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterFechaDesde}
          onChange={(e) => setFilterFechaDesde(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="date"
          value={filterFechaHasta}
          onChange={(e) => setFilterFechaHasta(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 min-h-0">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha / Hora salida</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Sucursal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Quién lleva</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Medio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-24">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDespachos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    No hay despachos. Creá uno con &quot;Nuevo despacho&quot;.
                  </td>
                </tr>
              ) : (
                filteredDespachos.map((d) => (
                  <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>{new Date(d.date).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> {d.horaSalida}
                      </div>
                    </td>
                    <td className="py-3 px-4">{d.clientName}</td>
                    <td className="py-3 px-4 flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      {branchName(d.branchId)}
                    </td>
                    <td className="py-3 px-4">{d.quienLleva}</td>
                    <td className="py-3 px-4">{d.medioSalida}</td>
                    <td className="py-3 px-4">
                      <select
                        value={d.estado}
                        onChange={(e) => onUpdateDespacho(d.id, { estado: e.target.value as DespachoEstado })}
                        className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${ESTADO_COLORS[d.estado]}`}
                      >
                        {(Object.keys(ESTADO_LABELS) as DespachoEstado[]).map((e) => (
                          <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setDetailId(detailId === d.id ? null : d.id)}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        {detailId === d.id ? 'Ocultar' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {detailId && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {(() => {
              const d = despachos.find((x) => x.id === detailId);
              if (!d) return null;
              return (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Ítems del despacho</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {d.items.map((i) => (
                      <li key={i.productId}>
                        {i.name} x{i.quantity}
                        {i.unitPrice != null && ` — $${(i.unitPrice * i.quantity).toLocaleString()}`}
                      </li>
                    ))}
                  </ul>
                  {d.observaciones && (
                    <p className="mt-2 text-sm text-gray-600"><span className="font-medium">Obs.:</span> {d.observaciones}</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Nuevo despacho</h2>
              <button type="button" onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">-- Otro (escribir abajo) --</option>
                  {clients.filter((c) => c.id !== '0').map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {!clientId && (
                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    value={clientNameFree}
                    onChange={(e) => setClientNameFree(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mt-1"
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sucursal origen</label>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Qué se vende (ítems)</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(Number(e.target.value) || 1)}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-2 text-sm"
                  />
                  <button type="button" onClick={addItem} className="bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-2 text-sm font-medium">
                    Agregar
                  </button>
                </div>
                {items.length > 0 && (
                  <ul className="space-y-1">
                    {items.map((i) => (
                      <li key={i.productId} className="flex items-center justify-between text-sm bg-gray-50 rounded px-2 py-1">
                        <span>{i.name} x{i.quantity}</span>
                        <button type="button" onClick={() => removeItem(i.productId)} className="text-red-600 hover:underline">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quién lleva</label>
                <input
                  type="text"
                  placeholder="Nombre de quien lleva"
                  value={quienLleva}
                  onChange={(e) => setQuienLleva(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora de salida</label>
                <input
                  type="time"
                  value={horaSalida}
                  onChange={(e) => setHoraSalida(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cómo sale</label>
                <select
                  value={medioSalida}
                  onChange={(e) => setMedioSalida(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  {MEDIO_SALIDA_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Observaciones</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={!getClientName().trim() || items.length === 0}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar despacho
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
