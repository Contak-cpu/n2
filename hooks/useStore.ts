import { useState, useCallback } from 'react';
import { TransactionType } from '../types';
import type {
  Product,
  Transaction,
  User,
  Supplier,
  Client,
  CheckoutLine,
  Promotion,
  Egreso,
  Restocking,
  AuditLog,
  Despacho,
  VentaCalle,
} from '../types';
import { BRANCH_CENTRAL_ID } from '../constants';
import * as authService from '../services/authService';
import * as productsService from '../services/productsService';
import * as transactionsService from '../services/transactionsService';
import * as checkoutLinesService from '../services/checkoutLinesService';
import * as preferencesService from '../services/preferencesService';
import * as suppliersService from '../services/suppliersService';
import * as clientsService from '../services/clientsService';
import * as promotionsService from '../services/promotionsService';
import * as egresosService from '../services/egresosService';
import * as restockingService from '../services/restockingService';
import * as auditService from '../services/auditService';
import * as usersService from '../services/usersService';
import * as despachosService from '../services/despachosService';
import * as ventasCalleService from '../services/ventasCalleService';

export const SELECTED_BRANCH_ALL = transactionsService.SELECTED_BRANCH_ALL;

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());
  const [products, setProducts] = useState<Product[]>(() => productsService.getProducts());
  const [transactions, setTransactions] = useState<Transaction[]>(() => transactionsService.getTransactions());
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => suppliersService.getSuppliers());
  const [clients, setClients] = useState<Client[]>(() => clientsService.getClients());
  const [checkoutLines, setCheckoutLines] = useState<CheckoutLine[]>(() => checkoutLinesService.getCheckoutLines());
  const [selectedBranchId, setSelectedBranchIdState] = useState<string>(() => preferencesService.getSelectedBranchId());
  const [despachos, setDespachos] = useState<Despacho[]>(() => despachosService.getDespachos());
  const [promotions, setPromotions] = useState<Promotion[]>(() => promotionsService.getPromotions());
  const [egresos, setEgresos] = useState<Egreso[]>(() => egresosService.getEgresos());
  const [restocking, setRestocking] = useState<Restocking[]>(() => restockingService.getRestocking());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => auditService.getAuditLogs());
  const [users, setUsers] = useState<User[]>(() => usersService.getUsers());
  const [ventasCalle, setVentasCalle] = useState<VentaCalle[]>(() => ventasCalleService.getVentasCalle());

  const setSelectedBranchId = useCallback((branchId: string) => {
    preferencesService.setSelectedBranchId(branchId);
    setSelectedBranchIdState(branchId);
  }, []);

  const login = useCallback((username: string, pass: string): boolean => {
    const user = authService.login(username, pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setProducts(productsService.addProduct(product));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Crear producto',
      entityType: 'Product',
      entityId: product.id,
      details: { name: product.name },
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(productsService.updateProduct(updatedProduct));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Actualizar producto',
      entityType: 'Product',
      entityId: updatedProduct.id,
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const updateStock = useCallback((items: { id: string; quantity: number }[]) => {
    setProducts(productsService.updateStock(items));
  }, []);

  const restockFromDepot = useCallback((productId: string, quantity: number, repostorId: string, repostorName?: string) => {
    const list = productsService.getProducts();
    const product = list.find((p) => p.id === productId);
    if (!product) return;
    const move = Math.min(quantity, product.stockDepot);
    const updatedProduct: Product = {
      ...product,
      stockDepot: product.stockDepot - move,
      stockGondola: product.stockGondola + move,
      lastRestocked: new Date(),
      lastRestockedBy: repostorName ?? repostorId,
    };
    setProducts(productsService.updateProduct(updatedProduct));
    const entry: Restocking = {
      id: Date.now().toString(),
      productId,
      quantity: move,
      from: 'DEPOT',
      to: 'GONDOLA',
      repostorId,
      timestamp: new Date(),
    };
    setRestocking(restockingService.addRestocking(entry));
  }, []);

  const addAuditLog = useCallback((entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    setAuditLogs(auditService.addAuditLog(entry));
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions(transactionsService.addTransaction(transaction));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Nueva venta',
      entityType: 'Transaction',
      entityId: transaction.id,
      details: { amount: transaction.amount },
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const addSupplier = useCallback((supplier: Supplier) => {
    setSuppliers(suppliersService.addSupplier(supplier));
  }, []);

  const removeSupplier = useCallback((id: string) => {
    setSuppliers(suppliersService.removeSupplier(id));
  }, []);

  const addClient = useCallback((client: Client) => {
    setClients(clientsService.addClient(client));
  }, []);

  const getBalance = useCallback(() => {
    return transactions.reduce((acc, t) => {
      return t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount;
    }, 0);
  }, [transactions]);

  const openCheckoutLine = useCallback((lineId: string, cashierId: string) => {
    setCheckoutLines(checkoutLinesService.openCheckoutLine(lineId, cashierId));
  }, []);

  const closeCheckoutLine = useCallback((lineId: string) => {
    setCheckoutLines(checkoutLinesService.closeCheckoutLine(lineId));
  }, []);

  const updateCheckoutLine = useCallback((lineId: string, updates: Partial<CheckoutLine>) => {
    setCheckoutLines(checkoutLinesService.updateCheckoutLine(lineId, updates));
  }, []);

  const getCheckoutLinesWithStats = useCallback((): CheckoutLine[] => {
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
    return checkoutLines.map((line) => ({
      ...line,
      branchId: line.branchId ?? BRANCH_CENTRAL_ID,
      totalSales: byLine[line.id]?.totalSales ?? 0,
      transactionCount: byLine[line.id]?.transactionCount ?? 0,
    }));
  }, [transactions, checkoutLines]);

  const getTransactionsByBranch = useCallback(
    (branchId: string | null): Transaction[] => {
      if (!branchId || branchId === SELECTED_BRANCH_ALL) return transactions;
      return transactions.filter((t) => (t.branchId ?? BRANCH_CENTRAL_ID) === branchId);
    },
    [transactions]
  );

  const getCheckoutLinesByBranch = useCallback(
    (branchId: string | null): CheckoutLine[] => {
      const withStats = getCheckoutLinesWithStats();
      if (!branchId || branchId === SELECTED_BRANCH_ALL) return withStats;
      return withStats.filter((l) => (l.branchId ?? BRANCH_CENTRAL_ID) === branchId);
    },
    [getCheckoutLinesWithStats]
  );

  const addDespacho = useCallback((despacho: Despacho) => {
    setDespachos(despachosService.addDespacho(despacho));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Nuevo despacho',
      entityType: 'Despacho',
      entityId: despacho.id,
      details: { clientName: despacho.clientName },
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const updateDespacho = useCallback((id: string, updates: Partial<Despacho>) => {
    setDespachos(despachosService.updateDespacho(id, updates));
  }, []);

  const addPromotion = useCallback((promotion: Promotion) => {
    setPromotions(promotionsService.addPromotion(promotion));
  }, []);

  const updatePromotion = useCallback((promotionId: string, updates: Partial<Promotion>) => {
    setPromotions(promotionsService.updatePromotion(promotionId, updates));
  }, []);

  const getActivePromotions = useCallback(() => {
    return promotionsService.getActivePromotions();
  }, []);

  const addEgreso = useCallback((egreso: Egreso) => {
    setEgresos(egresosService.addEgreso(egreso));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Registrar egreso',
      entityType: 'Egreso',
      entityId: egreso.id,
      details: { amount: egreso.amount, category: egreso.category },
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const removeEgreso = useCallback((id: string) => {
    setEgresos(egresosService.removeEgreso(id));
  }, []);

  const addUser = useCallback((user: User) => {
    setUsers(usersService.addUser(user));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Crear usuario',
      entityType: 'User',
      entityId: user.id,
      details: { username: user.username },
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const updateUser = useCallback((userId: string, updates: Partial<User>) => {
    setUsers(usersService.updateUser(userId, updates));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Actualizar usuario',
      entityType: 'User',
      entityId: userId,
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const removeUser = useCallback((userId: string) => {
    setUsers(usersService.removeUser(userId));
    auditService.addAuditLog({
      userId: authService.getCurrentUser()?.id ?? '',
      action: 'Eliminar usuario',
      entityType: 'User',
      entityId: userId,
    });
    setAuditLogs(auditService.getAuditLogs());
  }, []);

  const loadVentasCalle = useCallback(() => {
    setVentasCalle(ventasCalleService.getVentasCalle());
  }, []);

  const addVentaCalle = useCallback((venta: VentaCalle) => {
    setVentasCalle(ventasCalleService.addVentaCalle(venta));
  }, []);

  const updateVentaCalle = useCallback((id: string, updates: Partial<VentaCalle>) => {
    setVentasCalle(ventasCalleService.updateVentaCalle(id, updates));
  }, []);

  const getVentasCalleBySeller = useCallback((sellerId: string): VentaCalle[] => {
    return ventasCalle.filter((v) => v.sellerId === sellerId);
  }, [ventasCalle]);

  return {
    currentUser,
    products,
    transactions,
    suppliers,
    clients,
    checkoutLines,
    selectedBranchId,
    setSelectedBranchId,
    getCheckoutLinesWithStats,
    getTransactionsByBranch,
    getCheckoutLinesByBranch,
    despachos,
    addDespacho,
    updateDespacho,
    promotions,
    egresos,
    restocking,
    auditLogs,
    users,
    login,
    logout,
    addProduct,
    updateProduct,
    updateStock,
    restockFromDepot,
    addAuditLog,
    addTransaction,
    addSupplier,
    removeSupplier,
    addClient,
    openCheckoutLine,
    closeCheckoutLine,
    updateCheckoutLine,
    addPromotion,
    updatePromotion,
    getActivePromotions,
    addEgreso,
    removeEgreso,
    getBalance,
    addUser,
    updateUser,
    removeUser,
    ventasCalle,
    loadVentasCalle,
    addVentaCalle,
    updateVentaCalle,
    getVentasCalleBySeller,
  };
};
