import type { Supplier } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_SUPPLIERS } from '../constants';

function getSuppliersFromStorage(): Supplier[] {
  const stored = getJson<Supplier[]>(STORAGE_KEYS.SUPPLIERS);
  return stored ?? INITIAL_SUPPLIERS;
}

export function getSuppliers(): Supplier[] {
  return getSuppliersFromStorage();
}

export function addSupplier(supplier: Supplier): Supplier[] {
  const list = getSuppliersFromStorage();
  const next = [...list, supplier];
  setJson(STORAGE_KEYS.SUPPLIERS, next);
  return next;
}

export function removeSupplier(id: string): Supplier[] {
  const list = getSuppliersFromStorage();
  const next = list.filter((s) => s.id !== id);
  setJson(STORAGE_KEYS.SUPPLIERS, next);
  return next;
}
