export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  cost: number;
  priceWholesale: number;
  priceRetail: number;
  stock: number;
  imageUrl?: string;
  supplierId?: string;
}

export interface CartItem extends Product {
  quantity: number;
  appliedPrice: number;
}

export enum PaymentMethod {
  CASH = 'Efectivo',
  MERCADOPAGO = 'MercadoPago (QR)',
  MODO = 'MODO',
  CARD = 'Débito/Crédito'
}

export enum TransactionType {
  INCOME = 'Ingreso',
  EXPENSE = 'Egreso'
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  method: PaymentMethod | 'Manual';
  cashierName?: string;
  clientName?: string;
  items?: CartItem[]; // For re-printing receipts
}

export type PricingMode = 'RETAIL' | 'WHOLESALE';

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  currentBalance: number;
  lowStockCount: number;
}

// --- NEW TYPES FOR SCALABILITY ---

export type UserRole = 'ADMIN' | 'CASHIER';

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, this is hashed. Here simple string for PoC.
  fullName: string;
  role: UserRole;
}

export interface Supplier {
  id: string;
  name: string;
  cuit: string; // Tax ID
  phone: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  cuit: string;
  type: 'CONSUMIDOR_FINAL' | 'RESPONSABLE_INSCRIPTO';
}