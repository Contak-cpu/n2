import type { VentaCalle, VentaCalleItem } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { BRANCHES, INITIAL_VENTAS_CALLE } from '../constants';

function getVentasFromStorage(): VentaCalle[] {
  const stored = getJson<VentaCalle[]>(STORAGE_KEYS.VENTAS_CALLE);
  if (!stored || stored.length === 0) {
    setJson(STORAGE_KEYS.VENTAS_CALLE, INITIAL_VENTAS_CALLE);
    return INITIAL_VENTAS_CALLE;
  }
  return stored;
}

export function getVentasCalle(): VentaCalle[] {
  return getVentasFromStorage();
}

export function getVentasCalleBySeller(sellerId: string): VentaCalle[] {
  return getVentasFromStorage().filter((v) => v.sellerId === sellerId);
}

export function getVentaCalleById(id: string): VentaCalle | undefined {
  return getVentasFromStorage().find((v) => v.id === id);
}

export function addVentaCalle(venta: VentaCalle): VentaCalle[] {
  const list = getVentasFromStorage();
  const next = [venta, ...list];
  setJson(STORAGE_KEYS.VENTAS_CALLE, next);
  return next;
}

export function updateVentaCalle(id: string, updates: Partial<VentaCalle>): VentaCalle[] {
  const list = getVentasFromStorage();
  const next = list.map((v) => (v.id === id ? { ...v, ...updates } : v));
  setJson(STORAGE_KEYS.VENTAS_CALLE, next);
  return next;
}

/** Helper: resuelve nombre de sucursal */
export function getBranchName(branchId: string): string {
  return BRANCHES.find((b) => b.id === branchId)?.name ?? branchId;
}
