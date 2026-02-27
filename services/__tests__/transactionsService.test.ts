import { describe, it, expect, beforeEach } from 'vitest';
import { setStorageAdapter } from '../storageAdapter';
import { createMockStorageAdapter } from './storageAdapter.mock';
import * as transactionsService from '../transactionsService';
import { TransactionType } from '../../types';
import { PaymentMethod } from '../../types';

describe('transactionsService', () => {
  beforeEach(() => {
    const { adapter } = createMockStorageAdapter();
    setStorageAdapter(adapter);
  });

  it('getTransactions returns list (mock when empty)', () => {
    const list = transactionsService.getTransactions();
    expect(Array.isArray(list)).toBe(true);
  });

  it('getTransactionsByBranch with ALL returns all', () => {
    const all = transactionsService.getTransactions();
    const byBranch = transactionsService.getTransactionsByBranch(transactionsService.SELECTED_BRANCH_ALL);
    expect(byBranch.length).toBe(all.length);
  });

  it('addTransaction persists and getTransactions includes new one', () => {
    const newTx = {
      id: 'tx-1',
      date: new Date().toISOString(),
      type: TransactionType.INCOME,
      amount: 1000,
      description: 'Test',
      method: PaymentMethod.CASH,
      branchId: 'central',
    };
    transactionsService.addTransaction(newTx);
    const list = transactionsService.getTransactions();
    expect(list.some((t) => t.id === 'tx-1')).toBe(true);
  });
});
