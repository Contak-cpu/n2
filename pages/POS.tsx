import React, { useState, useMemo } from 'react';
import { Search, Trash2, CreditCard, ShoppingBag, Users, UserPlus, Camera, BarChart3, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { Product, CartItem, Client, Transaction, TransactionType, CheckoutLine, User, Promotion } from '../types';
import { PaymentModal } from '../components/PaymentModal';
import { ReceiptModal } from '../components/ReceiptModal';
import { ProductIcon } from '../components/ProductIcon';
import { CheckoutLineCard } from '../components/CheckoutLineCard';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';
import { getFeatureSettings } from '../utils/featureSettings';

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

const POSComponent: React.FC<POSProps> = ({
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
  const [showCajasPanel, setShowCajasPanel] = useState(true);
  const [showResumenPanel, setShowResumenPanel] = useState(true);

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


  const features = getFeatureSettings();
  const activePromotionsFiltered = features.promocionesPOS ? activePromotions : [];

  // Subtotal sin descuentos (precio base × cantidad)
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  // Descuentos por promociones activas
  const { discountAmount, total } = useMemo(() => {
    let discount = 0;
    const now = new Date();

    for (const promo of activePromotionsFiltered) {
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
  }, [cart, subtotal, activePromotionsFiltered]);

  const handlePaymentSuccess = (method: any) => {
    const transaction = onCheckout(selectedLineId ?? undefined, cart, total, method, selectedClient);
    setCart([]);
    setPaymentModalOpen(false);
    setLastTransaction(transaction);
  };

  const getCashierName = (cashierId: string) => users.find(u => u.id === cashierId)?.fullName ?? cashierId;

  const isCashier = currentUser?.role === 'CASHIER';

  /** Cajero solo ve su caja abierta o las cerradas para abrir una (sin ver datos de otras). */
  const visibleLines = useMemo(() => {
    if (!isCashier || !currentUser) return checkoutLines;
    const myOpenLine = checkoutLines.find(l => l.status === 'OPEN' && l.cashierId === currentUser.id);
    if (myOpenLine) return [myOpenLine];
    return checkoutLines.filter(l => l.status === 'CLOSED');
  }, [checkoutLines, isCashier, currentUser]);

  /** Resumen del día: para cajero solo su caja; para admin/supervisor todas. */
  const daySummary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let todayTx = transactions.filter(t => {
      const d = new Date(t.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && t.type === TransactionType.INCOME;
    });
    if (isCashier && selectedLineId) {
      todayTx = todayTx.filter(t => t.lineId === selectedLineId);
    }
    const totalSales = todayTx.reduce((acc, t) => acc + (t.amount ?? 0), 0);
    return {
      totalSales,
      transactionCount: todayTx.length,
      average: todayTx.length > 0 ? totalSales / todayTx.length : 0,
    };
  }, [transactions, isCashier, selectedLineId]);

  /** Cajero: si tiene una sola caja (la suya), seleccionarla por defecto. */
  React.useEffect(() => {
    if (!isCashier || !currentUser) return;
    const myOpen = checkoutLines.find(l => l.status === 'OPEN' && l.cashierId === currentUser.id);
    if (myOpen && selectedLineId !== myOpen.id) setSelectedLineId(myOpen.id);
  }, [isCashier, currentUser, checkoutLines, selectedLineId]);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden min-h-0">
      {/* Left: Líneas de caja - en móvil barra horizontal, en desktop columna */}
      {showCajasPanel ? (
        <div className="w-full lg:w-56 xl:w-64 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50/50 flex flex-col">
          <div className="p-2 sm:p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-2">
              <LayoutGrid size={18} className="text-blue-600" />
              {isCashier ? 'Mi caja' : 'Cajas'}
            </h3>
            <button
              type="button"
              onClick={() => setShowCajasPanel(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 lg:block hidden"
              title="Comprimir panel"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto lg:overflow-y-auto overflow-y-hidden p-2 lg:p-3 flex lg:grid grid-cols-1 gap-2 flex-row lg:flex-col" style={{ minHeight: '72px' }}>
            {visibleLines.map(line => (
              <div key={line.id} className="flex-shrink-0 w-[140px] sm:w-[160px] lg:w-full">
                <CheckoutLineCard
                  line={line}
                  cashierName={line.cashierId ? getCashierName(line.cashierId) : undefined}
                  isSelected={selectedLineId === line.id}
                  onClick={() => setSelectedLineId(line.id)}
                  onOpen={currentUser ? (id) => openCheckoutLine?.(id, currentUser.id) : undefined}
                  onClose={closeCheckoutLine}
                  currentUserId={currentUser?.id}
                  hideStats={isCashier && line.status === 'CLOSED'}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col w-12 flex-shrink-0 border-r border-gray-200 bg-gray-100/80 items-center py-2">
          <button
            type="button"
            onClick={() => setShowCajasPanel(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-blue-600 flex flex-col items-center gap-0.5"
            title="Expandir cajas"
          >
            <LayoutGrid size={20} />
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Center: Product Catalog + Cart */}
      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden min-w-0">
        <div className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 flex flex-col overflow-hidden min-h-0 pr-4 lg:pr-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o código..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {features.escanerPOS && (
            <button
              type="button"
              onClick={() => setScannerOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-blue-400 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors touch-target"
            >
              <Camera size={20} />
              Escanear
            </button>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto overflow-x-hidden pb-4 pr-1 min-w-0"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            alignContent: 'start',
          }}
        >
          {filteredProducts.map(product => {
            const price = product.price;
            const isLowStock = product.stockGondola < 10;
            return (
              <button
                key={product.id}
                type="button"
                onClick={() => addToCart(product)}
                disabled={product.stockGondola <= 0}
                className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all text-left flex flex-col relative group min-w-0 w-full overflow-hidden touch-target ${
                  product.stockGondola <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-blue-100/50 active:bg-slate-50'
                } ${isLowStock ? 'border-amber-200' : 'border-slate-100'}`}
                style={{ minHeight: '200px' }}
              >
                <div className="flex-shrink-0 w-full aspect-square max-h-28 sm:max-h-32 rounded-t-xl overflow-hidden bg-slate-50">
                  <ProductIcon category={product.category} size="md" className="w-full h-full rounded-t-xl object-cover" />
                </div>

                <div className="flex flex-col flex-1 p-3 min-w-0">
                  <h3 className="font-semibold text-slate-800 leading-snug text-sm line-clamp-2 mb-0.5">{product.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate mb-2">{product.sku}</p>

                  <div className="mt-auto pt-2 border-t border-slate-100 flex items-end justify-between gap-2">
                    <span className="text-base font-bold text-blue-600 tabular-nums">${price.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">{product.stockGondola} un.</span>
                  </div>
                </div>

                {isLowStock && product.stockGondola > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-amber-100 text-amber-800 px-1.5 py-0.5 text-[10px] font-semibold rounded-md shadow-sm">
                    Bajo
                  </span>
                )}
                {product.stockGondola <= 0 && (
                  <div className="absolute inset-0 bg-slate-100/80 flex items-center justify-center z-10">
                    <span className="bg-slate-700 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">AGOTADO</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        </div>

        {/* Carrito: en móvil altura fija abajo con safe-area */}
        <div className="w-full lg:w-96 flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 flex flex-col h-[42vh] min-h-[280px] lg:h-full lg:min-h-0 shadow-lg mt-3 lg:mt-0 pb-[env(safe-area-inset-bottom)] lg:pb-0">
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
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

        <div className="p-4 sm:p-6 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="space-y-2 mb-3 sm:mb-4">
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
            className={`w-full py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base sm:text-lg transition-all transform active:scale-[0.98] touch-target ${
              cart.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-blue-500/30 hover:from-blue-500 hover:to-blue-600'
            }`}
          >
            <CreditCard size={22} className="sm:w-6 sm:h-6" />
            COBRAR
          </button>
        </div>
        </div>
      </div>

      {/* Right: Resumen del día - colapsable (cajero solo ve su caja) */}
      {showResumenPanel ? (
        <div className="w-full lg:w-64 xl:w-72 flex-shrink-0 border-l border-gray-200 bg-gray-50/80 flex flex-col hidden lg:flex">
          <div className="p-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 size={18} className="text-green-600" />
              {isCashier ? 'Mi resumen' : 'Resumen'}
            </h3>
            <button
              type="button"
              onClick={() => setShowResumenPanel(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              title="Comprimir panel"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-medium">Total vendido</p>
              <p className="text-2xl font-bold text-green-700">${daySummary.totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-medium">Transacciones</p>
              <p className="text-2xl font-bold text-gray-800">{daySummary.transactionCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-medium">Promedio</p>
              <p className="text-xl font-bold text-blue-700">${daySummary.average.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-col w-12 flex-shrink-0 border-l border-gray-200 bg-gray-100/80 items-center py-2">
          <button
            type="button"
            onClick={() => setShowResumenPanel(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-green-600 flex flex-col items-center gap-0.5"
            title="Expandir resumen"
          >
            <BarChart3 size={20} />
            <ChevronLeft size={14} />
          </button>
        </div>
      )}
      
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

export const POS = React.memo(POSComponent);