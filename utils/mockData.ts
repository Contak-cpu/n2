import { Transaction, TransactionType, PaymentMethod, Restocking, Egreso, EgresoCategory } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_CLIENTS, INITIAL_CHECKOUT_LINES, BRANCHES } from '../constants';

const METHODS: (PaymentMethod | 'Manual')[] = [
  PaymentMethod.CASH,
  PaymentMethod.CARD,
  PaymentMethod.MERCADOPAGO,
  PaymentMethod.MODO,
  'Manual',
];

/** Líneas agrupadas por sucursal para repartir ventas mock en todas las sucursales */
function getLinesByBranch() {
  const map: Record<string, typeof INITIAL_CHECKOUT_LINES> = {};
  BRANCHES.forEach((b) => { map[b.id] = []; });
  INITIAL_CHECKOUT_LINES.forEach((l) => {
    if (map[l.branchId]) map[l.branchId].push(l);
  });
  return map;
}

/** Genera transacciones de venta para hoy y ayer repartidas en las 5 sucursales (para demo/reportes). */
export function getMockTransactions(): Transaction[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const cashiers = INITIAL_USERS.filter(u => u.role === 'CASHIER' || u.role === 'SUPERVISOR');
  const linesByBranch = getLinesByBranch();
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
      // Repartir por sucursal: elegir una sucursal al azar para que todas tengan ventas
      const branch = BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
      const linesInBranch = linesByBranch[branch.id];
      const line = linesInBranch?.length ? linesInBranch[Math.floor(Math.random() * linesInBranch.length)] : INITIAL_CHECKOUT_LINES[0];
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
        branchId: line.branchId,
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

const EGRESO_CATEGORIES: { category: EgresoCategory; descriptions: string[]; min: number; max: number }[] = [
  { category: 'Sueldos y Honorarios', descriptions: ['Sueldo cajero', 'Sueldo repositor', 'Sueldo supervisor', 'Horas extras', 'Aguinaldo'], min: 180000, max: 450000 },
  { category: 'Alquiler', descriptions: ['Alquiler local', 'Alquiler depósito'], min: 250000, max: 450000 },
  { category: 'Servicios (Luz/Gas/Internet)', descriptions: ['Factura Edenor', 'Factura Metrogas', 'Internet Fibertel', 'Factura luz', 'Gas'], min: 15000, max: 85000 },
  { category: 'Compra de Mercadería', descriptions: ['Pedido proveedor bebidas', 'Reposición lácteos', 'Compra almacén', 'Mercadería carnes', 'Pedido mayorista'], min: 80000, max: 350000 },
  { category: 'Mantenimiento', descriptions: ['Reparación heladera', 'Mantenimiento aire', 'Arreglo balanza', 'Limpieza profesional'], min: 15000, max: 120000 },
  { category: 'Impuestos y Tasas', descriptions: ['IIBB', 'ARBA', 'Tasa municipal', 'Monotributo'], min: 20000, max: 150000 },
  { category: 'Logística y Flete', descriptions: ['Flete mercadería', 'Envío pedido', 'Transporte'], min: 8000, max: 45000 },
  { category: 'Otros', descriptions: ['Insumos oficina', 'Material limpieza', 'Publicidad', 'Gastos varios'], min: 5000, max: 40000 },
];

/** Genera egresos realistas de los últimos 3 meses (para demo en Finanzas, Egresos y Reportes). */
export function getMockEgresos(): Egreso[] {
  const admin = INITIAL_USERS.find(u => u.role === 'ADMIN');
  const registeredBy = admin?.username ?? 'admin';
  const list: Egreso[] = [];
  let id = 3000;

  const methods: (PaymentMethod | 'Transferencia')[] = [
    PaymentMethod.CASH,
    PaymentMethod.CARD,
    'Transferencia',
  ];

  const today = new Date();
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const base = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
    const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();

    EGRESO_CATEGORIES.forEach(({ category, descriptions, min, max }) => {
      const count = category === 'Sueldos y Honorarios' ? 4 : category === 'Alquiler' ? 1 : 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const day = 1 + Math.floor(Math.random() * (daysInMonth - 1));
        const date = new Date(base.getFullYear(), base.getMonth(), day);
        if (date > today) continue;
        const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
        const amount = Math.round(min + Math.random() * (max - min));
        list.push({
          id: String(id++),
          date: date.toISOString().slice(0, 10),
          amount,
          category,
          description: desc,
          method: methods[Math.floor(Math.random() * methods.length)],
          registeredBy,
        });
      }
    });
  }

  return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
