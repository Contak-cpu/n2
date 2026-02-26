import { useState, useEffect } from 'react';
import { Product, Transaction, TransactionType, User, Supplier, Client, CheckoutLine, Promotion, Egreso, Restocking, AuditLog } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_SUPPLIERS, INITIAL_CLIENTS, INITIAL_CHECKOUT_LINES, INITIAL_PROMOTIONS } from '../constants';
import { getMockTransactions, getMockRestocking } from '../utils/mockData';

export const useStore = () => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('erp_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- DATA STATE ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('erp_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('erp_transactions');
    if (saved && saved !== '[]') return JSON.parse(saved);
    return getMockTransactions();
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('erp_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('erp_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });

  const [checkoutLines, setCheckoutLines] = useState<CheckoutLine[]>(() => {
    const saved = localStorage.getItem('erp_checkout_lines');
    return saved ? JSON.parse(saved) : INITIAL_CHECKOUT_LINES;
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('erp_promotions');
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  const [egresos, setEgresos] = useState<Egreso[]>(() => {
    const saved = localStorage.getItem('erp_egresos');
    return saved ? JSON.parse(saved) : [];
  });

  const [restocking, setRestocking] = useState<Restocking[]>(() => {
    const saved = localStorage.getItem('erp_restocking');
    if (saved && saved !== '[]') return JSON.parse(saved);
    return getMockRestocking();
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('erp_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('erp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('erp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('erp_current_user');
    }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('erp_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('erp_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('erp_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('erp_clients', JSON.stringify(clients)); }, [clients]);
  useEffect(() => { localStorage.setItem('erp_checkout_lines', JSON.stringify(checkoutLines)); }, [checkoutLines]);
  useEffect(() => { localStorage.setItem('erp_promotions', JSON.stringify(promotions)); }, [promotions]);
  useEffect(() => { localStorage.setItem('erp_egresos', JSON.stringify(egresos)); }, [egresos]);
  useEffect(() => { localStorage.setItem('erp_restocking', JSON.stringify(restocking)); }, [restocking]);
  useEffect(() => { localStorage.setItem('erp_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('erp_users', JSON.stringify(users)); }, [users]);

  // --- ACTIONS ---

  const login = (username: string, pass: string): boolean => {
    const user = users.find(u => u.username === username && u.password === pass);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Crear producto', entityType: 'Product', entityId: product.id, details: { name: product.name } });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Actualizar producto', entityType: 'Product', entityId: updatedProduct.id });
  };

  /** Descuenta de stock en góndola (venta). */
  const updateStock = (items: { id: string; quantity: number }[]) => {
    setProducts(prev => prev.map(p => {
      const item = items.find(i => i.id === p.id);
      if (item) {
        const newGondola = Math.max(0, p.stockGondola - item.quantity);
        return { ...p, stockGondola: newGondola };
      }
      return p;
    }));
  };

  /** Mueve cantidad de depósito a góndola y registra la reposición. */
  const restockFromDepot = (productId: string, quantity: number, repostorId: string, repostorName?: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const move = Math.min(quantity, p.stockDepot);
      return {
        ...p,
        stockDepot: p.stockDepot - move,
        stockGondola: p.stockGondola + move,
        lastRestocked: new Date(),
        lastRestockedBy: repostorName ?? repostorId,
      };
    }));
    const entry: Restocking = {
      id: Date.now().toString(),
      productId,
      quantity,
      from: 'DEPOT',
      to: 'GONDOLA',
      repostorId,
      timestamp: new Date(),
    };
    setRestocking(prev => [entry, ...prev]);
  };

  const addAuditLog = (entry: Omit<AuditLog, 'id' | 'timestamp'>) => {
    setAuditLogs(prev => [{ ...entry, id: Date.now().toString(), timestamp: new Date() }, ...prev]);
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Nueva venta', entityType: 'Transaction', entityId: transaction.id, details: { amount: transaction.amount } });
  };

  const addSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [...prev, supplier]);
  };
  
  const removeSupplier = (id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const getBalance = () => {
    return transactions.reduce((acc, t) => {
      return t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  const openCheckoutLine = (lineId: string, cashierId: string) => {
    setCheckoutLines(prev => prev.map(l => l.id === lineId ? { ...l, status: 'OPEN', cashierId, openedAt: new Date() } : l));
  };

  const closeCheckoutLine = (lineId: string) => {
    setCheckoutLines(prev => prev.map(l => l.id === lineId ? { ...l, status: 'CLOSED', closedAt: new Date() } : l));
  };

  const updateCheckoutLine = (lineId: string, updates: Partial<CheckoutLine>) => {
    setCheckoutLines(prev => prev.map(l => l.id === lineId ? { ...l, ...updates } : l));
  };

  const addPromotion = (promotion: Promotion) => {
    setPromotions(prev => [...prev, promotion]);
  };

  const updatePromotion = (promotionId: string, updates: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === promotionId ? { ...p, ...updates } : p));
  };

  const getActivePromotions = () => {
    return promotions.filter(p => p.active && new Date(p.validFrom) <= new Date() && new Date() <= new Date(p.validTo));
  };

  const addEgreso = (egreso: Egreso) => {
    setEgresos(prev => [egreso, ...prev]);
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Registrar egreso', entityType: 'Egreso', entityId: egreso.id, details: { amount: egreso.amount, category: egreso.category } });
  };

  const removeEgreso = (id: string) => {
    setEgresos(prev => prev.filter(e => e.id !== id));
  };

  const addUser = (user: User) => {
    setUsers(prev => [...prev, user]);
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Crear usuario', entityType: 'User', entityId: user.id, details: { username: user.username } });
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Actualizar usuario', entityType: 'User', entityId: userId });
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    addAuditLog({ userId: currentUser?.id ?? '', action: 'Eliminar usuario', entityType: 'User', entityId: userId });
  };

  return {
    currentUser,
    products,
    transactions,
    suppliers,
    clients,
    checkoutLines,
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
  };
};