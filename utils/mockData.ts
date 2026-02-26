import { Transaction, TransactionType, PaymentMethod, Restocking } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_CLIENTS, INITIAL_CHECKOUT_LINES } from '../constants';

const METHODS: (PaymentMethod | 'Manual')[] = [
  PaymentMethod.CASH,
  PaymentMethod.CARD,
  PaymentMethod.MERCADOPAGO,
  PaymentMethod.MODO,
  'Manual',
];

/** Genera 50+ transacciones de venta para hoy y ayer (para demo/reportes). */
export function getMockTransactions(): Transaction[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const cashiers = INITIAL_USERS.filter(u => u.role === 'CASHIER' || u.role === 'SUPERVISOR');
  const lines = INITIAL_CHECKOUT_LINES.filter(l => l.id !== undefined);
  const products = INITIAL_PRODUCTS.slice(0, 40);
  const list: Transaction[] = [];
  let id = 1000;

  for (let day = 0; day <= 1; day++) {
    const base = day === 0 ? today : yesterday;
    const count = day === 0 ? 55 : 12;
    for (let i = 0; i < count; i++) {
      const hour = 8 + Math.floor(Math.random() * 12);
      const minute = Math.floor(Math.random() * 60);
      const date = new Date(base);
      date.setHours(hour, minute, Math.floor(Math.random() * 60), 0);

      const numItems = 1 + Math.floor(Math.random() * 8);
      let amount = 0;
      const items = [];
      for (let j = 0; j < numItems; j++) {
        const p = products[Math.floor(Math.random() * products.length)];
        const qty = 1 + Math.floor(Math.random() * 3);
        const price = p.price;
        amount += price * qty;
        items.push({
          ...p,
          quantity: qty,
          appliedPrice: price,
        });
      }
      const client = INITIAL_CLIENTS[Math.floor(Math.random() * INITIAL_CLIENTS.length)];
      const cashier = cashiers[Math.floor(Math.random() * cashiers.length)];
      const line = lines[Math.floor(Math.random() * lines.length)];
      list.push({
        id: String(id++),
        date: date.toISOString(),
        type: TransactionType.INCOME,
        amount: Math.round(amount),
        description: `Venta POS - ${client.name}`,
        method: METHODS[Math.floor(Math.random() * METHODS.length)],
        cashierName: cashier.fullName,
        clientName: client.name,
        items,
        lineId: line.id,
        status: 'COMPLETED',
      });
    }
  }

  return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/** Genera 20+ reposiciones (depósito → góndola) para hoy (para demo). */
export function getMockRestocking(): Restocking[] {
  const today = new Date();
  const repostors = INITIAL_USERS.filter(u => u.role === 'REPOSITOR');
  const products = INITIAL_PRODUCTS.filter(p => p.stockDepot > 0).slice(0, 30);
  const list: Restocking[] = [];
  let id = 2000;

  for (let i = 0; i < 22; i++) {
    const p = products[Math.floor(Math.random() * products.length)];
    const qty = Math.min(1 + Math.floor(Math.random() * 10), p.stockDepot);
    if (qty <= 0) continue;
    const rep = repostors[Math.floor(Math.random() * repostors.length)];
    const date = new Date(today);
    date.setHours(7 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60), 0, 0);

    list.push({
      id: String(id++),
      productId: p.id,
      quantity: qty,
      from: 'DEPOT',
      to: 'GONDOLA',
      repostorId: rep.id,
      timestamp: date.toISOString(),
    });
  }

  return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}
