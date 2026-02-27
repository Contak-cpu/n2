import type { User } from '../types';
import { getJson, setJson, getStorageAdapter, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_USERS } from '../constants';

/** Obtiene el usuario actual desde el storage (si hay sesión). */
export function getCurrentUser(): User | null {
  const raw = getJson<User>(STORAGE_KEYS.CURRENT_USER);
  return raw ?? null;
}

/** Inicia sesión. Devuelve el usuario si las credenciales son válidas, null en caso contrario. */
export function login(username: string, password: string): User | null {
  const users = getJson<User[]>(STORAGE_KEYS.USERS) ?? INITIAL_USERS;
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    setJson(STORAGE_KEYS.CURRENT_USER, user);
    return user;
  }
  return null;
}

/** Cierra sesión (borra usuario actual del storage). */
export function logout(): void {
  getStorageAdapter().removeItem(STORAGE_KEYS.CURRENT_USER);
}
