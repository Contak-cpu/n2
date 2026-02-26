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
import { Repositor } from './pages/Repositor';
import { AuditLog } from './pages/AuditLog';
import { Users } from './pages/Users';
import { Settings } from './pages/Settings';
import { Cajas } from './pages/Cajas';
import { Inicio } from './pages/Inicio';
import { useStore } from './hooks/useStore';
import { INITIAL_USERS } from './constants';
import { TransactionType, CartItem, Client, Transaction } from './types';

const DEFAULT_TAB_BY_ROLE: Record<string, string> = {
  ADMIN: 'inicio',
  SUPERVISOR: 'inicio',
  CASHIER: 'inicio',
  REPOSITOR: 'inicio',
};

const App: React.FC = () => {
  const store = useStore();
  const [activeTab, setActiveTab] = useState(() => {
    return DEFAULT_TAB_BY_ROLE[store.currentUser?.role ?? 'CASHIER'] ?? 'inicio';
  });

  // Al iniciar sesión (o cambiar usuario), ir a la sección por defecto del rol para no dejar pantalla en blanco
  React.useEffect(() => {
    if (store.currentUser) {
      setActiveTab(DEFAULT_TAB_BY_ROLE[store.currentUser.role] ?? 'inicio');
    }
  }, [store.currentUser?.id]);

  if (!store.currentUser) {
    return <Login onLogin={store.login} />;
  }

  const role = store.currentUser.role;
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR';

  const handleCheckout = (
    lineId: string | undefined,
    cart: CartItem[],
    total: number,
    method: any,
    client: Client
  ): Transaction => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: TransactionType.INCOME,
      amount: total,
      description: `Venta POS - ${client.name}`,
      method: method,
      cashierName: store.currentUser?.username ?? store.currentUser?.fullName,
      clientName: client.name,
      items: cart,
      lineId,
      status: 'COMPLETED',
    };
    store.addTransaction(newTransaction);
    store.updateStock(cart.map(item => ({ id: item.id, quantity: item.quantity })));
    if (lineId) {
      const line = store.getCheckoutLinesWithStats().find(l => l.id === lineId);
      if (line) {
        store.updateCheckoutLine(lineId, {
          totalSales: line.totalSales + total,
          transactionCount: line.transactionCount + 1,
        });
      }
    }
    return newTransaction;
  };

  const handleTabChange = (tab: string) => {
    const adminOnly = ['finance', 'egresos', 'suppliers', 'promotions', 'audit', 'users', 'settings'];
    const supervisorAllowed = ['inicio', 'pos', 'inventory', 'reports', 'cajas'];
    const cashierAllowed = ['inicio', 'pos'];
    const repositorAllowed = ['inicio', 'repositor'];

    if (tab === 'inicio') { setActiveTab(tab); return; }
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
      {/* INICIO - todos los roles (contenido según rol) */}
      {activeTab === 'inicio' && (
        <Inicio
          currentUser={store.currentUser}
          products={store.products}
          restocking={store.restocking}
          transactions={store.transactions}
          checkoutLines={store.getCheckoutLinesWithStats()}
          users={store.users}
          currentBalance={store.getBalance()}
          egresos={store.egresos}
          onNavigate={setActiveTab}
        />
      )}

      {/* POS - accesible para Admin, Supervisor, Cajero */}
      {activeTab === 'pos' && role !== 'REPOSITOR' && (
        <POS
          products={store.products}
          clients={store.clients}
          checkoutLines={store.getCheckoutLinesWithStats()}
          users={INITIAL_USERS}
          currentUser={store.currentUser}
          transactions={store.transactions}
          activePromotions={store.getActivePromotions()}
          onCheckout={handleCheckout}
          openCheckoutLine={store.openCheckoutLine}
          closeCheckoutLine={store.closeCheckoutLine}
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

      {/* CAJAS - Admin y Supervisor */}
      {activeTab === 'cajas' && (isAdmin || isSupervisor) && (
        <Cajas
          checkoutLines={store.getCheckoutLinesWithStats()}
          users={store.users}
          currentUser={store.currentUser}
          onOpenLine={store.openCheckoutLine}
          onCloseLine={store.closeCheckoutLine}
        />
      )}

      {/* REPORTES - Admin y Supervisor */}
      {activeTab === 'reports' && (isAdmin || isSupervisor) && (
        <Reports
          transactions={store.transactions}
          products={store.products}
          egresos={store.egresos}
          currentBalance={store.getBalance()}
        />
      )}

      {/* REPOSITOR - solo Repositor (y Admin para pruebas) */}
      {activeTab === 'repositor' && (role === 'REPOSITOR' || isAdmin) && (
        <Repositor
          products={store.products}
          currentUser={store.currentUser}
          restocking={store.restocking}
          users={store.users}
          onRestockFromDepot={store.restockFromDepot}
        />
      )}

      {/* AUDITORÍA - solo Admin */}
      {activeTab === 'audit' && isAdmin && (
        <AuditLog
          auditLogs={store.auditLogs}
          users={store.users.map(u => ({ id: u.id, fullName: u.fullName }))}
          onAddEntry={store.addAuditLog}
          currentUserId={store.currentUser?.id ?? ''}
        />
      )}

      {/* USUARIOS - solo Admin */}
      {activeTab === 'users' && isAdmin && (
        <Users
          users={store.users}
          onAdd={store.addUser}
          onUpdate={store.updateUser}
          onRemove={store.removeUser}
          currentUserId={store.currentUser?.id}
        />
      )}

      {/* CONFIGURACIÓN - solo Admin */}
      {activeTab === 'settings' && isAdmin && <Settings />}
    </Layout>
  );
};

export default App;
