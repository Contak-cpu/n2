import { useState, useEffect } from 'react';
import { Product, Transaction, TransactionType, User, Supplier, Client } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USERS, INITIAL_SUPPLIERS, INITIAL_CLIENTS } from '../constants';

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
    return saved ? JSON.parse(saved) : [];
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('erp_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('erp_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
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

  // --- ACTIONS ---

  const login = (username: string, pass: string): boolean => {
    const user = INITIAL_USERS.find(u => u.username === username && u.password === pass);
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
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const updateStock = (items: { id: string; quantity: number }[]) => {
    setProducts(prev => prev.map(p => {
      const item = items.find(i => i.id === p.id);
      if (item) {
        return { ...p, stock: Math.max(0, p.stock - item.quantity) };
      }
      return p;
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
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

  return {
    currentUser,
    products,
    transactions,
    suppliers,
    clients,
    login,
    logout,
    addProduct,
    updateProduct,
    updateStock,
    addTransaction,
    addSupplier,
    removeSupplier,
    addClient,
    getBalance
  };
};