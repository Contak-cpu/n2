import React, { useState, useMemo } from 'react';
import { Search, Trash2, CreditCard, ShoppingBag, Users, UserPlus, Camera, BarChart3 } from 'lucide-react';
import { Product, CartItem, Client, Transaction, TransactionType, CheckoutLine, User, Promotion } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { ProductIcon } from '../components/ProductIcon';
import { CheckoutLineCard } from '../components/CheckoutLineCard';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';

interface POSProps {
  products: Product[];
  clients: Client[];
  checkoutLines: CheckoutLine[];
  users: User[];
  currentUser: User | null;
  transactions: Transaction[];
  activePromotions?: Promotion[];
  onCheckout: (lineId: string | undefined, cart: CartItem[], total: number, method: any, client: Client) => Transaction;
  openCheckoutLine?: (lineId: string, cashierId: string) => void;
  closeCheckoutLine?: (lineId: string) => void;
}

export const POS: React.FC<POSProps> = ({
  products,
  clients,
  checkoutLines,
  users,
  currentUser,
  transactions,
  activePromotions = [],
  onCheckout,
  openCheckoutLine,
  closeCheckoutLine,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client>(clients[0]);
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [isScannerOpen, setScannerOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(lowerSearch) || 
      p.sku.toLowerCase().includes(lowerSearch) ||
      (p.barcode && p.barcode.includes(lowerSearch))
    );
  }, [products, search]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stockGondola <= 0) return;

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);

      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, appliedPrice: product.price }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && newQty > item.stockGondola) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };


  // Subtotal sin descuentos (precio base × cantidad)
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Descuentos por promociones activas
  const { discountAmount, total } = useMemo(() => {
    let discount = 0;
    const now = new Date();

    for (const promo of activePromotions) {
      const from = new Date(promo.validFrom);
      const to = new Date(promo.validTo);
      if (!promo.active || now < from || now > to) continue;

      if (promo.type === 'PERCENTAGE') {
        if (promo.productIds.length === 0) {
          discount += (subtotal * promo.discount) / 100;
        } else {
          cart.forEach(item => {
            if (promo.productIds.includes(item.id)) {
              discount += (item.price * item.quantity * promo.discount) / 100;
            }
          });
        }
      } else if (promo.type === 'FIXED_AMOUNT') {
        const minPurchase = 500;
        if (subtotal >= minPurchase) {
          if (promo.productIds.length === 0) {
            discount += promo.discount;
          } else {
            const hasPromoProduct = cart.some(i => promo.productIds.includes(i.id));
            if (hasPromoProduct) discount += promo.discount;
          }
        }
      } else if (promo.type === 'BUY_X_GET_Y') {
        cart.forEach(item => {
          if (!promo.productIds.includes(item.id)) return;
          const pct = promo.discount / 100;
          const freePer = pct <= 0.5 ? 2 : 3;
          const freeUnits = Math.floor(item.quantity / freePer);
          discount += freeUnits * item.price;
        });
      }
    }

    return { discountAmount: discount, total: Math.max(0, subtotal - discount) };
  }, [cart, subtotal, activePromotions]);

  const handlePaymentSuccess = (method: any) => {
    const transaction = onCheckout(selectedLineId ?? undefined, cart, total, method, selectedClient);
    setCart([]);
    setPaymentModalOpen(false);
    setLastTransaction(transaction);
  };

  const getCashierName = (cashierId: string) => users.find(u => u.id === cashierId)?.fullName ?? cashierId;

  const daySummary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTx = transactions.filter(t => {
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && t.type === TransactionType.INCOME;
    });
    const totalSales = todayTx.reduce((acc, t) => acc + (t.amount ?? 0), 0);
    return {
      totalSales,
      transactionCount: todayTx.length,
      average: todayTx.length > 0 ? totalSales / todayTx.length : 0,
    };
  }, [transactions]);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden">
      {/* Left: Líneas de caja */}
      <div className="w-full lg:w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50/50 p-4 overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-blue-600" />
          Cajas
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
          {checkoutLines.map(line => (
            <CheckoutLineCard
              key={line.id}
              line={line}
              cashierName={line.cashierId ? getCashierName(line.cashierId) : undefined}
              isSelected={selectedLineId === line.id}
              onClick={() => setSelectedLineId(line.id)}
            />
          ))}
        </div>
      </div>

      {/* Center: Product Catalog + Cart */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden min-w-0">
        <div className="flex-1 min-w-0 p-4 lg:p-6 flex flex-col overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o código..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button
            type="button"
            onClick={() => setScannerOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-blue-200 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors"
          >
            <Camera size={20} />
            Escanear
          </button>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 content-start">
          {filteredProducts.map(product => {
            const price = product.price;
            const isLowStock = product.stockGondola < 10;
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stockGondola <= 0}
                style={{ minHeight: '200px' }}
                className={`bg-white p-4 rounded-xl border shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between relative group ${
                  product.stockGondola <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400'
                } ${isLowStock ? 'border-red-100' : 'border-gray-100'}`}
              >
                <div className="w-full h-32 mb-3 rounded-lg overflow-hidden relative">
                  <ProductIcon category={product.category} size="md" className="w-full h-full rounded-lg" />
                </div>

                {isLowStock && product.stockGondola > 0 && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-0.5 text-xs font-bold rounded-lg shadow-sm">
                    Stock Bajo
                  </div>
                )}
                {product.stockGondola <= 0 && (
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
                    <span className="text-lg font-bold text-blue-700">
                      ${price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">{product.stockGondola} un.</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        </div>

        {/* Carrito */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-[45vh] lg:h-full shadow-lg mt-4 lg:mt-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="text-blue-600" />
                Ticket
                {selectedLineId && (
                  <span className="text-xs font-normal text-gray-500">
                    Caja {checkoutLines.find(l => l.id === selectedLineId)?.name}
                  </span>
                )}
              </h2>
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
                <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 border border-gray-100 mr-3">
                  <ProductIcon category={item.category} size="md" className="w-full h-full" />
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
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-gray-700">${subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Descuento (promos)</span>
                <span className="font-medium text-green-600">-${discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-end pt-2 border-t border-gray-100">
              <span className="text-gray-700 font-medium">Total a Pagar</span>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                ${total.toLocaleString()}
              </span>
            </div>
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
      </div>

      {/* Right: Resumen del día */}
      <div className="w-full lg:w-72 flex-shrink-0 border-l border-gray-200 bg-gray-50/80 p-4 overflow-y-auto hidden xl:block">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart3 size={18} className="text-green-600" />
          Resumen del día
        </h3>
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-medium">Total vendido</p>
            <p className="text-2xl font-bold text-green-700">${daySummary.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-medium">Transacciones</p>
            <p className="text-2xl font-bold text-gray-800">{daySummary.transactionCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-medium">Promedio por venta</p>
            <p className="text-xl font-bold text-blue-700">${daySummary.average.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>
      
      {isScannerOpen && (
        <BarcodeScannerModal
          products={products}
          onDetect={(product) => {
            addToCart(product);
            setScannerOpen(false);
          }}
          onClose={() => setScannerOpen(false)}
          mode="add"
        />
      )}
      
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