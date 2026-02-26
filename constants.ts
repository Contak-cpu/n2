import { Product, User, Supplier, Client } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    sku: 'BEB-001', 
    name: 'Pack Gaseosa Cola 2.5L', 
    category: 'Bebidas', 
    cost: 1200, 
    priceWholesale: 1500, 
    priceRetail: 2100, 
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '2', 
    sku: 'ALM-002', 
    name: 'Harina 0000 1kg', 
    category: 'Almacén', 
    cost: 600, 
    priceWholesale: 800, 
    priceRetail: 1100, 
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '3', 
    sku: 'ALM-003', 
    name: 'Aceite Girasol Caja x12', 
    category: 'Almacén', 
    cost: 12000, 
    priceWholesale: 15000, 
    priceRetail: 18000, 
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '4', 
    sku: 'LIM-004', 
    name: 'Lavandina Concentrada 2L', 
    category: 'Limpieza', 
    cost: 900, 
    priceWholesale: 1200, 
    priceRetail: 1600, 
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '5', 
    sku: 'BEB-005', 
    name: 'Cerveza Rubia 473ml Pack x6', 
    category: 'Bebidas', 
    cost: 4500, 
    priceWholesale: 5800, 
    priceRetail: 7500, 
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '6', 
    sku: 'SNK-006', 
    name: 'Papas Fritas 500g', 
    category: 'Snacks', 
    cost: 1500, 
    priceWholesale: 2100, 
    priceRetail: 2800, 
    stock: 45,
    imageUrl: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '7', 
    sku: 'LAC-007', 
    name: 'Leche Larga Vida 1L x12', 
    category: 'Lácteos', 
    cost: 10000, 
    priceWholesale: 12500, 
    priceRetail: 16000, 
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '8', 
    sku: 'LIM-008', 
    name: 'Detergente Lavavajillas 750ml', 
    category: 'Limpieza', 
    cost: 800, 
    priceWholesale: 1100, 
    priceRetail: 1500, 
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1603399088654-e0e563b7890b?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '9', 
    sku: 'ALM-009', 
    name: 'Arroz Largo Fino 1kg', 
    category: 'Almacén', 
    cost: 950, 
    priceWholesale: 1300, 
    priceRetail: 1750, 
    stock: 200,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '10', 
    sku: 'PER-010', 
    name: 'Jabón Tocador Pack x3', 
    category: 'Perfumería', 
    cost: 1100, 
    priceWholesale: 1450, 
    priceRetail: 1900, 
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400&q=80'
  },
];

export const LOW_STOCK_THRESHOLD = 10;

export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin', password: '123', fullName: 'Gerente General', role: 'ADMIN' },
  { id: '2', username: 'caja1', password: '123', fullName: 'Cajero Mañana', role: 'CASHIER' },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Distribuidora Norte S.A.', cuit: '30-11111111-1', phone: '11-1234-5678', email: 'ventas@distrinorte.com' },
  { id: '2', name: 'Bebidas del Sur', cuit: '30-22222222-2', phone: '11-8765-4321', email: 'pedidos@bebisur.com' },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: '0', name: 'Consumidor Final', cuit: '00-00000000-0', type: 'CONSUMIDOR_FINAL' },
  { id: '1', name: 'Kiosco El Paso', cuit: '20-33333333-3', type: 'RESPONSABLE_INSCRIPTO' },
  { id: '2', name: 'Restaurante La Plaza', cuit: '30-44444444-4', type: 'RESPONSABLE_INSCRIPTO' },
];