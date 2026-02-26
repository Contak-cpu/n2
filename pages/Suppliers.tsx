import React, { useState } from 'react';
import { Supplier } from '../types';
import { Search, Plus, Trash2, Truck, Phone, Mail } from 'lucide-react';

interface SuppliersProps {
  suppliers: Supplier[];
  onAdd: (s: Supplier) => void;
  onRemove: (id: string) => void;
}

export const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onAdd, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: Date.now().toString(),
      name: newSupplier.name!,
      cuit: newSupplier.cuit || '',
      phone: newSupplier.phone || '',
      email: newSupplier.email || ''
    } as Supplier);
    setIsModalOpen(false);
    setNewSupplier({});
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Truck className="text-blue-600" />
            Proveedores
          </h1>
          <p className="text-gray-500 text-sm">Gestiona la cadena de suministro</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus size={18} />
          Nuevo Proveedor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
            <button 
                onClick={() => onRemove(supplier.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                {supplier.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{supplier.name}</h3>
                <p className="text-xs text-gray-500">CUIT: {supplier.cuit}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                {supplier.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Nuevo Proveedor</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Empresa</label>
                <input required className="w-full border rounded-lg p-2" value={newSupplier.name || ''} onChange={e => setNewSupplier({...newSupplier, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CUIT</label>
                <input className="w-full border rounded-lg p-2" value={newSupplier.cuit || ''} onChange={e => setNewSupplier({...newSupplier, cuit: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                <input className="w-full border rounded-lg p-2" value={newSupplier.phone || ''} onChange={e => setNewSupplier({...newSupplier, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input className="w-full border rounded-lg p-2" value={newSupplier.email || ''} onChange={e => setNewSupplier({...newSupplier, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4">Guardar</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-gray-500 py-2 text-sm">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};