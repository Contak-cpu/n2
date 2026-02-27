import type { Transaction } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { getMockTransactions } from '../utils/mockData';
import { BRANCH_CENTRAL_ID } from '../constants';

export const SELECTED_BRANCH_ALL = 'ALL';

function getTransactionsFromStorage(): Transaction[] {
  const stored = getJson<Transaction[]>(STORAGE_KEYS.TRANSACTIONS);
  if (stored && stored.length > 0) return stored;
  return getMockTransactions();
}

/** Lista todas las transacciones. */
export function getTransactions(): Transaction[] {
  return getTransactionsFromStorage();
}

/** Transacciones filtradas por sucursal. */
export function getTransactionsByBranch(branchId: string | null): Transaction[] {
  const list = getTransactionsFromStorage();
  if (!branchId || branchId === SELECTED_BRANCH_ALL) return list;
  return list.filter((t) => (t.branchId ?? BRANCH_CENTRAL_ID) === branchId);
}

/** Agrega una transacción y persiste. */
export function addTransaction(transaction: Transaction): Transaction[] {
  const list = getTransactionsFromStorage();
  const next = [transaction, ...list];
  setJson(STORAGE_KEYS.TRANSACTIONS, next);
  return next;
}
