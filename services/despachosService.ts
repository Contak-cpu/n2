import type { Despacho } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';

function getDespachosFromStorage(): Despacho[] {
  const stored = getJson<Despacho[]>(STORAGE_KEYS.DESPACHOS);
  return stored ?? [];
}

export function getDespachos(): Despacho[] {
  return getDespachosFromStorage();
}

export function addDespacho(despacho: Despacho): Despacho[] {
  const list = getDespachosFromStorage();
  const next = [despacho, ...list];
  setJson(STORAGE_KEYS.DESPACHOS, next);
  return next;
}

export function updateDespacho(id: string, updates: Partial<Despacho>): Despacho[] {
  const list = getDespachosFromStorage();
  const next = list.map((d) => (d.id === id ? { ...d, ...updates } : d));
  setJson(STORAGE_KEYS.DESPACHOS, next);
  return next;
}
