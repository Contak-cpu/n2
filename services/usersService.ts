import type { User } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_USERS } from '../constants';

function getUsersFromStorage(): User[] {
  const stored = getJson<User[]>(STORAGE_KEYS.USERS);
  const base = stored ?? [];
  // Asegurar que los 9 vendedores de INITIAL_USERS siempre estén (por si el storage es viejo)
  const ids = new Set(base.map((u) => u.id));
  const merged = [...base];
  for (const u of INITIAL_USERS) {
    if (!ids.has(u.id)) {
      merged.push(u);
      ids.add(u.id);
    }
  }
  if (merged.length !== base.length) {
    setJson(STORAGE_KEYS.USERS, merged);
  }
  return merged;
}

export function getUsers(): User[] {
  return getUsersFromStorage();
}

export function addUser(user: User): User[] {
  const list = getUsersFromStorage();
  const next = [...list, user];
  setJson(STORAGE_KEYS.USERS, next);
  return next;
}

export function updateUser(userId: string, updates: Partial<User>): User[] {
  const list = getUsersFromStorage();
  const next = list.map((u) => (u.id === userId ? { ...u, ...updates } : u));
  setJson(STORAGE_KEYS.USERS, next);
  return next;
}

export function removeUser(userId: string): User[] {
  const list = getUsersFromStorage();
  const next = list.filter((u) => u.id !== userId);
  setJson(STORAGE_KEYS.USERS, next);
  return next;
}
