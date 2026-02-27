import type { Remito, VentaCalle } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import * as ventasCalleService from './ventasCalleService';

function getRemitosFromStorage(): Remito[] {
  const stored = getJson<Remito[]>(STORAGE_KEYS.REMITOS);
  return stored ?? [];
}

export function getRemitos(): Remito[] {
  return getRemitosFromStorage();
}

export function getRemitoByVentaId(ventaCalleId: string): Remito | undefined {
  return getRemitosFromStorage().find((r) => r.ventaCalleId === ventaCalleId);
}

export function getNextRemitoNumber(): string {
  const remitos = getRemitosFromStorage();
  const numbers = remitos.map((r) => parseInt(r.number, 10)).filter((n) => !Number.isNaN(n));
  const max = numbers.length ? Math.max(...numbers) : 0;
  return String(max + 1).padStart(6, '0');
}

/** Genera remito a partir de una VentaCalle (debe estar CONFIRMADA). Devuelve el remito creado y actualiza la venta con remitoId y remitoNumber. */
export function generarRemito(venta: VentaCalle, clientCuit?: string): { remito: Remito; ventaActualizada: VentaCalle } {
  const number = getNextRemitoNumber();
  const remito: Remito = {
    id: `rem-${Date.now()}`,
    number,
    date: new Date().toISOString().slice(0, 10),
    ventaCalleId: venta.id,
    clientName: venta.clientName,
    clientAddress: venta.clientAddress,
    clientCuit: clientCuit ?? '',
    items: venta.items,
    total: venta.total,
    sellerName: venta.sellerName,
    branchId: venta.branchId,
    branchName: venta.branchName,
  };
  const list = getRemitosFromStorage();
  setJson(STORAGE_KEYS.REMITOS, [remito, ...list]);
  const ventaActualizada = { ...venta, remitoId: remito.id, remitoNumber: number };
  ventasCalleService.updateVentaCalle(venta.id, { remitoId: remito.id, remitoNumber: number });
  return { remito, ventaActualizada };
}
