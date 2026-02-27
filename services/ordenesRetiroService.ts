import type { OrdenRetiro, VentaCalle } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { BRANCHES } from '../constants';

function getOrdenesFromStorage(): OrdenRetiro[] {
  const stored = getJson<OrdenRetiro[]>(STORAGE_KEYS.ORDENES_RETIRO);
  return stored ?? [];
}

export function getOrdenesRetiro(): OrdenRetiro[] {
  return getOrdenesFromStorage();
}

export function getOrdenesRetiroBySeller(sellerId: string): OrdenRetiro[] {
  return getOrdenesFromStorage().filter((o) => o.sellerId === sellerId);
}

export function getOrdenRetiroByVentaId(ventaCalleId: string): OrdenRetiro | undefined {
  return getOrdenesFromStorage().find((o) => o.ventaCalleId === ventaCalleId);
}

export function getBranchName(branchId: string): string {
  return BRANCHES.find((b) => b.id === branchId)?.name ?? branchId;
}

/** Genera orden de retiro para que el vendedor retire la mercadería en sucursal. */
export function generarOrdenRetiro(venta: VentaCalle, remitoNumber?: string): OrdenRetiro[] {
  const orden: OrdenRetiro = {
    id: `ret-${Date.now()}`,
    ventaCalleId: venta.id,
    remitoId: venta.remitoId,
    remitoNumber: remitoNumber ?? venta.remitoNumber,
    branchId: venta.branchId,
    branchName: venta.branchName ?? getBranchName(venta.branchId),
    date: new Date().toISOString().slice(0, 10),
    items: venta.items,
    sellerId: venta.sellerId,
    sellerName: venta.sellerName,
    clientName: venta.clientName,
    status: 'PENDIENTE',
  };
  const list = getOrdenesFromStorage();
  const next = [orden, ...list];
  setJson(STORAGE_KEYS.ORDENES_RETIRO, next);
  return next;
}

export function updateOrdenRetiro(id: string, updates: Partial<OrdenRetiro>): OrdenRetiro[] {
  const list = getOrdenesFromStorage();
  const next = list.map((o) => (o.id === id ? { ...o, ...updates } : o));
  setJson(STORAGE_KEYS.ORDENES_RETIRO, next);
  return next;
}

export function marcarOrdenRetirada(id: string): OrdenRetiro[] {
  return updateOrdenRetiro(id, { status: 'RETIRADA', retiradoAt: new Date().toISOString() });
}
