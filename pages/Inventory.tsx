import React, { useState } from 'react';
import { Product } from '../types';
import { Search, Plus, Edit2, AlertTriangle, Save, X, Image as ImageIcon, ScanBarcode } from 'lucide-react';
import { LOW_STOCK_THRESHOLD, PRODUCT_CATEGORIES } from '../constants';
import { ProductIcon } from '../components/ProductIcon';
import { BarcodeScannerModal } from '../components/BarcodeScannerModal';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct }) => {
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    (p.barcode && p.barcode.includes(search))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (editingProduct.id) {
      onUpdateProduct(editingProduct as Product);
    } else {
      onAddProduct({
        ...editingProduct,
        id: Date.now().toString(),
      } as Product);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const openNewProduct = () => {
    setEditingProduct({
      sku: '',
      barcode: '',
      name: '',
      category: 'General',
      cost: 0,
      price: 0,
      stockDepot: 0,
      stockGondola: 0,
    });
    setIsModalOpen(true);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setIsModalOpen(true);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Inventario</h1>
          <p className="text-gray-500 text-sm">Gestiona tu stock y precios</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-400 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors touch-target"
          >
            <ScanBarcode size={20} />
            Escanear
          </button>
          <button 
            onClick={openNewProduct}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium shadow-sm transition-all active:scale-[0.98] touch-target"
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Móvil: cards */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3 active:bg-gray-50"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <ProductIcon category={product.category} size="md" className="w-full h-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{product.name}</div>
              <div className="text-xs text-gray-500 font-mono">{product.sku} · {product.category}</div>
              <div className="flex flex-wrap gap-2 mt-1.5 text-xs">
                <span className="text-gray-500">Dep: <strong>{product.stockDepot}</strong></span>
                <span className={product.stockGondola < LOW_STOCK_THRESHOLD ? 'text-red-600 font-bold' : 'text-green-600'}>
                  Gón: <strong>{product.stockGondola}</strong>
                </span>
                <span className="text-blue-600 font-medium">${product.price}</span>
              </div>
            </div>
            <button
              onClick={() => openEditProduct(product)}
              className="p-2.5 rounded-lg text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors touch-target flex-shrink-0"
              aria-label="Editar"
            >
              <Edit2 size={20} />
            </button>
          </div>
        ))}
      </div>

      {/* Desktop: tabla */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                <th className="px-6 py-4">Img</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Costo</th>
                <th className="px-6 py-4">Precio</th>
                <th className="px-6 py-4">Depósito</th>
                <th className="px-6 py-4">Góndola</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                       {product.imageUrl ? (
                         <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                       ) : (
                         <ImageIcon size={16} className="text-gray-400" />
                       )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">${product.cost}</td>
                  <td className="px-6 py-4 text-blue-700 font-medium">${product.price}</td>
                  <td className="px-6 py-4 text-gray-600">{product.stockDepot}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      product.stockGondola < LOW_STOCK_THRESHOLD 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {product.stockGondola < LOW_STOCK_THRESHOLD && <AlertTriangle size={12} />}
                      {product.stockGondola} un.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openEditProduct(product)}
                      className="text-gray-400 hover:text-blue-600 p-1 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">SKU</label>
                  <input 
                    required 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({...editingProduct, sku: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Código de barras</label>
                  <input 
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProduct.barcode || ''}
                    onChange={e => setEditingProduct({...editingProduct, barcode: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                  <select
                    required
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={editingProduct.category || 'General'}
                    onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                  >
                    {PRODUCT_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input 
                  required 
                  className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Costo</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" required min="0"
                      className="w-full border rounded-lg pl-7 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editingProduct.cost}
                      onChange={e => setEditingProduct({...editingProduct, cost: Number(e.target.value)})}
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Depósito</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProduct.stockDepot ?? 0}
                    onChange={e => setEditingProduct({...editingProduct, stockDepot: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Góndola</label>
                  <input 
                    type="number" required min="0"
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingProduct.stockGondola ?? 0}
                    onChange={e => setEditingProduct({...editingProduct, stockGondola: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-blue-700 uppercase mb-1">Precio de venta</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" required min="0"
                      className="w-full border border-blue-200 rounded-lg pl-7 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      value={editingProduct.price ?? 0}
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="hidden">
                  <label className="block text-xs font-bold text-purple-700 uppercase mb-1">Precio 2</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <input 
                      type="number" required min="0"
                      className="w-full border border-purple-200 rounded-lg pl-7 p-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                      value={editingProduct.price ?? 0}
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                <Save size={18} />
                Guardar Producto
              </button>
            </form>
          </div>
        </div>
      )}

      {showScanner && (
        <BarcodeScannerModal
          products={products}
          mode="view"
          onDetect={(product) => {
            setShowScanner(false);
            openEditProduct(product);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};