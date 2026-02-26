import React, { useState, useMemo } from 'react';
import { Search, Package, CheckCircle, AlertTriangle, Clock, TrendingUp, ClipboardList, Plus, Minus, ScanBarcode, Users } from 'lucide-react';
import { Product, User } from '../types';
import { ProductIcon } from '../components/ProductIcon';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';

interface RepositorProps {
  products: Product[];
  currentUser: User;
  restocking: { id: string; productId: string; quantity: number; repostorId: string; timestamp: string }[];
  users: User[];
  onRestockFromDepot: (productId: string, quantity: number, repostorId: string, repostorName?: string) => void;
}


const LOW_STOCK = 10;
const CRITICAL_STOCK = 5;

const shelfStock = (p: Product) => p.stockGondola;
const totalStock = (p: Product) => p.stockDepot + p.stockGondola;

export const Repositor: React.FC<RepositorProps> = ({ products, currentUser, restocking, users, onRestockFromDepot }) => {
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'critical'>('all');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = products;

    if (filterMode === 'low') list = products.filter(p => shelfStock(p) < LOW_STOCK && shelfStock(p) >= CRITICAL_STOCK);
    if (filterMode === 'critical') list = products.filter(p => shelfStock(p) < CRITICAL_STOCK);

    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.barcode?.includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => shelfStock(a) - shelfStock(b));
  }, [products, search, filterMode]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  const stats = useMemo(() => {
    const todayRestocking = restocking.filter(r => {
      const t = new Date(typeof r.timestamp === 'string' ? r.timestamp : (r as any).timestamp);
      t.setHours(0, 0, 0, 0);
      return t.getTime() === today;
    });
    return {
      critical: products.filter(p => shelfStock(p) < CRITICAL_STOCK).length,
      low: products.filter(p => shelfStock(p) >= CRITICAL_STOCK && shelfStock(p) < LOW_STOCK).length,
      restockedToday: todayRestocking.length,
      unitsRestocked: todayRestocking.reduce((acc, r) => acc + r.quantity, 0),
    };
  }, [products, restocking, today]);

  const handleSelect = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleRestock = () => {
    if (!selectedProduct || quantity <= 0) return;
    const move = Math.min(quantity, selectedProduct.stockDepot);
    if (move <= 0) return;

    onRestockFromDepot(selectedProduct.id, move, currentUser.id, currentUser.fullName);

    setSuccessMsg(`✓ ${move} un. de "${selectedProduct.name}" repuestas en góndola`);
    setTimeout(() => setSuccessMsg(null), 3000);
    setSelectedProduct(null);
    setQuantity(1);
    setSearch('');
  };

  const getStockStatus = (stock: number) => {
    if (stock < CRITICAL_STOCK) return { label: 'CRÍTICO', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
    if (stock < LOW_STOCK) return { label: 'BAJO', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' };
    return { label: 'OK', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <ClipboardList size={26} className="text-blue-400 flex-shrink-0 sm:w-7 sm:h-7" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Reposición de Stock</h1>
            <p className="text-slate-400 text-xs sm:text-sm truncate">Hola, {currentUser.fullName}</p>
          </div>
        </div>
        <div className="text-right text-xs sm:text-sm text-slate-400 flex-shrink-0">
          <div className="font-mono text-base sm:text-lg text-white">
            {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div>{new Date().toLocaleDateString('es-AR', { weekday: 'short', day: '2-digit', month: 'short' })}</div>
        </div>
      </div>

      {/* Alerta de éxito */}
      {successMsg && (
        <div className="bg-green-600 text-white px-5 py-3 flex items-center gap-3 font-medium">
          <CheckCircle size={20} />
          {successMsg}
        </div>
      )}

      {/* Stats rápidos: 2x2 en móvil, 4 columnas en desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 bg-white border-b border-gray-200">
        <div className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-red-600">{stats.critical}</div>
          <div className="text-xs text-gray-500 mt-1">Stock Crítico</div>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-orange-500">{stats.low}</div>
          <div className="text-xs text-gray-500 mt-1">Stock Bajo</div>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">{stats.restockedToday}</div>
          <div className="text-xs text-gray-500 mt-1">Reposiciones Hoy</div>
        </div>
        <div className="p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.unitsRestocked}</div>
          <div className="text-xs text-gray-500 mt-1">Unidades Repuestas</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-0 lg:gap-4 p-3 sm:p-4">
        {/* Panel izquierdo: búsqueda y lista */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0">
          {/* Búsqueda + Escanear: escanear destacado en móvil */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="order-first sm:order-last flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-blue-400 bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors shrink-0 touch-target"
            >
              <ScanBarcode size={22} />
              Escanear producto
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nombre, SKU o código..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todos', count: products.length },
              { key: 'low', label: 'Stock Bajo', count: stats.low, color: 'text-orange-600' },
              { key: 'critical', label: 'Crítico', count: stats.critical, color: 'text-red-600' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterMode(f.key as any)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  filterMode === f.key
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                {f.label}
                <span className={`ml-1 font-bold ${filterMode === f.key ? '' : (f.color || '')}`}>
                  ({f.count})
                </span>
              </button>
            ))}
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px]" style={{ maxHeight: 'min(55vh, 400px)' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package size={48} className="mx-auto mb-3 opacity-30" />
                <p>Sin productos para mostrar</p>
              </div>
            ) : (
              filtered.map(product => {
                const status = getStockStatus(shelfStock(product));
                const isSelected = selectedProduct?.id === product.id;
                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelect(product)}
                    className={`w-full flex items-center gap-2 sm:gap-3 p-3 sm:p-3 rounded-xl border transition-all text-left touch-target min-h-[72px] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm active:bg-gray-50'
                    }`}
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-lg overflow-hidden">
                      <ProductIcon category={product.category} size="md" className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 text-sm truncate">{product.name}</div>
                      <div className="text-xs text-gray-500 truncate">{product.sku} · {product.category}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm sm:text-lg text-gray-800">
                        <span className="text-amber-600">D:{product.stockDepot}</span> <span className="text-emerald-600">G:{product.stockGondola}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Panel derecho: acción de reposición + historial (en móvil va debajo, scroll) */}
        <div className="lg:w-80 flex flex-col gap-4 mt-4 lg:mt-0 flex-shrink-0">
          {/* Producto seleccionado */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <Package size={16} className="text-blue-600" />
                Reponer Producto
              </h3>
            </div>

            {selectedProduct ? (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <ProductIcon category={selectedProduct.category} size="md" className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm leading-tight">{selectedProduct.name}</p>
                    <p className="text-xs text-gray-500">{selectedProduct.sku}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className={`w-2 h-2 rounded-full ${getStockStatus(selectedProduct.stockGondola).dot}`} />
                      <span className="text-xs text-gray-600">
                        Dep: {selectedProduct.stockDepot} · Gón: <strong>{selectedProduct.stockGondola} un.</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selector de cantidad */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Cantidad a reponer</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      className="flex-1 text-center text-2xl font-bold py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
                      value={quantity}
                      onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[5, 10, 20, 50].map(n => (
                      <button
                        key={n}
                        onClick={() => setQuantity(n)}
                        className="flex-1 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Depósito:</span>
                    <span className="font-semibold">{selectedProduct.stockDepot} un.</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Góndola actual:</span>
                    <span className="font-semibold">{selectedProduct.stockGondola} un.</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>A reponer (máx. {selectedProduct.stockDepot}):</span>
                    <span className="font-semibold text-blue-600">+{Math.min(quantity, selectedProduct.stockDepot)} un.</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-blue-200 mt-2 pt-2">
                    <span>Góndola resultante:</span>
                    <span className="text-green-600">{selectedProduct.stockGondola + Math.min(quantity, selectedProduct.stockDepot)} un.</span>
                  </div>
                </div>

                <button
                  onClick={handleRestock}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm touch-target"
                >
                  <CheckCircle size={20} />
                  Confirmar Reposición
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <Package size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Seleccioná un producto de la lista para reponer</p>
              </div>
            )}
          </div>

          {/* Historial de reposiciones (compartido entre todo el equipo) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                <Clock size={16} className="text-green-600" />
                Reposiciones de Hoy
                {restocking.length > 0 && (
                  <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    {restocking.length}
                  </span>
                )}
              </h3>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Users size={12} />
                Historial compartido (todo el equipo)
              </p>
            </div>
            <div className="divide-y divide-gray-50" style={{ maxHeight: '280px', overflowY: 'auto' }}>
              {restocking.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">
                  <TrendingUp size={28} className="mx-auto mb-2 opacity-30" />
                  Sin reposiciones aún
                </div>
              ) : (
                restocking.slice(0, 50).map(r => {
                  const name = products.find(p => p.id === r.productId)?.name ?? r.productId;
                  const repostorName = users.find(u => u.id === r.repostorId)?.fullName ?? r.repostorId;
                  const ts = typeof r.timestamp === 'string' ? new Date(r.timestamp) : (r as any).timestamp;
                  return (
                    <div key={r.id} className="px-4 py-3 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{name}</p>
                        <p className="text-xs text-gray-400">
                          {(ts instanceof Date ? ts : new Date(ts as string)).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                          {' · por '}
                          <span className="font-medium text-gray-600">{repostorName}</span>
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600 flex-shrink-0">+{r.quantity}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <BarcodeScannerModal
          products={products}
          mode="view"
          onDetect={(product) => {
            setSelectedProduct(product);
            setQuantity(1);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};
