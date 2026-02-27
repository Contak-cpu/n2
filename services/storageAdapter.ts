import { STORAGE_KEYS, type StorageKey } from './storageKeys';

export interface IStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Implementación con localStorage; luego puede sustituirse por apiAdapter (fetch). */
export const localStorageAdapter: IStorageAdapter = {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  },
  removeItem(key: string): void {
    localStorage.removeItem(key);
  },
};

/** Adapter activo usado por todos los servicios. Cambiar aquí para usar API en el futuro. */
let currentAdapter: IStorageAdapter = localStorageAdapter;

export function getStorageAdapter(): IStorageAdapter {
  return currentAdapter;
}

export function setStorageAdapter(adapter: IStorageAdapter): void {
  currentAdapter = adapter;
}

/** Helper: leer JSON o null si no hay datos o falla el parse. */
export function getJson<T>(key: StorageKey): T | null {
  const raw = currentAdapter.getItem(key);
  if (raw == null || raw === '') return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Helper: escribir JSON. */
export function setJson(key: StorageKey, value: unknown): void {
  currentAdapter.setItem(key, JSON.stringify(value));
}

/** Re-export para que los servicios usen las claves por nombre. */
export { STORAGE_KEYS };
