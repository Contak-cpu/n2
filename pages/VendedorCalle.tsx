import React, { useState, useMemo } from 'react';
import {
  Store,
  PlusCircle,
  List,
  FileText,
  Package,
  Truck,
  User,
  Building2,
  ChevronRight,
  Printer,
  CheckCircle,
  Clock,
  X,
  ShoppingCart,
} from 'lucide-react';
import type { VentaCalle, VentaCalleItem, Client, User as UserType, Branch, Product, Remito, OrdenRetiro, WorkingDay } from '../types';
import { PaymentMethod } from '../types';
import { BRANCHES } from '../constants';
import * as remitosService from '../services/remitosService';
import * as ordenesRetiroService from '../services/ordenesRetiroService';
import * as ventasCalleService from '../services/ventasCalleService';
import { ProductIcon } from '../components/ProductIcon';

type ViewMode = 'list' | 'new' | 'detail';
type AdminTab = 'vendedores' | 'ventas';

const DAY_NAMES: Record<WorkingDay, string> = {
  0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb',
};

const STATUS_LABELS: Record<string, string> = {
  BORRADOR: 'Borrador',
  CONFIRMADA: 'Confirmada',
  EN_PREPARACION: 'En preparación',
  RETIRADA: 'Retirada',
  ENTREGADA: 'Entregada',
};

const PAYMENT_OPTIONS: { value: VentaCalle['paymentMethod']; label: string }[] = [
  { value: PaymentMethod.CASH, label: 'Efectivo' },
  { value: PaymentMethod.CARD, label: 'Tarjeta' },
  { value: PaymentMethod.MERCADOPAGO, label: 'MercadoPago' },
  { value: 'Cuenta corriente', label: 'Cuenta corriente' },
  { value: 'Transferencia', label: 'Transferencia' },
];

interface VendedorCalleProps {
  currentUser: UserType | null;
  ventasCalle: VentaCalle[];
  clients: Client[];
  users: UserType[];
  products: Product[];
  branches: Branch[];
  onAddVentaCalle: (venta: VentaCalle) => void;
  onUpdateVentaCalle: (id: string, updates: Partial<VentaCalle>) => void;
  onLoadVentasCalle: () => void;
  getVentasCalleBySeller: (sellerId: string) => VentaCalle[];
  onUpdateUser: (userId: string, updates: Partial<UserType>) => void;
  isAdmin?: boolean;
}

export const VendedorCalle: React.FC<VendedorCalleProps> = ({
  currentUser,
  ventasCalle,
  clients,
  users,
  products,
  branches,
  onAddVentaCalle,
  onUpdateVentaCalle,
  onLoadVentasCalle,
  getVentasCalleBySeller,
  onUpdateUser,
  isAdmin = false,
}) => {
  const [adminTab, setAdminTab] = useState<AdminTab>('vendedores');
  const [view, setView] = useState<ViewMode>('list');
  const [selectedVenta, setSelectedVenta] = useState<VentaCalle | null>(null);
  const [filterVendedorId, setFilterVendedorId] = useState<string>('');
  const [remitoModal, setRemitoModal] = useState<{ venta: VentaCalle; remito: Remito } | null>(null);
  const [ordenRetiroModal, setOrdenRetiroModal] = useState<OrdenRetiro | null>(null);

  const vendedores = useMemo(() => users.filter((u) => u.role === 'VENDEDOR_CALLE'), [users]);
  const sellerId = currentUser?.id ?? '';
  const ventasParaListar = useMemo(() => {
    const all = isAdmin ? ventasCalle : getVentasCalleBySeller(sellerId);
    if (isAdmin && filterVendedorId) return all.filter((v) => v.sellerId === filterVendedorId);
    return all;
  }, [isAdmin, ventasCalle, getVentasCalleBySeller, sellerId, filterVendedorId]);
  const ventasHoy = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return ventasParaListar.filter((v) => v.date.slice(0, 10) === today);
  }, [ventasParaListar]);
  const totalHoy = useMemo(() => ventasHoy.reduce((s, v) => s + v.total, 0), [ventasHoy]);
  const ordenesPendientes = useMemo(() => {
    const ordenes = ordenesRetiroService.getOrdenesRetiroBySeller(sellerId);
    return ordenes.filter((o) => o.status === 'PENDIENTE' || o.status === 'PREPARADA');
  }, [sellerId, ventasCalle]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-4 border-b border-slate-200 bg-white">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Store className="text-blue-600" />
          Vendedores
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isAdmin ? 'Administrá vendedores y consultá todas las ventas.' : 'Generá ventas y cobrá desde el celular.'}
        </p>
      </div>

      {/* Tabs: Admin = Vendedores | Ventas; Vendedor = Mis ventas | Nueva venta */}
      <div className="flex-shrink-0 flex flex-wrap gap-2 p-3 bg-slate-50 border-b border-slate-200">
        {isAdmin ? (
          <>
            <button
              type="button"
              onClick={() => setAdminTab('vendedores')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${adminTab === 'vendedores' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <User size={18} />
              Vendedores
            </button>
            <button
              type="button"
              onClick={() => setAdminTab('ventas')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${adminTab === 'ventas' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <FileText size={18} />
              Ventas
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => { setView('list'); setSelectedVenta(null); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <List size={18} />
              Mis ventas
            </button>
            <button
              type="button"
              onClick={() => setView('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${view === 'new' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              <PlusCircle size={18} />
              Nueva venta / Cobrar
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isAdmin && adminTab === 'vendedores' && (
          <VendedoresAdminList
            vendedores={vendedores}
            ventasCalle={ventasCalle}
            onUpdateUser={onUpdateUser}
          />
        )}

        {isAdmin && adminTab === 'ventas' && (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <label className="text-sm font-medium text-slate-600">Filtrar por vendedor:</label>
              <select
                value={filterVendedorId}
                onChange={(e) => setFilterVendedorId(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">Todos</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>{v.fullName}</option>
                ))}
              </select>
            </div>
            {view === 'list' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-slate-500 text-sm">Total ventas (filtro)</p>
                    <p className="text-2xl font-bold text-slate-800">{ventasParaListar.length}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-slate-500 text-sm">Monto total</p>
                    <p className="text-2xl font-bold text-green-600">${ventasParaListar.reduce((s, v) => s + v.total, 0).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold text-slate-800">Todas las ventas · Quién vendió · A quién</h2>
                  {ventasParaListar.length === 0 ? (
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-slate-500">No hay ventas con este filtro.</div>
                  ) : (
                    ventasParaListar.map((v) => (
                      <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-200">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800">{v.clientName}</p>
                            <p className="text-sm text-slate-500">
                              <span className="font-medium text-blue-600">{v.sellerName}</span>
                              {' → vendió a '}
                              <span className="font-medium">{v.contactUserName}</span>
                              {' · '}{v.date.slice(0, 10)} · {ventasCalleService.getBranchName(v.branchId)}
                            </p>
                            <p className="text-xs text-slate-400">${v.total.toLocaleString()} · {STATUS_LABELS[v.status]}</p>
                          </div>
                          <button type="button" onClick={() => { setSelectedVenta(v); setView('detail'); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium">
                            Ver <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
            {view === 'detail' && selectedVenta && (
              <VentaDetalle
                venta={selectedVenta}
                clients={clients}
                branches={branches}
                onClose={() => { setSelectedVenta(null); setView('list'); }}
                onGenerarRemito={() => {
                  const client = clients.find((c) => c.id === selectedVenta.clientId);
                  const { remito } = remitosService.generarRemito(selectedVenta, client?.cuit);
                  onUpdateVentaCalle(selectedVenta.id, { remitoId: remito.id, remitoNumber: remito.number });
                  onLoadVentasCalle();
                  setRemitoModal({ venta: { ...selectedVenta, remitoId: remito.id, remitoNumber: remito.number }, remito });
                }}
                onGenerarOrdenRetiro={() => {
                  const ordenes = ordenesRetiroService.generarOrdenRetiro(selectedVenta, selectedVenta.remitoNumber);
                  onUpdateVentaCalle(selectedVenta.id, { ordenRetiroId: ordenes[0].id });
                  onLoadVentasCalle();
                  setOrdenRetiroModal(ordenes[0]);
                }}
                tieneRemito={!!selectedVenta.remitoId}
                tieneOrdenRetiro={!!selectedVenta.ordenRetiroId}
              />
            )}
          </>
        )}

        {!isAdmin && view === 'list' && (
          <>
            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-slate-500 text-sm">Ventas hoy</p>
                <p className="text-2xl font-bold text-slate-800">{ventasHoy.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-slate-500 text-sm">Total hoy</p>
                <p className="text-2xl font-bold text-green-600">${totalHoy.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-slate-500 text-sm">Órdenes pendientes retiro</p>
                <p className="text-2xl font-bold text-amber-600">{ordenesPendientes.length}</p>
              </div>
            </div>

            {/* Lista de ventas */}
            <div className="space-y-2">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={18} />
                {isAdmin ? 'Todas las ventas' : 'Mis ventas'}
              </h2>
              {ventasParaListar.length === 0 ? (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  <Store size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No hay ventas registradas.</p>
                  <button
                    type="button"
                    onClick={() => setView('new')}
                    className="mt-3 text-blue-600 font-medium hover:underline"
                  >
                    Crear primera venta
                  </button>
                </div>
              ) : (
                ventasParaListar.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-200 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{v.clientName}</p>
                        <p className="text-sm text-slate-500">
                          {v.date.slice(0, 10)} · Contacto: {v.contactUserName} · {ventasCalleService.getBranchName(v.branchId)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          ${v.total.toLocaleString()} · {STATUS_LABELS[v.status]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {v.status === 'CONFIRMADA' && (
                          <>
                            {!v.remitoId && (
                              <button
                                type="button"
                                onClick={() => {
                                  const client = clients.find((c) => c.id === v.clientId);
                                  const { remito, ventaActualizada } = remitosService.generarRemito(v, client?.cuit);
                                  onUpdateVentaCalle(v.id, { remitoId: remito.id, remitoNumber: remito.number });
                                  onLoadVentasCalle();
                                  setRemitoModal({ venta: ventaActualizada, remito });
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-medium"
                              >
                                <Printer size={14} />
                                Remito
                              </button>
                            )}
                            {v.remitoId && !v.ordenRetiroId && (
                              <button
                                type="button"
                                onClick={() => {
                                  const ordenes = ordenesRetiroService.generarOrdenRetiro(v, v.remitoNumber);
                                  const orden = ordenes[0];
                                  onUpdateVentaCalle(v.id, { ordenRetiroId: orden.id });
                                  onLoadVentasCalle();
                                  setOrdenRetiroModal(orden);
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 text-sm font-medium"
                              >
                                <Package size={14} />
                                Orden retiro
                              </button>
                            )}
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => { setSelectedVenta(v); setView('detail'); }}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
                        >
                          Ver
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {!isAdmin && view === 'new' && (
          <NuevaVentaForm
            currentUser={currentUser}
            clients={clients}
            users={users}
            products={products}
            branches={branches}
            onSave={(venta) => {
              onAddVentaCalle(venta);
              setView('list');
            }}
            onCancel={() => setView('list')}
          />
        )}

        {!isAdmin && view === 'detail' && selectedVenta && (
          <VentaDetalle
            venta={selectedVenta}
            clients={clients}
            branches={branches}
            onClose={() => { setSelectedVenta(null); setView('list'); }}
            onGenerarRemito={() => {
              const client = clients.find((c) => c.id === selectedVenta.clientId);
              const { remito } = remitosService.generarRemito(selectedVenta, client?.cuit);
              onUpdateVentaCalle(selectedVenta.id, { remitoId: remito.id, remitoNumber: remito.number });
              onLoadVentasCalle();
              setRemitoModal({ venta: { ...selectedVenta, remitoId: remito.id, remitoNumber: remito.number }, remito });
            }}
            onGenerarOrdenRetiro={() => {
              const ordenes = ordenesRetiroService.generarOrdenRetiro(selectedVenta, selectedVenta.remitoNumber);
              onUpdateVentaCalle(selectedVenta.id, { ordenRetiroId: ordenes[0].id });
              onLoadVentasCalle();
              setOrdenRetiroModal(ordenes[0]);
            }}
            tieneRemito={!!selectedVenta.remitoId}
            tieneOrdenRetiro={!!selectedVenta.ordenRetiroId}
          />
        )}
      </div>

      {/* Modal Remito */}
      {remitoModal && (
        <RemitoModal
          remito={remitoModal.remito}
          onClose={() => setRemitoModal(null)}
        />
      )}

      {/* Modal Orden Retiro */}
      {ordenRetiroModal && (
        <OrdenRetiroModal
          orden={ordenRetiroModal}
          onClose={() => setOrdenRetiroModal(null)}
          onMarcarRetirada={() => {
            ordenesRetiroService.marcarOrdenRetirada(ordenRetiroModal.id);
            setOrdenRetiroModal(null);
            onLoadVentasCalle();
          }}
        />
      )}
    </div>
  );
};

// --- Admin: lista de vendedores (activar/desactivar, días que trabajan) ---
function VendedoresAdminList({
  vendedores,
  ventasCalle,
  onUpdateUser,
}: {
  vendedores: UserType[];
  ventasCalle: VentaCalle[];
  onUpdateUser: (userId: string, updates: Partial<UserType>) => void;
}) {
  const ventasBySeller = useMemo(() => {
    const map: Record<string, number> = {};
    ventasCalle.forEach((v) => { map[v.sellerId] = (map[v.sellerId] ?? 0) + 1; });
    return map;
  }, [ventasCalle]);

  const toggleDay = (user: UserType, day: WorkingDay) => {
    const current = user.workingDays ?? [];
    const next = current.includes(day) ? current.filter((d) => d !== day) : [...current, day].sort((a, b) => a - b);
    onUpdateUser(user.id, { workingDays: next });
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-slate-800 flex items-center gap-2">
        <User size={18} />
        Listado de vendedores
      </h2>
      <p className="text-sm text-slate-500">Activá o desactivá vendedores y definí los días que trabaja cada uno.</p>
      <div className="space-y-3">
        {vendedores.map((v) => (
          <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800">{v.fullName}</p>
                <p className="text-sm text-slate-500">{v.email ?? v.username} · {v.phone ?? '-'}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {ventasBySeller[v.id] ?? 0} ventas registradas
                </p>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-medium text-slate-600">Activo</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={v.active}
                    onClick={() => onUpdateUser(v.id, { active: !v.active })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${v.active ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${v.active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </label>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2">Días que trabaja</p>
              <div className="flex flex-wrap gap-2">
                {([0, 1, 2, 3, 4, 5, 6] as WorkingDay[]).map((day) => {
                  const isOn = (v.workingDays ?? []).includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(v, day)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isOn ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {DAY_NAMES[day]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Nueva venta form ---
function NuevaVentaForm({
  currentUser,
  clients,
  users,
  products,
  branches,
  onSave,
  onCancel,
}: {
  currentUser: UserType | null;
  clients: Client[];
  users: UserType[];
  products: Product[];
  branches: Branch[];
  onSave: (v: VentaCalle) => void;
  onCancel: () => void;
}) {
  const [clientId, setClientId] = useState(clients.filter((c) => c.id !== '0')[0]?.id ?? '');
  const [contactUserId, setContactUserId] = useState(users[0]?.id ?? '');
  const [branchId, setBranchId] = useState(branches[0]?.id ?? '');
  const [paymentMethod, setPaymentMethod] = useState<VentaCalle['paymentMethod']>(PaymentMethod.CASH);
  const [observaciones, setObservaciones] = useState('');
  const [cart, setCart] = useState<VentaCalleItem[]>([]);
  const [searchProduct, setSearchProduct] = useState('');

  const client = useMemo(() => clients.find((c) => c.id === clientId), [clients, clientId]);
  const contactUser = useMemo(() => users.find((u) => u.id === contactUserId), [users, contactUserId]);
  const branch = useMemo(() => branches.find((b) => b.id === branchId), [branches, branchId]);
  const filteredProducts = useMemo(() => {
    const q = searchProduct.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }, [products, searchProduct]);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.subtotal, 0), [cart]);
  const discount = 0;
  const total = subtotal - discount;

  const addItem = (p: Product, qty: number = 1) => {
    const existing = cart.find((i) => i.productId === p.id);
    if (existing) {
      setCart(cart.map((i) => i.productId === p.id ? { ...i, quantity: i.quantity + qty, subtotal: (i.quantity + qty) * i.unitPrice } : i));
    } else {
      setCart([...cart, { productId: p.id, name: p.name, sku: p.sku, quantity: qty, unitPrice: p.price, subtotal: p.price * qty }]);
    }
  };

  const removeItem = (productId: string) => setCart(cart.filter((i) => i.productId !== productId));

  const handleConfirm = () => {
    if (!currentUser || !client || !contactUser || !branch || cart.length === 0) return;
    const venta: VentaCalle = {
      id: `vc-${Date.now()}`,
      date: new Date().toISOString(),
      sellerId: currentUser.id,
      sellerName: currentUser.fullName,
      clientId: client.id,
      clientName: client.name,
      clientAddress: client.address,
      clientPhone: client.phone,
      contactUserId: contactUser.id,
      contactUserName: contactUser.fullName,
      branchId: branch.id,
      branchName: branch.name,
      items: cart,
      subtotal,
      discount,
      total,
      status: 'CONFIRMADA',
      paymentMethod,
      observaciones: observaciones || undefined,
    };
    onSave(venta);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-lg font-semibold text-slate-800">Nueva venta en comercio</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Comercio / Cliente</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {clients.filter((c) => c.id !== '0').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {client?.address && <p className="text-xs text-slate-500 mt-1">{client.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">¿A quién le vendió? (contacto en el comercio)</label>
          <select
            value={contactUserId}
            onChange={(e) => setContactUserId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.fullName}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Sucursal de retiro / envío</label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Forma de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as VentaCalle['paymentMethod'])}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Productos</label>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 mb-2 focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-2">
          {filteredProducts.slice(0, 24).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addItem(p)}
              className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 hover:bg-blue-50 hover:border-blue-200 text-left"
            >
              <ProductIcon category={p.category} size="sm" className="w-8 h-8 rounded flex-shrink-0" />
              <span className="text-sm truncate flex-1">{p.name}</span>
              <span className="text-xs font-medium text-slate-500">${p.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
          <p className="font-medium text-slate-700 mb-2">Carrito</p>
          <ul className="space-y-2">
            {cart.map((i) => (
              <li key={i.productId} className="flex justify-between items-center">
                <span className="text-sm">{i.name} x{i.quantity}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">${i.subtotal.toLocaleString()}</span>
                  <button type="button" onClick={() => removeItem(i.productId)} className="text-red-500 hover:text-red-700">Quitar</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Observaciones</label>
        <textarea
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={cart.length === 0}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar venta
        </button>
      </div>
    </div>
  );
}

// --- Detalle venta ---
function VentaDetalle({
  venta,
  clients,
  branches,
  onClose,
  onGenerarRemito,
  onGenerarOrdenRetiro,
  tieneRemito,
  tieneOrdenRetiro,
}: {
  venta: VentaCalle;
  clients: Client[];
  branches: Branch[];
  onClose: () => void;
  onGenerarRemito: () => void;
  onGenerarOrdenRetiro: () => void;
  tieneRemito: boolean;
  tieneOrdenRetiro: boolean;
}) {
  const client = clients.find((c) => c.id === venta.clientId);
  const branch = branches.find((b) => b.id === venta.branchId);
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="font-semibold text-slate-800">Venta {venta.id.slice(-6)}</h2>
        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
      </div>
      <div className="p-4 space-y-3">
        <p><strong>Cliente:</strong> {venta.clientName}</p>
        <p><strong>Contacto:</strong> {venta.contactUserName}</p>
        <p><strong>Sucursal retiro:</strong> {branch?.name ?? venta.branchId}</p>
        <p><strong>Estado:</strong> {STATUS_LABELS[venta.status]}</p>
        <p><strong>Total:</strong> ${venta.total.toLocaleString()}</p>
        <div>
          <p className="font-medium text-slate-700 mb-1">Items</p>
          <ul className="text-sm text-slate-600">
            {venta.items.map((i) => (
              <li key={i.productId}>{i.name} x{i.quantity} — ${i.subtotal.toLocaleString()}</li>
            ))}
          </ul>
        </div>
        {venta.status === 'CONFIRMADA' && (
          <div className="flex gap-2 pt-2">
            {!tieneRemito && <button type="button" onClick={onGenerarRemito} className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-medium text-sm">Generar remito</button>}
            {tieneRemito && !tieneOrdenRetiro && <button type="button" onClick={onGenerarOrdenRetiro} className="px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 font-medium text-sm">Generar orden de retiro</button>}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Modal Remito (vista imprimible) ---
function RemitoModal({ remito, onClose }: { remito: Remito; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto print:shadow-none print:max-h-none">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-slate-800">Remito Nº {remito.number}</h2>
            <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 print:hidden"><X size={20} /></button>
          </div>
          <p className="text-sm text-slate-500">Fecha: {remito.date}</p>
        </div>
        <div className="p-6 space-y-2">
          <p><strong>Cliente:</strong> {remito.clientName}</p>
          {remito.clientAddress && <p><strong>Dirección:</strong> {remito.clientAddress}</p>}
          {remito.clientCuit && <p><strong>CUIT:</strong> {remito.clientCuit}</p>}
          <p><strong>Vendedor:</strong> {remito.sellerName}</p>
          <p><strong>Sucursal:</strong> {remito.branchName ?? remito.branchId}</p>
          <table className="w-full text-sm border-collapse mt-4">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2">Producto</th>
                <th className="text-right py-2">Cant.</th>
                <th className="text-right py-2">P. unit.</th>
                <th className="text-right py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {remito.items.map((i) => (
                <tr key={i.productId} className="border-b border-slate-100">
                  <td className="py-2">{i.name}</td>
                  <td className="text-right">{i.quantity}</td>
                  <td className="text-right">${i.unitPrice.toLocaleString()}</td>
                  <td className="text-right">${i.subtotal.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-right font-bold text-lg mt-2">Total: ${remito.total.toLocaleString()}</p>
        </div>
        <div className="p-6 border-t flex gap-2 print:hidden">
          <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium">
            <Printer size={18} className="inline mr-2" />
            Imprimir
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// --- Modal Orden Retiro (para mostrar en sucursal) ---
function OrdenRetiroModal({
  orden,
  onClose,
  onMarcarRetirada,
}: {
  orden: OrdenRetiro;
  onClose: () => void;
  onMarcarRetirada: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Orden de retiro</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-2">
          <p><strong>Sucursal:</strong> {orden.branchName ?? orden.branchId}</p>
          <p><strong>Remito:</strong> {orden.remitoNumber ?? '-'}</p>
          <p><strong>Cliente:</strong> {orden.clientName}</p>
          <p><strong>Vendedor:</strong> {orden.sellerName}</p>
          <p><strong>Estado:</strong> {orden.status}</p>
          <ul className="text-sm mt-4 space-y-1">
            {orden.items.map((i) => (
              <li key={i.productId}>{i.name} x{i.quantity}</li>
            ))}
          </ul>
          {orden.status !== 'RETIRADA' && (
            <button
              type="button"
              onClick={onMarcarRetirada}
              className="mt-4 w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Marcar como retirada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
