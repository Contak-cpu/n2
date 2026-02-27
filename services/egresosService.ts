import type { Egreso } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { getMockEgresos } from '../utils/mockData';

function getEgresosFromStorage(): Egreso[] {
  const stored = getJson<Egreso[]>(STORAGE_KEYS.EGRESOS);
  if (stored && stored.length > 0) return stored;
  return getMockEgresos();
}

export function getEgresos(): Egreso[] {
  return getEgresosFromStorage();
}

export function addEgreso(egreso: Egreso): Egreso[] {
  const list = getEgresosFromStorage();
  const next = [egreso, ...list];
  setJson(STORAGE_KEYS.EGRESOS, next);
  return next;
}

export function removeEgreso(id: string): Egreso[] {
  const list = getEgresosFromStorage();
  const next = list.filter((e) => e.id !== id);
  setJson(STORAGE_KEYS.EGRESOS, next);
  return next;
}
