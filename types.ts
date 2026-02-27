export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  subcategory?: string;
  cost: number;
  price: number;
  imageUrl?: string;
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
  branchId?: string;
  tax?: number;
  discount?: number;
  status?: TransactionStatus;
  paymentReference?: string;
}

export interface Branch {
  id: string;
  name: string;
}

export type PricingMode = 'RETAIL' | 'WHOLESALE';

export interface DashboardStats {
  totalSales: number;
  totalExpenses: number;
  currentBalance: number;
  lowStockCount: number;
}

// --- NEW TYPES FOR SCALABILITY ---

export type UserRole = 'ADMIN' | 'CASHIER' | 'SUPERVISOR' | 'REPOSITOR' | 'VENDEDOR_CALLE';

/** 0 = Domingo, 1 = Lunes, ..., 6 = Sábado. Solo para VENDEDOR_CALLE. */
export type WorkingDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

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
  /** Días que trabaja (0=Dom ... 6=Sab). Solo usado para vendedores. */
  workingDays?: WorkingDay[];
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
  /** Opcional: dirección del comercio para vendedores a la calle */
  address?: string;
  phone?: string;
}

// --- EXTENDED TYPES FOR SUPERMARKET SYSTEM ---

export interface CheckoutLine {
  id: string;
  name: string;
  branchId: string;
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

// --- TRAZABILIDAD DISTRIBUCIÓN MAYORISTA ---

export type DespachoEstado = 'PENDIENTE' | 'EN_CAMINO' | 'ENTREGADO';

export interface DespachoItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice?: number;
}

export interface Despacho {
  id: string;
  date: string;
  clientId?: string;
  clientName: string;
  branchId: string;
  items: DespachoItem[];
  quienLleva: string;
  horaSalida: string;
  medioSalida: string;
  estado: DespachoEstado;
  observaciones?: string;
  transactionId?: string;
}

// --- VENDEDORES A LA CALLE ---

export type VentaCalleStatus =
  | 'BORRADOR'      // recién creada, editable
  | 'CONFIRMADA'    // confirmada, se pueden generar remito y órdenes
  | 'EN_PREPARACION'// sucursal preparando
  | 'RETIRADA'      // vendedor retiró la mercadería
  | 'ENTREGADA';    // entregada al cliente

export interface VentaCalleItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface VentaCalle {
  id: string;
  date: string;
  /** Vendedor que realizó la venta */
  sellerId: string;
  sellerName: string;
  /** Comercio/cliente */
  clientId: string;
  clientName: string;
  clientAddress?: string;
  clientPhone?: string;
  /** Usuario/contacto en el comercio al que se le vendió */
  contactUserId: string;
  contactUserName: string;
  /** Sucursal donde se retira o desde donde se envía */
  branchId: string;
  branchName?: string;
  items: VentaCalleItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: VentaCalleStatus;
  paymentMethod: PaymentMethod | 'Cuenta corriente' | 'Transferencia';
  /** Número de remito generado */
  remitoNumber?: string;
  remitoId?: string;
  ordenRetiroId?: string;
  observaciones?: string;
}

export interface Remito {
  id: string;
  number: string;
  date: string;
  ventaCalleId: string;
  clientName: string;
  clientAddress?: string;
  clientCuit?: string;
  items: VentaCalleItem[];
  total: number;
  sellerName: string;
  branchId: string;
  branchName?: string;
}

export type OrdenRetiroStatus = 'PENDIENTE' | 'PREPARADA' | 'RETIRADA';

export interface OrdenRetiro {
  id: string;
  ventaCalleId: string;
  remitoId?: string;
  remitoNumber?: string;
  branchId: string;
  branchName?: string;
  date: string;
  items: VentaCalleItem[];
  sellerId: string;
  sellerName: string;
  clientName: string;
  status: OrdenRetiroStatus;
  /** Cuando el vendedor retiró en sucursal */
  retiradoAt?: string;
}