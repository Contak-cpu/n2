import type { CheckoutLine } from '../types';
import { TransactionType } from '../types';
import { getJson, setJson, STORAGE_KEYS } from './storageAdapter';
import { INITIAL_CHECKOUT_LINES, BRANCH_CENTRAL_ID } from '../constants';
import { getTransactions } from './transactionsService';

export const SELECTED_BRANCH_ALL = 'ALL';

/** Lo que persistimos por línea: solo estado/cajero, no nombre ni branchId. */
type CheckoutLineState = Pick<CheckoutLine, 'id' | 'status' | 'cashierId' | 'openedAt' | 'closedAt'>;

function getSavedOverlay(): Record<string, CheckoutLineState> {
  const raw = getJson<CheckoutLineState[]>(STORAGE_KEYS.CHECKOUT_LINES);
  if (!Array.isArray(raw)) return {};
  return raw.reduce((acc, l) => {
    acc[l.id] = l;
    return acc;
  }, {} as Record<string, CheckoutLineState>);
}

function getCheckoutLinesRaw(): CheckoutLine[] {
  const saved = getSavedOverlay();
  return INITIAL_CHECKOUT_LINES.map((line) => {
    const s = saved[line.id];
    if (!s) return { ...line };
    return {
      ...line,
      status: s.status ?? line.status,
      cashierId: s.cashierId,
      openedAt: s.openedAt,
      closedAt: s.closedAt,
    };
  });
}

/** Persiste el estado actual de las líneas (solo campos que cambian). */
function persistCheckoutLines(lines: CheckoutLine[]): void {
  const overlay = lines.map((l) => ({
    id: l.id,
    status: l.status,
    cashierId: l.cashierId,
    openedAt: l.openedAt,
    closedAt: l.closedAt,
  }));
  setJson(STORAGE_KEYS.CHECKOUT_LINES, overlay);
}

export function getCheckoutLines(): CheckoutLine[] {
  return getCheckoutLinesRaw();
}

/** Líneas con totalSales y transactionCount calculados desde transacciones. */
export function getCheckoutLinesWithStats(): CheckoutLine[] {
  const transactions = getTransactions();
  const byLine = transactions
    .filter((t) => t.type === TransactionType.INCOME && t.lineId)
    .reduce(
      (acc, t) => {
        const id = t.lineId!;
        if (!acc[id]) acc[id] = { totalSales: 0, transactionCount: 0 };
        acc[id].totalSales += t.amount ?? 0;
        acc[id].transactionCount += 1;
        return acc;
      },
      {} as Record<string, { totalSales: number; transactionCount: number }>
    );

  return getCheckoutLinesRaw().map((line) => ({
    ...line,
    branchId: line.branchId ?? BRANCH_CENTRAL_ID,
    totalSales: byLine[line.id]?.totalSales ?? 0,
    transactionCount: byLine[line.id]?.transactionCount ?? 0,
  }));
}

export function getCheckoutLinesByBranch(branchId: string | null): CheckoutLine[] {
  const lines = getCheckoutLinesWithStats();
  if (!branchId || branchId === SELECTED_BRANCH_ALL) return lines;
  return lines.filter((l) => (l.branchId ?? BRANCH_CENTRAL_ID) === branchId);
}

export function openCheckoutLine(lineId: string, cashierId: string): CheckoutLine[] {
  const lines = getCheckoutLinesRaw().map((l) =>
    l.id === lineId ? { ...l, status: 'OPEN' as const, cashierId, openedAt: new Date() } : l
  );
  persistCheckoutLines(lines);
  return lines;
}

export function closeCheckoutLine(lineId: string): CheckoutLine[] {
  const lines = getCheckoutLinesRaw().map((l) =>
    l.id === lineId ? { ...l, status: 'CLOSED' as const, closedAt: new Date() } : l
  );
  persistCheckoutLines(lines);
  return lines;
}

export function updateCheckoutLine(lineId: string, updates: Partial<CheckoutLine>): CheckoutLine[] {
  const lines = getCheckoutLinesRaw().map((l) =>
    l.id === lineId ? { ...l, ...updates } : l
  );
  persistCheckoutLines(lines);
  return lines;
}
