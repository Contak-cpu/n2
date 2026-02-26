import React, { useState } from 'react';
import { Gift, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Promotion } from '../types';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';

interface PromotionsProps {
  promotions: Promotion[];
  onAdd: (promotion: Promotion) => void;
  onUpdate: (id: string, updates: Partial<Promotion>) => void;
}

export const Promotions: React.FC<PromotionsProps> = ({ promotions, onAdd, onUpdate }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    description: '',
    type: 'PERCENTAGE',
    discount: 0,
    productIds: [],
    validFrom: new Date(),
    validTo: new Date(),
    active: true,
  });

  const handleAddPromotion = () => {
    if (!formData.name || !formData.description || formData.discount === undefined) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newPromotion: Promotion = {
      id: Date.now().toString(),
      name: formData.name!,
      description: formData.description!,
      type: (formData.type || 'PERCENTAGE') as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y',
      discount: formData.discount!,
      productIds: formData.productIds || [],
      validFrom: formData.validFrom || new Date(),
      validTo: formData.validTo || new Date(),
      active: true,
      usageCount: 0,
    };

    onAdd(newPromotion);
    setModalOpen(false);
    setFormData({
      name: '',
      description: '',
      type: 'PERCENTAGE',
      discount: 0,
      productIds: [],
      validFrom: new Date(),
      validTo: new Date(),
      active: true,
    });
  };

  const getDiscountLabel = (promo: Promotion) => {
    if (promo.type === 'PERCENTAGE') return `${promo.discount}%`;
    if (promo.type === 'FIXED_AMOUNT') return `$${promo.discount}`;
    return `${promo.type}`;
  };

  const isPromotionExpired = (promo: Promotion) => {
    return new Date() > new Date(promo.validTo);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Gift className="text-purple-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Promociones</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 font-medium transition-colors"
        >
          <Plus size={20} />
          Nueva Promoción
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promotions.map(promo => (
            <div
              key={promo.id}
              className={`bg-white rounded-xl border-2 p-4 shadow-sm transition-all ${
                isPromotionExpired(promo)
                  ? 'border-red-200 opacity-60'
                  : promo.active
                  ? 'border-purple-300 hover:border-purple-500'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg">{promo.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                </div>
                <div className="ml-2">
                  <Badge variant={promo.active ? 'success' : 'default'}>
                    {promo.active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-purple-600">Descuento:</span>
                  <span className="text-2xl font-bold text-purple-700">{getDiscountLabel(promo)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{promo.type}</p>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <p>Válida desde: {new Date(promo.validFrom).toLocaleDateString('es-AR')}</p>
                <p>Válida hasta: {new Date(promo.validTo).toLocaleDateString('es-AR')}</p>
                {isPromotionExpired(promo) && <p className="text-red-600 font-medium">Expirada</p>}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Productos: {promo.productIds.length > 0 ? promo.productIds.join(', ') : 'Todos'}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onUpdate(promo.id, { active: !promo.active })}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                >
                  {promo.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {promo.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva Promoción"
        size="lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddPromotion}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              Crear Promoción
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Ej: 2x1 en Bebidas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Detalla cómo funciona la promoción"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Descuento</label>
            <select
              value={formData.type || 'PERCENTAGE'}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="FIXED_AMOUNT">Monto Fijo ($)</option>
              <option value="BUY_X_GET_Y">Compra X lleva Y</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valor del Descuento</label>
            <input
              type="number"
              value={formData.discount || 0}
              onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Ingresa el valor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Válida Desde</label>
              <input
                type="date"
                value={formData.validFrom ? new Date(formData.validFrom).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, validFrom: new Date(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Válida Hasta</label>
              <input
                type="date"
                value={formData.validTo ? new Date(formData.validTo).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({ ...formData, validTo: new Date(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
