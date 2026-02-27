import type { Product } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_PRODUCTS } from '../constants';

function getProductsFromStorage(): Product[] {
  const stored = getJson<Product[]>(STORAGE_KEYS.PRODUCTS);
  return stored ?? INITIAL_PRODUCTS;
}

/** Lista todos los productos. (Futuro: Promise<Product[]> cuando haya API.) */
export function getProducts(): Product[] {
  return getProductsFromStorage();
}

/** Obtiene un producto por id. */
export function getProductById(id: string): Product | undefined {
  return getProductsFromStorage().find((p) => p.id === id);
}

/** Agrega un producto y persiste. */
export function addProduct(product: Product): Product[] {
  const list = getProductsFromStorage();
  const next = [...list, product];
  setJson(STORAGE_KEYS.PRODUCTS, next);
  return next;
}

/** Actualiza un producto y persiste. */
export function updateProduct(updated: Product): Product[] {
  const list = getProductsFromStorage();
  const next = list.map((p) => (p.id === updated.id ? updated : p));
  setJson(STORAGE_KEYS.PRODUCTS, next);
  return next;
}

/** Descuenta stock en góndola (venta). */
export function updateStock(items: { id: string; quantity: number }[]): Product[] {
  const list = getProductsFromStorage();
  const next = list.map((p) => {
    const item = items.find((i) => i.id === p.id);
    if (item) {
      const newGondola = Math.max(0, p.stockGondola - item.quantity);
      return { ...p, stockGondola: newGondola };
    }
    return p;
  });
  setJson(STORAGE_KEYS.PRODUCTS, next);
  return next;
}
