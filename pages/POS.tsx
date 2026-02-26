import React, { useState, useMemo } from 'react';
import { Search, Trash2, CreditCard, ShoppingBag, Image as ImageIcon, Users, UserPlus } from 'lucide-react';
import { Product, CartItem, PricingMode, Client, Transaction } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import { ReceiptModal } from '../components/ReceiptModal';

interface POSProps {
  products: Product[];
  clients: Client[];
  onCheckout: (cart: CartItem[], total: number, method: any, client: Client) => Transaction; // Modified to return transaction
}

export const POS: React.FC<POSProps> = ({ products, clients, onCheckout }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [pricingMode, setPricingMode] = useState<PricingMode>('RETAIL');
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]); // Default to consumer final
  
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerSearch) || 
      p.sku.toLowerCase().includes(lowerSearch)
    );
  }, [products, search]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const price = pricingMode === 'RETAIL' ? product.priceRetail : product.priceWholesale;
      
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1, appliedPrice: price } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, appliedPrice: price }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && newQty > item.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  React.useEffect(() => {
    setCart(prev => prev.map(item => ({
      ...item,
      appliedPrice: pricingMode === 'RETAIL' ? item.priceRetail : item.priceWholesale
    })));
  }, [pricingMode]);

  const total = cart.reduce((sum, item) => sum + (item.appliedPrice * item.quantity), 0);

  const handlePaymentSuccess = (method: any) => {
    const transaction = onCheckout(cart, total, method, selectedClient);
    setCart([]);
    setPaymentModalOpen(false);
    setLastTransaction(transaction); // Trigger Receipt Modal
  };

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left: Product Catalog */}
      <div className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex">
             <button
                onClick={() => setPricingMode('RETAIL')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pricingMode === 'RETAIL' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Minorista
              </button>
              <button
                onClick={() => setPricingMode('WHOLESALE')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pricingMode === 'WHOLESALE' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Mayorista
              </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredProducts.map(product => {
            const price = pricingMode === 'RETAIL' ? product.priceRetail : product.priceWholesale;
            const isLowStock = product.stock < 10;
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between relative overflow-hidden group ${
                  product.stock <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'
                } ${isLowStock ? 'border-red-100' : 'border-gray-100'}`}
              >
                <div className="w-full h-32 mb-3 bg-gray-100 rounded-lg overflow-hidden relative">
                   {product.imageUrl ? (
                     <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <ImageIcon size={32} />
                     </div>
                   )}
                </div>

                {isLowStock && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 text-xs font-bold rounded-lg shadow-sm">
                    Stock Bajo
                  </div>
                )}
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-gray-100/60 flex items-center justify-center backdrop-blur-[1px] z-10">
                    <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-bold transform -rotate-12 shadow-xl">AGOTADO</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 leading-tight mb-1 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
                </div>
                
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-lg font-bold ${pricingMode === 'WHOLESALE' ? 'text-purple-700' : 'text-blue-700'}`}>
                      ${price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">{product.stock} un.</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Shopping Cart */}
      <div className="w-full lg:w-[400px] bg-white border-l border-gray-200 flex flex-col h-[50vh] lg:h-full shadow-xl z-10">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <ShoppingBag className="text-blue-600" />
              Ticket
            </h2>
            <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
              pricingMode === 'WHOLESALE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {pricingMode === 'WHOLESALE' ? 'Mayorista' : 'Minorista'}
            </div>
          </div>
          
          {/* Client Selector */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users size={16} />
            </div>
            <select 
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={selectedClient.id}
                onChange={(e) => {
                    const client = clients.find(c => c.id === e.target.value);
                    if(client) setSelectedClient(client);
                }}
            >
                {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                <UserPlus size={16} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50">
              <ShoppingBag size={64} strokeWidth={1} />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 pr-3 rounded-lg group hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
                <div className="w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0 border border-gray-200 mr-3">
                   {item.imageUrl ? (
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">
                       <ImageIcon size={16} />
                     </div>
                   )}
                </div>

                <div className="flex-1 min-w-0 pr-3">
                  <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
                  <div className="text-xs text-gray-500">
                    ${item.appliedPrice.toLocaleString()} x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-xs">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex justify-between items-end mb-6">
            <span className="text-gray-500 font-medium">Total a Pagar</span>
            <span className="text-4xl font-bold text-gray-900 tracking-tight">
              ${total.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={() => setPaymentModalOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-all transform active:scale-95 ${
              cart.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-600'
            }`}
          >
            <CreditCard size={24} />
            COBRAR
          </button>
        </div>
      </div>
      
      {isPaymentModalOpen && (
        <PaymentModal
          total={total}
          onClose={() => setPaymentModalOpen(false)}
          onConfirm={handlePaymentSuccess}
        />
      )}

      {/* Receipt Printing Modal */}
      {lastTransaction && (
        <ReceiptModal 
            transaction={lastTransaction} 
            onClose={() => setLastTransaction(null)} 
        />
      )}
    </div>
  );
};