import React from 'react';
import { ShoppingCart, User, Lock, Unlock } from 'lucide-react';
import { CheckoutLine } from '../types';
import { Badge } from './Badge';

interface CheckoutLineCardProps {
  line: CheckoutLine;
  cashierName?: string;
  isSelected: boolean;
  onClick: () => void;
  onOpen?: (lineId: string) => void;
  onClose?: (lineId: string) => void;
  currentUserId?: string;
  /** Oculta ventas e ingresos (para que un cajero no vea datos de otras cajas). */
  hideStats?: boolean;
}

export const CheckoutLineCard: React.FC<CheckoutLineCardProps> = ({
  line,
  cashierName,
  isSelected,
  onClick,
  onOpen,
  onClose,
  currentUserId,
  hideStats = false,
}) => {
  const statusVariant: 'success' | 'warning' | 'default' =
    line.status === 'OPEN'
      ? 'success'
      : line.status === 'SUSPENDED'
      ? 'warning'
      : 'default';

  return (
    <div
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <button type="button" onClick={onClick} className="w-full text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-800">{line.name}</span>
          <Badge variant={statusVariant}>{line.status}</Badge>
        </div>
        {!hideStats && line.cashierId && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
            <User size={12} />
            {cashierName ?? `Cajero #${line.cashierId}`}
          </div>
        )}
        {!hideStats && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <ShoppingCart size={14} />
              {line.transactionCount} ventas
            </span>
            <span className="font-bold text-green-700">
              ${line.totalSales.toLocaleString()}
            </span>
          </div>
        )}
      </button>
      <div className="mt-2 pt-2 border-t border-gray-100 flex gap-1">
        {line.status === 'CLOSED' && onOpen && currentUserId && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onOpen(line.id); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
          >
            <Unlock size={12} />
            Abrir
          </button>
        )}
        {line.status === 'OPEN' && onClose && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onClose(line.id); }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
          >
            <Lock size={12} />
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};
