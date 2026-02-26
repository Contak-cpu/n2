export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  subcategory?: string;
  cost: number;
  price: number;
  imageUrl: string;
  supplier?: string;
  stockDepot: number;
  stockGondola: number;
  lastRestocked?: Date;
  lastRestockedBy?: string;
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

export type TransactionStatus = 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  method: PaymentMethod | 'Manual';
  cashierName?: string;
  clientName?: string;
  items?: CartItem[];
  lineId?: string;
  tax?: number;
  discount?: number;
  status?: TransactionStatus;
  paymentReference?: string;
}

export type PricingMode = 'RETAIL' | 'WHOLESALE';

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  currentBalance: number;
  lowStockCount: number;
}

// --- NEW TYPES FOR SCALABILITY ---

export type UserRole = 'ADMIN' | 'CASHIER' | 'SUPERVISOR' | 'REPOSITOR';

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
  email?: string;
  phone?: string;
  active: boolean;
  lastLogin?: Date;
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

// --- EXTENDED TYPES FOR SUPERMARKET SYSTEM ---

export interface CheckoutLine {
  id: string;
  name: string;
  cashierId?: string;
  status: 'OPEN' | 'CLOSED' | 'SUSPENDED';
  openedAt?: Date;
  closedAt?: Date;
  totalSales: number;
  transactionCount: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y';
  productIds: string[];
  discount: number;
  validFrom: Date;
  validTo: Date;
  active: boolean;
  usageCount?: number;
}

export interface Restocking {
  id: string;
  productId: string;
  quantity: number;
  from: 'DEPOT' | 'EXTERIOR';
  to: 'GONDOLA' | 'DEPOT';
  repostorId: string;
  timestamp: Date;
  notes?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: Date;
  details?: any;
}

export type EgresoCategory =
  | 'Sueldos y Honorarios'
  | 'Alquiler'
  | 'Servicios (Luz/Gas/Internet)'
  | 'Compra de Mercadería'
  | 'Mantenimiento'
  | 'Impuestos y Tasas'
  | 'Logística y Flete'
  | 'Otros';

export interface Egreso {
  id: string;
  date: string;
  amount: number;
  category: EgresoCategory;
  description: string;
  method: PaymentMethod | 'Transferencia';
  registeredBy: string;
}