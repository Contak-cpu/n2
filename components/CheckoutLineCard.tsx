import React from 'react';
import { ShoppingCart, User } from 'lucide-react';
import { CheckoutLine } from '../types';
import { Badge } from './Badge';

interface CheckoutLineCardProps {
  line: CheckoutLine;
  cashierName?: string;
  isSelected: boolean;
  onClick: () => void;
}

export const CheckoutLineCard: React.FC<CheckoutLineCardProps> = ({
  line,
  cashierName,
  isSelected,
  onClick,
}) => {
  const statusVariant: 'success' | 'warning' | 'default' =
    line.status === 'OPEN'
      ? 'success'
      : line.status === 'SUSPENDED'
      ? 'warning'
      : 'default';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-gray-800">{line.name}</span>
        <Badge variant={statusVariant}>{line.status}</Badge>
      </div>
      {line.cashierId && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <User size={12} />
          {cashierName ?? `Cajero #${line.cashierId}`}
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-1">
          <ShoppingCart size={14} />
          {line.transactionCount} ventas
        </span>
        <span className="font-bold text-green-700">
          ${line.totalSales.toLocaleString()}
        </span>
      </div>
    </button>
  );
};
