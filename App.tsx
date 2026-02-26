import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { POS } from './pages/POS';
import { Inventory } from './pages/Inventory';
import { Finance } from './pages/Finance';
import { Login } from './pages/Login';
import { Suppliers } from './pages/Suppliers';
import { Promotions } from './pages/Promotions';
import { Reports } from './pages/Reports';
import { useStore } from './hooks/useStore';
import { TransactionType, CartItem, Client, Transaction } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const store = useStore();

  // Guard: If not logged in, show login
  if (!store.currentUser) {
    return <Login onLogin={store.login} />;
  }

  const handleCheckout = (cart: CartItem[], total: number, method: any, client: Client): Transaction => {
    // 1. Create Transaction Object
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: TransactionType.INCOME,
      amount: total,
      description: `Venta POS - ${client.name}`,
      method: method,
      cashierName: store.currentUser?.username,
      clientName: client.name,
      items: cart
    };

    // 2. Save to Store
    store.addTransaction(newTransaction);

    // 3. Update Stock
    store.updateStock(cart.map(item => ({ id: item.id, quantity: item.quantity })));
    
    return newTransaction;
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab} 
      currentUser={store.currentUser}
      onLogout={store.logout}
    >
      {activeTab === 'pos' && (
        <POS 
          products={store.products} 
          clients={store.clients}
          onCheckout={handleCheckout} 
        />
      )}
      
      {activeTab === 'inventory' && store.currentUser.role === 'ADMIN' && (
        <Inventory 
          products={store.products} 
          onAddProduct={store.addProduct}
          onUpdateProduct={store.updateProduct}
        />
      )}
      
      {activeTab === 'finance' && store.currentUser.role === 'ADMIN' && (
        <Finance 
          transactions={store.transactions} 
          currentBalance={store.getBalance()}
          onAddTransaction={store.addTransaction}
        />
      )}

      {activeTab === 'suppliers' && store.currentUser.role === 'ADMIN' && (
        <Suppliers
          suppliers={store.suppliers}
          onAdd={store.addSupplier}
          onRemove={store.removeSupplier}
        />
      )}

      {activeTab === 'promotions' && store.currentUser.role === 'ADMIN' && (
        <Promotions
          promotions={store.promotions}
          onAdd={store.addPromotion}
          onUpdate={store.updatePromotion}
        />
      )}

      {activeTab === 'reports' && store.currentUser.role === 'ADMIN' && (
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