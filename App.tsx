import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { Finance } from './pages/Finance';
import { Login } from './pages/Login';
import { Suppliers } from './pages/Suppliers';
import { Promotions } from './pages/Promotions';
import { Reports } from './pages/Reports';
import { Egresos } from './pages/Egresos';
import { useStore } from './hooks/useStore';
import { TransactionType, CartItem, Client, Transaction } from './types';

const DEFAULT_TAB_BY_ROLE: Record<string, string> = {
  ADMIN: 'pos',
  SUPERVISOR: 'pos',
  CASHIER: 'pos',
  REPOSITOR: 'repositor',
};

const App: React.FC = () => {
  const store = useStore();
  const [activeTab, setActiveTab] = useState(() => {
    return DEFAULT_TAB_BY_ROLE[store.currentUser?.role ?? 'CASHIER'] ?? 'pos';
  });

  if (!store.currentUser) {
    return <Login onLogin={store.login} />;
  }

  const role = store.currentUser.role;
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR';

  const handleCheckout = (cart: CartItem[], total: number, method: any, client: Client): Transaction => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: TransactionType.INCOME,
      amount: total,
      description: `Venta POS - ${client.name}`,
      method: method,
      cashierName: store.currentUser?.username,
      clientName: client.name,
      items: cart,
    };
    store.addTransaction(newTransaction);
    store.updateStock(cart.map(item => ({ id: item.id, quantity: item.quantity })));
    return newTransaction;
  };

  const handleTabChange = (tab: string) => {
    // Validar que el rol tenga acceso a esa pestaña
    const adminOnly = ['finance', 'egresos', 'suppliers', 'promotions'];
    const supervisorAllowed = ['pos', 'inventory', 'reports'];
    const cashierAllowed = ['pos'];
    const repositorAllowed = ['repositor'];

    if (isAdmin) { setActiveTab(tab); return; }
    if (isSupervisor && supervisorAllowed.includes(tab)) { setActiveTab(tab); return; }
    if (role === 'CASHIER' && cashierAllowed.includes(tab)) { setActiveTab(tab); return; }
    if (role === 'REPOSITOR' && repositorAllowed.includes(tab)) { setActiveTab(tab); return; }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      currentUser={store.currentUser}
      onLogout={store.logout}
    >
      {/* POS - accesible para Admin, Supervisor, Cajero */}
      {activeTab === 'pos' && role !== 'REPOSITOR' && (
        <POS
          products={store.products}
          clients={store.clients}
          onCheckout={handleCheckout}
        />
      )}

      {/* INVENTARIO - Admin y Supervisor */}
      {activeTab === 'inventory' && (isAdmin || isSupervisor) && (
        <Inventory
          products={store.products}
          onAddProduct={store.addProduct}
          onUpdateProduct={store.updateProduct}
        />
      )}

      {/* CAJA Y FINANZAS - solo Admin */}
      {activeTab === 'finance' && isAdmin && (
        <Finance
          transactions={store.transactions}
          currentBalance={store.getBalance()}
          onAddTransaction={store.addTransaction}
        />
      )}

      {/* EGRESOS - solo Admin */}
      {activeTab === 'egresos' && isAdmin && (
        <Egresos
          egresos={store.egresos}
          onAdd={store.addEgreso}
          onRemove={store.removeEgreso}
          currentUser={store.currentUser.username}
        />
      )}

      {/* PROVEEDORES - solo Admin */}
      {activeTab === 'suppliers' && isAdmin && (
        <Suppliers
          suppliers={store.suppliers}
          onAdd={store.addSupplier}
          onRemove={store.removeSupplier}
        />
      )}

      {/* PROMOCIONES - solo Admin */}
      {activeTab === 'promotions' && isAdmin && (
        <Promotions
          promotions={store.promotions}
          onAdd={store.addPromotion}
          onUpdate={store.updatePromotion}
        />
      )}

      {/* REPORTES - Admin y Supervisor */}
      {activeTab === 'reports' && (isAdmin || isSupervisor) && (
        <Reports
          transactions={store.transactions}
          products={store.products}
          currentBalance={store.getBalance()}
        />
      )}
    </Layout>
  );
};

export default App;
