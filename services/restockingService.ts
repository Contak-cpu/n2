import type { Restocking } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { getMockRestocking } from '../utils/mockData';

function getRestockingFromStorage(): Restocking[] {
  const stored = getJson<Restocking[]>(STORAGE_KEYS.RESTOCKING);
  if (stored && stored.length > 0) return stored;
  return getMockRestocking();
}

export function getRestocking(): Restocking[] {
  return getRestockingFromStorage();
}

export function addRestocking(entry: Restocking): Restocking[] {
  const list = getRestockingFromStorage();
  const next = [entry, ...list];
  setJson(STORAGE_KEYS.RESTOCKING, next);
  return next;
}
