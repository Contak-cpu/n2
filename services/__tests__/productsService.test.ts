import { describe, it, expect, beforeEach } from 'vitest';
import { setStorageAdapter } from '../storageAdapter';
import { createMockStorageAdapter } from './storageAdapter.mock';
import * as productsService from '../productsService';
import type { Product } from '../../types';

describe('productsService', () => {
  beforeEach(() => {
    const { adapter } = createMockStorageAdapter();
    setStorageAdapter(adapter);
  });

  it('getProducts returns initial list when storage is empty', () => {
    const list = productsService.getProducts();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list[0]).toHaveProperty('id');
    expect(list[0]).toHaveProperty('name');
    expect(list[0]).toHaveProperty('sku');
    expect(list[0]).toHaveProperty('price');
    expect(list[0]).toHaveProperty('stockGondola');
    expect(list[0]).toHaveProperty('stockDepot');
  });

  it('addProduct persists and getProducts returns updated list', () => {
    const newProduct: Product = {
      id: 'test-1',
      sku: 'TEST-001',
      barcode: '999',
      name: 'Producto Test',
      category: 'General',
      cost: 100,
      price: 150,
      stockDepot: 10,
      stockGondola: 5,
    };
    const updated = productsService.addProduct(newProduct);
    expect(updated.some((p) => p.id === 'test-1')).toBe(true);
    const list = productsService.getProducts();
    expect(list.some((p) => p.id === 'test-1')).toBe(true);
  });

  it('updateProduct modifies product and persists', () => {
    const list = productsService.getProducts();
    const first = list[0];
    const updated = productsService.updateProduct({ ...first, name: 'Nombre Actualizado' });
    const found = updated.find((p) => p.id === first.id);
    expect(found?.name).toBe('Nombre Actualizado');
  });

  it('updateStock decreases stockGondola', () => {
    const list = productsService.getProducts();
    const id = list[0].id;
    const before = list[0].stockGondola;
    productsService.updateStock([{ id, quantity: 2 }]);
    const after = productsService.getProducts().find((p) => p.id === id)!;
    expect(after.stockGondola).toBe(Math.max(0, before - 2));
  });
});
