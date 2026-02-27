import React, { useCallback, useEffect, useRef } from 'react';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
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
import { Distribucion } from './pages/Distribucion';
import { VendedorCalle } from './pages/VendedorCalle';
import { useStore } from './hooks/useStore';
import { INITIAL_USERS, BRANCHES } from './constants';
import { TransactionType, CartItem, Client, Transaction } from './types';
import { pathToTab, tabToPath, DEFAULT_TAB_BY_ROLE, canAccessTab } from './routes';

function AppRoutes() {
  const store = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = pathToTab(location.pathname);

  useEffect(() => {
    if (!store.currentUser) return;
    if (!canAccessTab(activeTab, store.currentUser.role)) {
      navigate(tabToPath(DEFAULT_TAB_BY_ROLE[store.currentUser.role]));
      return;
    }
  }, [store.currentUser, activeTab, navigate]);

  const hadUserRef = useRef(false);
  useEffect(() => {
    if (store.currentUser && !hadUserRef.current) {
      hadUserRef.current = true;
      navigate(tabToPath(DEFAULT_TAB_BY_ROLE[store.currentUser.role]));
    }
    if (!store.currentUser) hadUserRef.current = false;
  }, [store.currentUser, navigate]);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (!store.currentUser) return;
      if (!canAccessTab(tab, store.currentUser.role)) return;
      navigate(tabToPath(tab));
    },
    [store.currentUser, navigate]
  );

  const handleCheckout = useCallback(
    (lineId: string | undefined, cart: CartItem[], total: number, method: unknown, client: Client): Transaction => {
      const line = lineId ? store.getCheckoutLinesWithStats().find((l) => l.id === lineId) : null;
      const branchId = line?.branchId;
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        type: TransactionType.INCOME,
        amount: total,
        description: `Venta POS - ${client.name}`,
        method: method as Transaction['method'],
        cashierName: store.currentUser?.username ?? store.currentUser?.fullName,
        clientName: client.name,
        items: cart,
        lineId,
        branchId,
        status: 'COMPLETED',
      };
      store.addTransaction(newTransaction);
      store.updateStock(cart.map((item) => ({ id: item.id, quantity: item.quantity })));
      if (lineId) {
        const lineAfter = store.getCheckoutLinesWithStats().find((l) => l.id === lineId);
        if (lineAfter) {
          store.updateCheckoutLine(lineId, {
            totalSales: lineAfter.totalSales + total,
            transactionCount: lineAfter.transactionCount + 1,
          });
        }
      }
      return newTransaction;
    },
    [store]
  );

  if (!store.currentUser) {
    return <Login onLogin={store.login} />;
  }

  const role = store.currentUser.role;
  const isAdmin = role === 'ADMIN';
  const isSupervisor = role === 'SUPERVISOR';

  const transactionsForView = store.getTransactionsByBranch(store.selectedBranchId);
  const checkoutLinesForView = store.getCheckoutLinesByBranch(store.selectedBranchId);

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={handleTabChange}
      currentUser={store.currentUser}
      onLogout={store.logout}
      branches={BRANCHES}
      selectedBranchId={store.selectedBranchId}
      onSelectedBranchChange={store.setSelectedBranchId}
    >
      {activeTab === 'inicio' && (
        <Inicio
          currentUser={store.currentUser}
          products={store.products}
          restocking={store.restocking}
          transactions={transactionsForView}
          checkoutLines={checkoutLinesForView}
          users={store.users}
          currentBalance={store.getBalance()}
          egresos={store.egresos}
          onNavigate={handleTabChange}
        />
      )}

      {activeTab === 'pos' && role !== 'REPOSITOR' && (
        <POS
          products={store.products}
          clients={store.clients}
          checkoutLines={checkoutLinesForView}
          users={INITIAL_USERS}
          currentUser={store.currentUser}
          transactions={transactionsForView}
          activePromotions={store.getActivePromotions()}
          onCheckout={handleCheckout}
          openCheckoutLine={store.openCheckoutLine}
          closeCheckoutLine={store.closeCheckoutLine}
        />
      )}

      {activeTab === 'inventory' && (isAdmin || isSupervisor) && (
        <Inventory
          products={store.products}
          onAddProduct={store.addProduct}
          onUpdateProduct={store.updateProduct}
        />
      )}

      {activeTab === 'finance' && isAdmin && (
        <Finance
          transactions={store.transactions}
          currentBalance={store.getBalance()}
          onAddTransaction={store.addTransaction}
        />
      )}

      {activeTab === 'egresos' && isAdmin && (
        <Egresos
          egresos={store.egresos}
          onAdd={store.addEgreso}
          onRemove={store.removeEgreso}
          currentUser={store.currentUser.username}
        />
      )}

      {activeTab === 'suppliers' && isAdmin && (
        <Suppliers
          suppliers={store.suppliers}
          onAdd={store.addSupplier}
          onRemove={store.removeSupplier}
        />
      )}

      {activeTab === 'promotions' && isAdmin && (
        <Promotions
          promotions={store.promotions}
          onAdd={store.addPromotion}
          onUpdate={store.updatePromotion}
        />
      )}

      {activeTab === 'cajas' && (isAdmin || isSupervisor) && (
        <Cajas
          checkoutLines={checkoutLinesForView}
          users={store.users}
          currentUser={store.currentUser}
          onOpenLine={store.openCheckoutLine}
          onCloseLine={store.closeCheckoutLine}
        />
      )}

      {activeTab === 'reports' && (isAdmin || isSupervisor) && (
        <Reports
          transactions={transactionsForView}
          products={store.products}
          egresos={store.egresos}
          currentBalance={store.getBalance()}
        />
      )}

      {activeTab === 'distribucion' && (isAdmin || isSupervisor) && (
        <Distribucion
          despachos={store.despachos}
          branches={BRANCHES}
          clients={store.clients}
          products={store.products}
          onAddDespacho={store.addDespacho}
          onUpdateDespacho={store.updateDespacho}
        />
      )}

      {activeTab === 'repositor' && (role === 'REPOSITOR' || isAdmin) && (
        <Repositor
          products={store.products}
          currentUser={store.currentUser}
          restocking={store.restocking}
          users={store.users}
          onRestockFromDepot={store.restockFromDepot}
        />
      )}

      {activeTab === 'audit' && isAdmin && (
        <AuditLog
          auditLogs={store.auditLogs}
          users={store.users.map((u) => ({ id: u.id, fullName: u.fullName }))}
          onAddEntry={store.addAuditLog}
          currentUserId={store.currentUser?.id ?? ''}
        />
      )}

      {activeTab === 'users' && isAdmin && (
        <Users
          users={store.users}
          onAdd={store.addUser}
          onUpdate={store.updateUser}
          onRemove={store.removeUser}
          currentUserId={store.currentUser?.id}
        />
      )}

      {activeTab === 'settings' && isAdmin && <Settings />}

      {activeTab === 'vendedor-calle' && (role === 'VENDEDOR_CALLE' || isAdmin) && (
        <VendedorCalle
          currentUser={store.currentUser}
          ventasCalle={store.ventasCalle}
          clients={store.clients}
          users={store.users}
          products={store.products}
          branches={BRANCHES}
          onAddVentaCalle={store.addVentaCalle}
          onUpdateVentaCalle={store.updateVentaCalle}
          onLoadVentasCalle={store.loadVentasCalle}
          getVentasCalleBySeller={store.getVentasCalleBySeller}
          onUpdateUser={store.updateUser}
          isAdmin={isAdmin}
        />
      )}
    </Layout>
  );
}

const App: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
