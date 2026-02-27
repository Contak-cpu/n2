import { Product, User, Supplier, Client, CheckoutLine, Promotion, Branch, VentaCalle } from './types';

// ========== SUCURSALES ==========
export const BRANCHES: Branch[] = [
  { id: 'central', name: 'Sucursal Central' },
  { id: 'cordoba', name: 'Sucursal Córdoba' },
  { id: 'rio-cuarto', name: 'Sucursal Río Cuarto' },
  { id: 'triny-9', name: 'Sucursal Triny 9 de Julio' },
  { id: 'triny-2', name: 'Sucursal Triny 2' },
];

/** ID de la primera sucursal (Central) para migración de datos sin branchId */
export const BRANCH_CENTRAL_ID = BRANCHES[0].id;

/** Opciones para medio de salida en despachos */
export const MEDIO_SALIDA_OPTIONS = [
  'Vehículo propio',
  'Cadete',
  'Cliente retira',
  'Transporte tercero',
  'Otro',
];

// ========== PRODUCTOS - 88 Items de Supermercado Realista ==========

export const INITIAL_PRODUCTS: Product[] = [
  // BEBIDAS (16 productos)
  { id: '1', sku: 'BEB-001', barcode: '7790001002001', name: 'Coca Cola 2.5L', category: 'Bebidas', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1554866585-fdc4b4e6f98d?w=400', supplier: 'Bebidas del Sur', stockDepot: 30, stockGondola: 20 },
  { id: '2', sku: 'BEB-002', barcode: '7790001002002', name: 'Sprite 2.5L', category: 'Bebidas', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1606332913702-b0441451e8c3?w=400', supplier: 'Bebidas del Sur', stockDepot: 27, stockGondola: 18 },
  { id: '3', sku: 'BEB-003', barcode: '7790001002003', name: 'Fanta Naranja 2.5L', category: 'Bebidas', cost: 1100, price: 1900, imageUrl: 'https://images.unsplash.com/photo-1548681528-6a846cf17437?w=400', supplier: 'Bebidas del Sur', stockDepot: 24, stockGondola: 16 },
  { id: '4', sku: 'BEB-004', barcode: '7790001002004', name: 'Agua Mineral Botella 2L', category: 'Bebidas', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1598102020671-cf344bf24872?w=400', supplier: 'Bebidas del Sur', stockDepot: 120, stockGondola: 80 },
  { id: '5', sku: 'BEB-005', barcode: '7790001002005', name: 'Jugo Naranja Liter 1L', category: 'Bebidas', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd1eada4?w=400', supplier: 'Bebidas del Sur', stockDepot: 36, stockGondola: 24 },
  { id: '6', sku: 'BEB-006', barcode: '7790001002006', name: 'Te Frio Citric 1.5L', category: 'Bebidas', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5e47f?w=400', supplier: 'Bebidas del Sur', stockDepot: 33, stockGondola: 22 },
  { id: '7', sku: 'BEB-007', barcode: '7790001002007', name: 'Cerveza Quilmes 473ml x6', category: 'Bebidas', cost: 4500, price: 7500, imageUrl: 'https://images.unsplash.com/photo-1608270861620-7912c60ff0bb?w=400', supplier: 'Bebidas del Sur', stockDepot: 18, stockGondola: 12 },
  { id: '8', sku: 'BEB-008', barcode: '7790001002008', name: 'Vino Trapiche Malbec 750ml', category: 'Bebidas', cost: 3500, price: 6000, imageUrl: 'https://images.unsplash.com/photo-1584432540801-cbab62f7e73f?w=400', supplier: 'Bebidas del Sur', stockDepot: 12, stockGondola: 8 },
  { id: '9', sku: 'BEB-009', barcode: '7790001002009', name: 'Red Bull Energy 250ml', category: 'Bebidas', cost: 2000, price: 3500, imageUrl: 'https://images.unsplash.com/photo-1578548602221-b2c763fd206b?w=400', supplier: 'Bebidas del Sur', stockDepot: 21, stockGondola: 14 },
  { id: '10', sku: 'BEB-010', barcode: '7790001002010', name: 'Gatorade Naranja 500ml', category: 'Bebidas', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1600964902843-8d8f6f003f20?w=400', supplier: 'Bebidas del Sur', stockDepot: 15, stockGondola: 10 },
  { id: '11', sku: 'BEB-011', barcode: '7790001002011', name: 'Café Molido Nescafe 500g', category: 'Bebidas', cost: 2200, price: 3800, imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b8d5?w=400', supplier: 'Bebidas del Sur', stockDepot: 24, stockGondola: 16 },
  { id: '12', sku: 'BEB-012', barcode: '7790001002012', name: 'Te Saquitos Lipton x25', category: 'Bebidas', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1597318972181-eead0e2b9d56?w=400', supplier: 'Bebidas del Sur', stockDepot: 30, stockGondola: 20 },
  { id: '13', sku: 'BEB-013', barcode: '7790001002013', name: 'Jugo Pulp Durazno 1L', category: 'Bebidas', cost: 700, price: 1200, imageUrl: 'https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400', supplier: 'Bebidas del Sur', stockDepot: 27, stockGondola: 18 },
  { id: '14', sku: 'BEB-014', barcode: '7790001002014', name: 'Caldo Casero Gallina x6', category: 'Bebidas', cost: 900, price: 1600, imageUrl: 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=400', supplier: 'Bebidas del Sur', stockDepot: 18, stockGondola: 12 },
  { id: '15', sku: 'BEB-015', barcode: '7790001002015', name: 'Agua Saborizada Levite 1L', category: 'Bebidas', cost: 500, price: 900, imageUrl: 'https://images.unsplash.com/photo-1608270861620-7912c60ff0bb?w=400', supplier: 'Bebidas del Sur', stockDepot: 48, stockGondola: 32 },
  { id: '16', sku: 'BEB-016', barcode: '7790001002016', name: 'Champaña Chandón 750ml', category: 'Bebidas', cost: 5000, price: 8500, imageUrl: 'https://images.unsplash.com/photo-1569718212317-ca3eba61cf29?w=400', supplier: 'Bebidas del Sur', stockDepot: 6, stockGondola: 4 },

  // LÁCTEOS (12 productos)
  { id: '17', sku: 'LAC-001', barcode: '7790001002017', name: 'Leche Descremada La Serenísima 1L x12', category: 'Lácteos', cost: 10000, price: 16000, imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', supplier: 'Lacteos Argentina', stockDepot: 12, stockGondola: 8 },
  { id: '18', sku: 'LAC-002', barcode: '7790001002018', name: 'Yogurt Frutilla Sancor 140g', category: 'Lácteos', cost: 450, price: 800, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291840?w=400', supplier: 'Lacteos Argentina', stockDepot: 60, stockGondola: 40 },
  { id: '19', sku: 'LAC-003', barcode: '7790001002019', name: 'Queso Fresco Mozzarella 500g', category: 'Lácteos', cost: 2000, price: 3500, imageUrl: 'https://images.unsplash.com/photo-1589985648243-0e78e36e8f1f?w=400', supplier: 'Lacteos Argentina', stockDepot: 9, stockGondola: 6 },
  { id: '20', sku: 'LAC-004', barcode: '7790001002020', name: 'Manteca Descalzi 200g', category: 'Lácteos', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1557803104920-b3bdbccda6f3?w=400', supplier: 'Lacteos Argentina', stockDepot: 15, stockGondola: 10 },
  { id: '21', sku: 'LAC-005', barcode: '7790001002021', name: 'Crema de Leche La Serenísima 200ml', category: 'Lácteos', cost: 900, price: 1600, imageUrl: 'https://images.unsplash.com/photo-1615485291918-5834f3d91d6f?w=400', supplier: 'Lacteos Argentina', stockDepot: 18, stockGondola: 12 },
  { id: '22', sku: 'LAC-006', barcode: '7790001002022', name: 'Queso Rallado Milkaut 200g', category: 'Lácteos', cost: 1500, price: 2700, imageUrl: 'https://images.unsplash.com/photo-1599599810741-23dfb8fda8d7?w=400', supplier: 'Lacteos Argentina', stockDepot: 12, stockGondola: 8 },
  { id: '23', sku: 'LAC-007', barcode: '7790001002023', name: 'Huevo Premium Cartón x12', category: 'Lácteos', cost: 1800, price: 3200, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400', supplier: 'Lacteos Argentina', stockDepot: 24, stockGondola: 16 },
  { id: '24', sku: 'LAC-008', barcode: '7790001002024', name: 'Dulce de Leche Mucca 450g', category: 'Lácteos', cost: 1600, price: 2800, imageUrl: 'https://images.unsplash.com/photo-1587927231529-ce4e4f9ea330?w=400', supplier: 'Lacteos Argentina', stockDepot: 21, stockGondola: 14 },
  { id: '25', sku: 'LAC-009', barcode: '7790001002025', name: 'Leche Condensada La Lechera 395g', category: 'Lácteos', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599810738-e21a2acc1e2e?w=400', supplier: 'Lacteos Argentina', stockDepot: 18, stockGondola: 12 },
  { id: '26', sku: 'LAC-010', barcode: '7790001002026', name: 'Queso Cremoso Arla 200g', category: 'Lácteos', cost: 1400, price: 2500, imageUrl: 'https://images.unsplash.com/photo-1452200212447-e9e7d4d5c0ab?w=400', supplier: 'Lacteos Argentina', stockDepot: 15, stockGondola: 10 },
  { id: '27', sku: 'LAC-011', barcode: '7790001002027', name: 'Kefir Activia Frutilla 200g', category: 'Lácteos', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1448159697460-9e6e7235dff3?w=400', supplier: 'Lacteos Argentina', stockDepot: 30, stockGondola: 20 },
  { id: '28', sku: 'LAC-012', barcode: '7790001002028', name: 'Ricota La Serenísima 500g', category: 'Lácteos', cost: 1500, price: 2700, imageUrl: 'https://images.unsplash.com/photo-1599599810986-4c5dc8eae11d?w=400', supplier: 'Lacteos Argentina', stockDepot: 11, stockGondola: 7 },

  // CARNES (8 productos)
  { id: '29', sku: 'CAR-001', barcode: '7790001002029', name: 'Pechuga Pollo kg', category: 'Carnes', cost: 3500, price: 6000, imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400', supplier: 'Carnes Selectas', stockDepot: 15, stockGondola: 10 },
  { id: '30', sku: 'CAR-002', barcode: '7790001002030', name: 'Carne Molida 500g', category: 'Carnes', cost: 2500, price: 4500, imageUrl: 'https://images.unsplash.com/photo-1593618986160-e34014e67546?w=400', supplier: 'Carnes Selectas', stockDepot: 18, stockGondola: 12 },
  { id: '31', sku: 'CAR-003', barcode: '7790001002031', name: 'Milanesas Pollo Pack x6', category: 'Carnes', cost: 3000, price: 5200, imageUrl: 'https://images.unsplash.com/photo-1586985289688-cacf28ba2e86?w=400', supplier: 'Carnes Selectas', stockDepot: 12, stockGondola: 8 },
  { id: '32', sku: 'CAR-004', barcode: '7790001002032', name: 'Bife de Chorizo kg', category: 'Carnes', cost: 8000, price: 13000, imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561c1c?w=400', supplier: 'Carnes Selectas', stockDepot: 6, stockGondola: 4 },
  { id: '33', sku: 'CAR-005', barcode: '7790001002033', name: 'Pata de Cerdo kg', category: 'Carnes', cost: 2000, price: 3500, imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400', supplier: 'Carnes Selectas', stockDepot: 7, stockGondola: 5 },
  { id: '34', sku: 'CAR-006', barcode: '7790001002034', name: 'Carne para Burger kg', category: 'Carnes', cost: 3200, price: 5500, imageUrl: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd5e47f?w=400', supplier: 'Carnes Selectas', stockDepot: 9, stockGondola: 6 },
  { id: '35', sku: 'CAR-007', barcode: '7790001002035', name: 'Falda de Res kg', category: 'Carnes', cost: 3000, price: 5200, imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400', supplier: 'Carnes Selectas', stockDepot: 5, stockGondola: 3 },
  { id: '36', sku: 'CAR-008', barcode: '7790001002036', name: 'Jamón Cocido Feteado 200g', category: 'Carnes', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1578551180328-e8280250ad7f?w=400', supplier: 'Carnes Selectas', stockDepot: 12, stockGondola: 8 },

  // ALMACÉN (15 productos)
  { id: '37', sku: 'ALM-001', barcode: '7790001002037', name: 'Harina 0000 1kg', category: 'Almacén', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 72, stockGondola: 48 },
  { id: '38', sku: 'ALM-002', barcode: '7790001002038', name: 'Arroz Largo Fino 1kg', category: 'Almacén', cost: 950, price: 1750, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 120, stockGondola: 80 },
  { id: '39', sku: 'ALM-003', barcode: '7790001002039', name: 'Aceite Girasol Botella 1L', category: 'Almacén', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 48, stockGondola: 32 },
  { id: '40', sku: 'ALM-004', barcode: '7790001002040', name: 'Pasta Seca Maroyu 500g', category: 'Almacén', cost: 500, price: 900, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 90, stockGondola: 60 },
  { id: '41', sku: 'ALM-005', barcode: '7790001002041', name: 'Azúcar Blanca 1kg', category: 'Almacén', cost: 700, price: 1300, imageUrl: 'https://images.unsplash.com/photo-1599599810441-cbf4b6dd1f4e?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 60, stockGondola: 40 },
  { id: '42', sku: 'ALM-006', barcode: '7790001002042', name: 'Sal Refinada Gruesa 1kg', category: 'Almacén', cost: 300, price: 600, imageUrl: 'https://images.unsplash.com/photo-1599599810390-7a95c41c0fc4?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 48, stockGondola: 32 },
  { id: '43', sku: 'ALM-007', barcode: '7790001002043', name: 'Polenta Bautista 500g', category: 'Almacén', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599810300-e0f63b27c17f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '44', sku: 'ALM-008', barcode: '7790001002044', name: 'Lentejas 500g', category: 'Almacén', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599810229-3ea5e3bdb74f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },
  { id: '45', sku: 'ALM-009', barcode: '7790001002045', name: 'Garbanzos Lata 400g', category: 'Almacén', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599810198-9a9e3f6b8f7a?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 42, stockGondola: 28 },
  { id: '46', sku: 'ALM-010', barcode: '7790001002046', name: 'Tomate Lata Pelati 400g', category: 'Almacén', cost: 500, price: 900, imageUrl: 'https://images.unsplash.com/photo-1599599810110-5a2f4c5e4e7a?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 60, stockGondola: 40 },
  { id: '47', sku: 'ALM-011', barcode: '7790001002047', name: 'Atún en Lata 170g', category: 'Almacén', cost: 700, price: 1300, imageUrl: 'https://images.unsplash.com/photo-1599599810021-8a82f3e9c0a7?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 54, stockGondola: 36 },
  { id: '48', sku: 'ALM-012', barcode: '7790001002048', name: 'Leche en Polvo Nido 400g', category: 'Almacén', cost: 1500, price: 2700, imageUrl: 'https://images.unsplash.com/photo-1599599809932-2af11e6a8a0e?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 18, stockGondola: 12 },
  { id: '49', sku: 'ALM-013', barcode: '7790001002049', name: 'Harina de Maíz 500g', category: 'Almacén', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599808843-f3b02c8e4f0d?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 30, stockGondola: 20 },
  { id: '50', sku: 'ALM-014', barcode: '7790001002050', name: 'Fécula de Maíz Maizena 200g', category: 'Almacén', cost: 300, price: 600, imageUrl: 'https://images.unsplash.com/photo-1599599807754-4a6f4a9d2e6f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '51', sku: 'ALM-015', barcode: '7790001002051', name: 'Vinagre Blanco 750ml', category: 'Almacén', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599806506-a5a4e8a3e6a0?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },

  // CONGELADOS (10 productos)
  { id: '52', sku: 'CON-001', barcode: '7790001002052', name: 'Verduras Mixtas Bonduela 400g', category: 'Congelados', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599806573-f8e0f0a4e5e3?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 30, stockGondola: 20 },
  { id: '53', sku: 'CON-002', barcode: '7790001002053', name: 'Empanadas Caseras x12', category: 'Congelados', cost: 1500, price: 2700, imageUrl: 'https://images.unsplash.com/photo-1599599805889-9e39f7e2f3a9?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 18, stockGondola: 12 },
  { id: '54', sku: 'CON-003', barcode: '7790001002054', name: 'Facturas x6 Grasa', category: 'Congelados', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1599599804024-e6e0b4a0e5e7?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 15, stockGondola: 10 },
  { id: '55', sku: 'CON-004', barcode: '7790001002055', name: 'Helado Freddo Mix Frutales 1L', category: 'Congelados', cost: 1800, price: 3200, imageUrl: 'https://images.unsplash.com/photo-1599599803500-3f7e9e5f3e0e?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },
  { id: '56', sku: 'CON-005', barcode: '7790001002056', name: 'Papas Prefritas Oro 500g', category: 'Congelados', cost: 700, price: 1300, imageUrl: 'https://images.unsplash.com/photo-1599599802159-f3f3f3f3f3f3?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '57', sku: 'CON-006', barcode: '7790001002057', name: 'Pollo Deshuesado Congelado kg', category: 'Congelados', cost: 3000, price: 5200, imageUrl: 'https://images.unsplash.com/photo-1599599801498-0e3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 12, stockGondola: 8 },
  { id: '58', sku: 'CON-007', barcode: '7790001002058', name: 'Milanesas Soja Heladix x8', category: 'Congelados', cost: 1400, price: 2500, imageUrl: 'https://images.unsplash.com/photo-1599599797397-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 15, stockGondola: 10 },
  { id: '59', sku: 'CON-008', barcode: '7790001002059', name: 'Croquetas Pollo x12', category: 'Congelados', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1599599795296-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 18, stockGondola: 12 },
  { id: '60', sku: 'CON-009', barcode: '7790001002060', name: 'Pizza Mozzarella Bimbo', category: 'Congelados', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599794195-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 21, stockGondola: 14 },
  { id: '61', sku: 'CON-010', barcode: '7790001002061', name: 'Agua Fresca Jugo x12', category: 'Congelados', cost: 1000, price: 1800, imageUrl: 'https://images.unsplash.com/photo-1599599794094-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },

  // PAN Y PANADERÍA (8 productos)
  { id: '62', sku: 'PAN-001', barcode: '7790001002062', name: 'Pan de Molde Blanco Bimbo 550g', category: 'Pan', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599793993-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 42, stockGondola: 28 },
  { id: '63', sku: 'PAN-002', barcode: '7790001002063', name: 'Pan de Molde Integral Bimbo 500g', category: 'Pan', cost: 650, price: 1200, imageUrl: 'https://images.unsplash.com/photo-1599599792992-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '64', sku: 'PAN-003', barcode: '7790001002064', name: 'Medialunas Masas x6', category: 'Pan', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599791991-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 48, stockGondola: 32 },
  { id: '65', sku: 'PAN-004', barcode: '7790001002065', name: 'Bizcochos de Grasa x12', category: 'Pan', cost: 300, price: 600, imageUrl: 'https://images.unsplash.com/photo-1599599790990-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 54, stockGondola: 36 },
  { id: '66', sku: 'PAN-005', barcode: '7790001002066', name: 'Tarta de Frutos Rojos', category: 'Pan', cost: 2000, price: 3500, imageUrl: 'https://images.unsplash.com/photo-1599599789989-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 6, stockGondola: 4 },
  { id: '67', sku: 'PAN-006', barcode: '7790001002067', name: 'Pan de Hamburguesa Molde x4', category: 'Pan', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599788988-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 30, stockGondola: 20 },
  { id: '68', sku: 'PAN-007', barcode: '7790001002068', name: 'Pan de Hot Dog Molde x8', category: 'Pan', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599787987-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 27, stockGondola: 18 },
  { id: '69', sku: 'PAN-008', barcode: '7790001002069', name: 'Waffles Bimbo x4', category: 'Pan', cost: 500, price: 900, imageUrl: 'https://images.unsplash.com/photo-1599599786986-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },

  // SNACKS (10 productos)
  { id: '70', sku: 'SNK-001', barcode: '7790001002070', name: 'Papas Fritas Lays 500g', category: 'Snacks', cost: 1500, price: 2800, imageUrl: 'https://images.unsplash.com/photo-1599599785985-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 27, stockGondola: 18 },
  { id: '71', sku: 'SNK-002', barcode: '7790001002071', name: 'Galletitas Surtidas Bimbo 300g', category: 'Snacks', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599784984-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 48, stockGondola: 32 },
  { id: '72', sku: 'SNK-003', barcode: '7790001002072', name: 'Chocolate Aguila 100g', category: 'Snacks', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599783983-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 60, stockGondola: 40 },
  { id: '73', sku: 'SNK-004', barcode: '7790001002073', name: 'Chupetines Arcor x12', category: 'Snacks', cost: 500, price: 900, imageUrl: 'https://images.unsplash.com/photo-1599599782982-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 42, stockGondola: 28 },
  { id: '74', sku: 'SNK-005', barcode: '7790001002074', name: 'Chicles Trident x30', category: 'Snacks', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599781981-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '75', sku: 'SNK-006', barcode: '7790001002075', name: 'Almendras Saladas 200g', category: 'Snacks', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1599599780980-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 18, stockGondola: 12 },
  { id: '76', sku: 'SNK-007', barcode: '7790001002076', name: 'Maní Salado 200g', category: 'Snacks', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599779979-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 30, stockGondola: 20 },
  { id: '77', sku: 'SNK-008', barcode: '7790001002077', name: 'Granola Natural 400g', category: 'Snacks', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1599599778978-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 15, stockGondola: 10 },
  { id: '78', sku: 'SNK-009', barcode: '7790001002078', name: 'Mermelada Frutilla Sancor 400g', category: 'Snacks', cost: 700, price: 1300, imageUrl: 'https://images.unsplash.com/photo-1599599777977-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },
  { id: '79', sku: 'SNK-010', barcode: '7790001002079', name: 'Miel Pura Natural 500g', category: 'Snacks', cost: 2500, price: 4500, imageUrl: 'https://images.unsplash.com/photo-1599599776976-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 12, stockGondola: 8 },

  // PERFUMERÍA (9 productos)
  { id: '80', sku: 'PER-001', barcode: '7790001002080', name: 'Shampoo Dove 400ml', category: 'Perfumería', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599775975-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '81', sku: 'PER-002', barcode: '7790001002081', name: 'Acondicionador Dove 400ml', category: 'Perfumería', cost: 800, price: 1400, imageUrl: 'https://images.unsplash.com/photo-1599599774974-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 33, stockGondola: 22 },
  { id: '82', sku: 'PER-003', barcode: '7790001002082', name: 'Jabón Tocador Alen 3x90g', category: 'Perfumería', cost: 1100, price: 1900, imageUrl: 'https://images.unsplash.com/photo-1599599773973-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 36, stockGondola: 24 },
  { id: '83', sku: 'PER-004', barcode: '7790001002083', name: 'Desodorante Rexona 150ml', category: 'Perfumería', cost: 700, price: 1300, imageUrl: 'https://images.unsplash.com/photo-1599599772972-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 42, stockGondola: 28 },
  { id: '84', sku: 'PER-005', barcode: '7790001002084', name: 'Pasta de Dientes Colgate 95g', category: 'Perfumería', cost: 400, price: 800, imageUrl: 'https://images.unsplash.com/photo-1599599771971-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 60, stockGondola: 40 },
  { id: '85', sku: 'PER-006', barcode: '7790001002085', name: 'Enjuague Bucal Listerine 500ml', category: 'Perfumería', cost: 1000, price: 1800, imageUrl: 'https://images.unsplash.com/photo-1599599770970-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 24, stockGondola: 16 },
  { id: '86', sku: 'PER-007', barcode: '7790001002086', name: 'Papel Higiénico Elite x12', category: 'Perfumería', cost: 1200, price: 2100, imageUrl: 'https://images.unsplash.com/photo-1599599769969-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 48, stockGondola: 32 },
  { id: '87', sku: 'PER-008', barcode: '7790001002087', name: 'Pañuelos Descartables 100ud', category: 'Perfumería', cost: 300, price: 600, imageUrl: 'https://images.unsplash.com/photo-1599599768968-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 54, stockGondola: 36 },
  { id: '88', sku: 'PER-009', barcode: '7790001002088', name: 'Jabón Íntimo Lactacyd 200ml', category: 'Perfumería', cost: 600, price: 1100, imageUrl: 'https://images.unsplash.com/photo-1599599767967-3f3f3f3f3f3f?w=400', supplier: 'Distribuidora Norte S.A.', stockDepot: 30, stockGondola: 20 },
];

export const LOW_STOCK_THRESHOLD = 10;

/** Categorías para select en Inventario (nuevo/editar producto). */
export const PRODUCT_CATEGORIES = [
  'Bebidas', 'Lácteos', 'Carnes', 'Almacén', 'Congelados', 'Limpieza', 'Snacks', 'Perfumería', 'General'
];

// ========== USUARIOS ==========
export const INITIAL_USERS: User[] = [
  { id: '1', username: 'admin',      password: '123', fullName: 'Gerente General',   role: 'ADMIN',      email: 'admin@nuevaera.com.ar',   phone: '11-0000-0001', active: true },
  { id: '2', username: 'supervisor', password: '123', fullName: 'Jefa de Turno',      role: 'SUPERVISOR', email: 'supervisor@nuevaera.com.ar', phone: '11-0000-0002', active: true },
  { id: '3', username: 'caja1',      password: '123', fullName: 'María González',     role: 'CASHIER',    email: 'caja1@nuevaera.com.ar',   phone: '11-0000-0003', active: true },
  { id: '4', username: 'caja2',      password: '123', fullName: 'Carlos Fernández',   role: 'CASHIER',   email: 'caja2@nuevaera.com.ar',   phone: '11-0000-0004', active: true },
  { id: '5', username: 'caja3',      password: '123', fullName: 'Ana Rodríguez',      role: 'CASHIER',    email: 'caja3@nuevaera.com.ar',   phone: '11-0000-0005', active: true },
  { id: '6', username: 'caja4',      password: '123', fullName: 'Lucía Martínez',     role: 'CASHIER',   email: 'caja4@nuevaera.com.ar',   phone: '11-0000-0006', active: true },
  { id: '7', username: 'repo1',      password: '123', fullName: 'Diego López',        role: 'REPOSITOR', email: 'repo1@nuevaera.com.ar',   phone: '11-0000-0007', active: true },
  { id: '8', username: 'repo2',      password: '123', fullName: 'Sofía Pérez',        role: 'REPOSITOR', email: 'repo2@nuevaera.com.ar',   phone: '11-0000-0008', active: true },
  // Vendedores a la calle (9)
  { id: '9', username: 'vendedor1', password: '123', fullName: 'Martín Ríos', role: 'VENDEDOR_CALLE', email: 'vendedor1@nuevaera.com.ar', phone: '11-0000-0009', active: true, workingDays: [1, 2, 3, 4, 5] },
  { id: '10', username: 'vendedor2', password: '123', fullName: 'Valentina Soto', role: 'VENDEDOR_CALLE', email: 'vendedor2@nuevaera.com.ar', phone: '11-0000-0010', active: true, workingDays: [1, 2, 3, 4, 5, 6] },
  { id: '11', username: 'vendedor3', password: '123', fullName: 'Lucas Méndez', role: 'VENDEDOR_CALLE', email: 'vendedor3@nuevaera.com.ar', phone: '11-0000-0011', active: true, workingDays: [2, 3, 4, 5, 6] },
  { id: '12', username: 'vendedor4', password: '123', fullName: 'Camila Reyes', role: 'VENDEDOR_CALLE', email: 'vendedor4@nuevaera.com.ar', phone: '11-0000-0012', active: true, workingDays: [1, 3, 5] },
  { id: '13', username: 'vendedor5', password: '123', fullName: 'Javier Torres', role: 'VENDEDOR_CALLE', email: 'vendedor5@nuevaera.com.ar', phone: '11-0000-0013', active: false, workingDays: [1, 2, 3, 4, 5] },
  { id: '14', username: 'vendedor6', password: '123', fullName: 'Florencia Díaz', role: 'VENDEDOR_CALLE', email: 'vendedor6@nuevaera.com.ar', phone: '11-0000-0014', active: true, workingDays: [1, 2, 4, 5, 6] },
  { id: '15', username: 'vendedor7', password: '123', fullName: 'Mateo Fernández', role: 'VENDEDOR_CALLE', email: 'vendedor7@nuevaera.com.ar', phone: '11-0000-0015', active: true, workingDays: [1, 2, 3, 4, 5] },
  { id: '16', username: 'vendedor8', password: '123', fullName: 'Agustina López', role: 'VENDEDOR_CALLE', email: 'vendedor8@nuevaera.com.ar', phone: '11-0000-0016', active: true, workingDays: [3, 4, 5, 6] },
  { id: '17', username: 'vendedor9', password: '123', fullName: 'Nicolás Castro', role: 'VENDEDOR_CALLE', email: 'vendedor9@nuevaera.com.ar', phone: '11-0000-0017', active: true, workingDays: [1, 2, 3, 4, 5, 6] },
];

// ========== PROVEEDORES ==========
export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Distribuidora Norte S.A.', cuit: '30-11111111-1', phone: '11-1234-5678', email: 'ventas@distrinorte.com' },
  { id: '2', name: 'Bebidas del Sur', cuit: '30-22222222-2', phone: '11-8765-4321', email: 'pedidos@bebisur.com' },
  { id: '3', name: 'Lacteos Argentina', cuit: '30-33333333-3', phone: '11-2468-1357', email: 'ventas@lactosarg.com' },
  { id: '4', name: 'Carnes Selectas', cuit: '30-44444444-4', phone: '11-3691-8524', email: 'pedidos@carnesselecxtas.com' },
];

// ========== CLIENTES ==========
export const INITIAL_CLIENTS: Client[] = [
  { id: '0', name: 'Consumidor Final', cuit: '00-00000000-0', type: 'CONSUMIDOR_FINAL' },
  { id: '1', name: 'Kiosco El Paso', cuit: '20-33333333-3', type: 'RESPONSABLE_INSCRIPTO', address: 'Av. Libertad 450', phone: '351-456-7890' },
  { id: '2', name: 'Restaurante La Plaza', cuit: '30-44444444-4', type: 'RESPONSABLE_INSCRIPTO', address: 'San Martín 120', phone: '351-789-0123' },
  { id: '3', name: 'Almacén Don José', cuit: '20-55555555-5', type: 'RESPONSABLE_INSCRIPTO', address: 'Belgrano 890', phone: '351-321-6540' },
  { id: '4', name: 'Minimercado Central', cuit: '20-66666666-6', type: 'RESPONSABLE_INSCRIPTO', address: 'Colón 234', phone: '351-654-9870' },
  { id: '5', name: 'Bar El Rincón', cuit: '30-77777777-7', type: 'RESPONSABLE_INSCRIPTO', address: 'España 567', phone: '351-987-3210' },
];

// ========== LÍNEAS DE CAJA ==========
// Repartidas entre las 5 sucursales para que cada una tenga cajas y pueda tener ventas mock
export const INITIAL_CHECKOUT_LINES: CheckoutLine[] = [
  { id: '1', name: 'Caja 1', branchId: 'central', cashierId: '2', status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '2', name: 'Caja 2', branchId: 'central', cashierId: '3', status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '5', name: 'Caja Express', branchId: 'cordoba', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '6', name: 'Caja Atención', branchId: 'cordoba', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '7', name: 'Caja Preferente', branchId: 'rio-cuarto', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '8', name: 'Caja Logística', branchId: 'rio-cuarto', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '9', name: 'Caja Triny 9 - 1', branchId: 'triny-9', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '10', name: 'Caja Triny 9 - 2', branchId: 'triny-9', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '11', name: 'Caja Triny 2 - 1', branchId: 'triny-2', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
  { id: '12', name: 'Caja Triny 2 - 2', branchId: 'triny-2', cashierId: undefined, status: 'CLOSED', totalSales: 0, transactionCount: 0 },
];

// ========== PROMOCIONES ACTIVAS ==========
export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    name: '2x1 Gaseosas',
    description: 'Lleva 2 botellas de gaseosa y pagas 1',
    type: 'BUY_X_GET_Y',
    productIds: ['1', '2', '3'],
    discount: 50,
    validFrom: new Date('2026-02-26'),
    validTo: new Date('2026-03-05'),
    active: true,
    usageCount: 0,
  },
  {
    id: '2',
    name: '20% Descuento Limpieza',
    description: 'Descuento del 20% en toda la categoría limpieza',
    type: 'PERCENTAGE',
    productIds: ['4', '8'],
    discount: 20,
    validFrom: new Date('2026-02-26'),
    validTo: new Date('2026-03-10'),
    active: true,
    usageCount: 0,
  },
  {
    id: '3',
    name: 'Compra Leche lleva Queso 50% OFF',
    description: 'Al comprar 1L de leche, el queso al 50%',
    type: 'PERCENTAGE',
    productIds: ['17', '19'],
    discount: 50,
    validFrom: new Date('2026-02-26'),
    validTo: new Date('2026-03-02'),
    active: true,
    usageCount: 0,
  },
  {
    id: '4',
    name: '$100 en compras mayores a $500',
    description: 'Obtén $100 de descuento en compras mayores a $500',
    type: 'FIXED_AMOUNT',
    productIds: [],
    discount: 100,
    validFrom: new Date('2026-02-26'),
    validTo: new Date('2026-03-15'),
    active: true,
    usageCount: 0,
  },
  {
    id: '5',
    name: '3x2 en Bebidas Alcohólicas',
    description: 'Lleva 3 botellas y pagas 2',
    type: 'BUY_X_GET_Y',
    productIds: ['7', '8', '16'],
    discount: 33,
    validFrom: new Date('2026-02-26'),
    validTo: new Date('2026-03-08'),
    active: true,
    usageCount: 0,
  },
];

// ========== VENTAS CALLE (mock para panel Vendedores) ==========
// Repartidas entre los 9 vendedores; clientes 1–5; sucursales y productos reales
export const INITIAL_VENTAS_CALLE: VentaCalle[] = [
  { id: 'vc-1', date: '2026-02-24T10:30:00.000Z', sellerId: '9', sellerName: 'Martín Ríos', clientId: '1', clientName: 'Kiosco El Paso', clientAddress: 'Av. Libertad 450', clientPhone: '351-456-7890', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'central', items: [{ productId: '1', name: 'Coca Cola 2.5L', sku: 'BEB-001', quantity: 12, unitPrice: 2100, subtotal: 25200 }, { productId: '2', name: 'Sprite 2.5L', sku: 'BEB-002', quantity: 6, unitPrice: 2100, subtotal: 12600 }], subtotal: 37800, discount: 0, total: 37800, status: 'ENTREGADA', paymentMethod: 'Efectivo' },
  { id: 'vc-2', date: '2026-02-24T11:00:00.000Z', sellerId: '10', sellerName: 'Valentina Soto', clientId: '2', clientName: 'Restaurante La Plaza', clientAddress: 'San Martín 120', clientPhone: '351-789-0123', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'cordoba', items: [{ productId: '17', name: 'Leche Descremada La Serenísima 1L x12', sku: 'LAC-001', quantity: 4, unitPrice: 16000, subtotal: 64000 }, { productId: '29', name: 'Pechuga Pollo kg', sku: 'CAR-001', quantity: 5, unitPrice: 6000, subtotal: 30000 }], subtotal: 94000, discount: 2000, total: 92000, status: 'CONFIRMADA', paymentMethod: 'Transferencia' },
  { id: 'vc-3', date: '2026-02-25T09:15:00.000Z', sellerId: '11', sellerName: 'Lucas Méndez', clientId: '3', clientName: 'Almacén Don José', clientAddress: 'Belgrano 890', clientPhone: '351-321-6540', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'central', items: [{ productId: '37', name: 'Harina 0000 1kg', sku: 'ALM-001', quantity: 20, unitPrice: 1100, subtotal: 22000 }, { productId: '38', name: 'Arroz Largo Fino 1kg', sku: 'ALM-002', quantity: 15, unitPrice: 1750, subtotal: 26250 }], subtotal: 48250, discount: 0, total: 48250, status: 'RETIRADA', paymentMethod: 'Cuenta corriente' },
  { id: 'vc-4', date: '2026-02-25T14:00:00.000Z', sellerId: '9', sellerName: 'Martín Ríos', clientId: '4', clientName: 'Minimercado Central', clientAddress: 'Colón 234', clientPhone: '351-654-9870', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'rio-cuarto', items: [{ productId: '1', name: 'Coca Cola 2.5L', sku: 'BEB-001', quantity: 24, unitPrice: 2100, subtotal: 50400 }, { productId: '4', name: 'Agua Mineral Botella 2L', sku: 'BEB-004', quantity: 30, unitPrice: 800, subtotal: 24000 }], subtotal: 74400, discount: 0, total: 74400, status: 'ENTREGADA', paymentMethod: 'Efectivo' },
  { id: 'vc-5', date: '2026-02-25T16:30:00.000Z', sellerId: '12', sellerName: 'Camila Reyes', clientId: '5', clientName: 'Bar El Rincón', clientAddress: 'España 567', clientPhone: '351-987-3210', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'central', items: [{ productId: '7', name: 'Cerveza Quilmes 473ml x6', sku: 'BEB-007', quantity: 10, unitPrice: 7500, subtotal: 75000 }, { productId: '8', name: 'Vino Trapiche Malbec 750ml', sku: 'BEB-008', quantity: 6, unitPrice: 6000, subtotal: 36000 }], subtotal: 111000, discount: 5000, total: 106000, status: 'CONFIRMADA', paymentMethod: 'Transferencia' },
  { id: 'vc-6', date: '2026-02-26T08:45:00.000Z', sellerId: '14', sellerName: 'Florencia Díaz', clientId: '1', clientName: 'Kiosco El Paso', clientAddress: 'Av. Libertad 450', clientPhone: '351-456-7890', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'cordoba', items: [{ productId: '70', name: 'Papas Fritas Lays 500g', sku: 'SNK-001', quantity: 15, unitPrice: 2800, subtotal: 42000 }, { productId: '72', name: 'Chocolate Aguila 100g', sku: 'SNK-003', quantity: 20, unitPrice: 800, subtotal: 16000 }], subtotal: 58000, discount: 0, total: 58000, status: 'ENTREGADA', paymentMethod: 'Efectivo' },
  { id: 'vc-7', date: '2026-02-26T10:00:00.000Z', sellerId: '15', sellerName: 'Mateo Fernández', clientId: '2', clientName: 'Restaurante La Plaza', clientAddress: 'San Martín 120', clientPhone: '351-789-0123', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'central', items: [{ productId: '29', name: 'Pechuga Pollo kg', sku: 'CAR-001', quantity: 8, unitPrice: 6000, subtotal: 48000 }, { productId: '30', name: 'Carne Molida 500g', sku: 'CAR-002', quantity: 10, unitPrice: 4500, subtotal: 45000 }], subtotal: 93000, discount: 0, total: 93000, status: 'EN_PREPARACION', paymentMethod: 'Cuenta corriente' },
  { id: 'vc-8', date: '2026-02-26T11:20:00.000Z', sellerId: '16', sellerName: 'Agustina López', clientId: '3', clientName: 'Almacén Don José', clientAddress: 'Belgrano 890', clientPhone: '351-321-6540', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'triny-9', items: [{ productId: '39', name: 'Aceite Girasol Botella 1L', sku: 'ALM-003', quantity: 18, unitPrice: 2100, subtotal: 37800 }, { productId: '40', name: 'Pasta Seca Maroyu 500g', sku: 'ALM-004', quantity: 24, unitPrice: 900, subtotal: 21600 }], subtotal: 59400, discount: 0, total: 59400, status: 'BORRADOR', paymentMethod: 'Efectivo' },
  { id: 'vc-9', date: '2026-02-26T13:00:00.000Z', sellerId: '17', sellerName: 'Nicolás Castro', clientId: '4', clientName: 'Minimercado Central', clientAddress: 'Colón 234', clientPhone: '351-654-9870', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'triny-2', items: [{ productId: '18', name: 'Yogurt Frutilla Sancor 140g', sku: 'LAC-002', quantity: 30, unitPrice: 800, subtotal: 24000 }, { productId: '23', name: 'Huevo Premium Cartón x12', sku: 'LAC-007', quantity: 10, unitPrice: 3200, subtotal: 32000 }], subtotal: 56000, discount: 1000, total: 55000, status: 'CONFIRMADA', paymentMethod: 'Transferencia' },
  { id: 'vc-10', date: '2026-02-26T15:00:00.000Z', sellerId: '10', sellerName: 'Valentina Soto', clientId: '5', clientName: 'Bar El Rincón', clientAddress: 'España 567', clientPhone: '351-987-3210', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'cordoba', items: [{ productId: '62', name: 'Pan de Molde Blanco Bimbo 550g', sku: 'PAN-001', quantity: 20, unitPrice: 1100, subtotal: 22000 }], subtotal: 22000, discount: 0, total: 22000, status: 'ENTREGADA', paymentMethod: 'Efectivo' },
  { id: 'vc-11', date: '2026-02-27T09:00:00.000Z', sellerId: '9', sellerName: 'Martín Ríos', clientId: '2', clientName: 'Restaurante La Plaza', clientAddress: 'San Martín 120', clientPhone: '351-789-0123', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'central', items: [{ productId: '8', name: 'Vino Trapiche Malbec 750ml', sku: 'BEB-008', quantity: 12, unitPrice: 6000, subtotal: 72000 }], subtotal: 72000, discount: 0, total: 72000, status: 'CONFIRMADA', paymentMethod: 'Transferencia' },
  { id: 'vc-12', date: '2026-02-27T10:30:00.000Z', sellerId: '11', sellerName: 'Lucas Méndez', clientId: '1', clientName: 'Kiosco El Paso', clientAddress: 'Av. Libertad 450', clientPhone: '351-456-7890', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'rio-cuarto', items: [{ productId: '3', name: 'Fanta Naranja 2.5L', sku: 'BEB-003', quantity: 12, unitPrice: 1900, subtotal: 22800 }, { productId: '6', name: 'Te Frio Citric 1.5L', sku: 'BEB-006', quantity: 12, unitPrice: 1100, subtotal: 13200 }], subtotal: 36000, discount: 0, total: 36000, status: 'ENTREGADA', paymentMethod: 'Efectivo' },
  { id: 'vc-13', date: '2026-02-27T12:00:00.000Z', sellerId: '14', sellerName: 'Florencia Díaz', clientId: '4', clientName: 'Minimercado Central', clientAddress: 'Colón 234', clientPhone: '351-654-9870', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'cordoba', items: [{ productId: '26', name: 'Dulce de Leche Mucca 450g', sku: 'LAC-008', quantity: 12, unitPrice: 2800, subtotal: 33600 }, { productId: '41', name: 'Azúcar Blanca 1kg', sku: 'ALM-005', quantity: 15, unitPrice: 1300, subtotal: 19500 }], subtotal: 53100, discount: 0, total: 53100, status: 'CONFIRMADA', paymentMethod: 'Cuenta corriente' },
  { id: 'vc-14', date: '2026-02-27T14:00:00.000Z', sellerId: '16', sellerName: 'Agustina López', clientId: '5', clientName: 'Bar El Rincón', clientAddress: 'España 567', clientPhone: '351-987-3210', contactUserId: '2', contactUserName: 'Jefa de Turno', branchId: 'triny-9', items: [{ productId: '7', name: 'Cerveza Quilmes 473ml x6', sku: 'BEB-007', quantity: 8, unitPrice: 7500, subtotal: 60000 }], subtotal: 60000, discount: 0, total: 60000, status: 'BORRADOR', paymentMethod: 'Efectivo' },
  { id: 'vc-15', date: '2026-02-27T16:00:00.000Z', sellerId: '17', sellerName: 'Nicolás Castro', clientId: '3', clientName: 'Almacén Don José', clientAddress: 'Belgrano 890', clientPhone: '351-321-6540', contactUserId: '1', contactUserName: 'Gerente General', branchId: 'triny-2', items: [{ productId: '38', name: 'Arroz Largo Fino 1kg', sku: 'ALM-002', quantity: 25, unitPrice: 1750, subtotal: 43750 }, { productId: '44', name: 'Lentejas 500g', sku: 'ALM-008', quantity: 15, unitPrice: 1400, subtotal: 21000 }], subtotal: 64750, discount: 2750, total: 62000, status: 'ENTREGADA', paymentMethod: 'Transferencia' },
];
