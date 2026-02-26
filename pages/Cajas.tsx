import React from 'react';
import { LayoutGrid, BarChart3 } from 'lucide-react';
import { CheckoutLine, User } from '../types';
import { CheckoutLineCard } from '../components/CheckoutLineCard';

interface CajasProps {
  checkoutLines: CheckoutLine[];
  users: User[];
  currentUser: User | null;
  onOpenLine: (lineId: string, cashierId: string) => void;
  onCloseLine: (lineId: string) => void;
}

export const Cajas: React.FC<CajasProps> = ({
  checkoutLines,
  users,
  currentUser,
  onOpenLine,
  onCloseLine,
}) => {
  const getCashierName = (cashierId: string) =>
    users.find(u => u.id === cashierId)?.fullName ?? cashierId;

  const totalVentas = checkoutLines.reduce((acc, l) => acc + l.totalSales, 0);
  const totalTransacciones = checkoutLines.reduce((acc, l) => acc + l.transactionCount, 0);
  const abiertas = checkoutLines.filter(l => l.status === 'OPEN').length;

  return (
    <div className="p-4 sm:p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <LayoutGrid className="text-blue-600 flex-shrink-0" size={28} />
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Cajas</h1>
            <p className="text-sm text-gray-500">Abrir, cerrar y ver estado de las líneas de cobro</p>
          </div>
        </div>
      </div>

      {/* Resumen rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Cajas abiertas</p>
          <p className="text-2xl font-bold text-green-700">{abiertas} / {checkoutLines.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Total vendido (todas)</p>
          <p className="text-2xl font-bold text-blue-700">${totalVentas.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-medium">Transacciones totales</p>
          <p className="text-2xl font-bold text-gray-800">{totalTransacciones}</p>
        </div>
      </div>

      {/* Grid de cajas */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-600" />
          Líneas de caja
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {checkoutLines.map(line => (
            <CheckoutLineCard
              key={line.id}
              line={line}
              cashierName={line.cashierId ? getCashierName(line.cashierId) : undefined}
              isSelected={false}
              onClick={() => {}}
              onOpen={currentUser ? (id) => onOpenLine(id, currentUser.id) : undefined}
              onClose={onCloseLine}
              currentUserId={currentUser?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
