import React, { useState } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import { ArrowUpRight, ArrowDownLeft, Wallet, Calendar, PlusCircle } from 'lucide-react';

interface FinanceProps {
  transactions: Transaction[];
  currentBalance: number;
  onAddTransaction: (t: Transaction) => void;
}

export const Finance: React.FC<FinanceProps> = ({ transactions, currentBalance, onAddTransaction }) => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    onAddTransaction({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: TransactionType.EXPENSE,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      method: 'Manual'
    });
    setNewExpense({ description: '', amount: '' });
    setShowExpenseModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
             <Wallet size={120} />
          </div>
          <p className="text-slate-400 font-medium mb-1">Saldo Actual en Caja</p>
          <h2 className="text-4xl font-bold">${currentBalance.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-sm text-green-400">
             <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
             Caja Abierta
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <p className="text-gray-500 font-medium mb-1">Ingresos Hoy</p>
           <h3 className="text-2xl font-bold text-green-600 flex items-center">
             <ArrowUpRight className="mr-2" size={24} />
             ${transactions
                .filter(t => t.type === TransactionType.INCOME)
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString()}
           </h3>
        </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
           <p className="text-gray-500 font-medium mb-1">Egresos Hoy</p>
           <h3 className="text-2xl font-bold text-red-600 flex items-center">
             <ArrowDownLeft className="mr-2" size={24} />
             ${transactions
                .filter(t => t.type === TransactionType.EXPENSE)
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString()}
           </h3>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Movimientos de Caja</h2>
        <button 
          onClick={() => setShowExpenseModal(true)}
          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={18} />
          Registrar Egreso
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Descripción</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Método</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(t.date).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{t.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded text-xs border ${
                    t.method === 'Manual' ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-100 text-blue-700'
                  }`}>
                    {t.method}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-bold text-right ${
                  t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-500'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}${t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
               <tr>
                 <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                   No hay movimientos registrados
                 </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>

      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in">
             <h3 className="text-lg font-bold mb-4 text-gray-800">Registrar Egreso de Caja</h3>
             <form onSubmit={handleAddExpense} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
                 <input 
                   type="text" 
                   required
                   placeholder="Ej: Pago a Proveedor, Limpieza..."
                   className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500"
                   value={newExpense.description}
                   onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                 <input 
                   type="number" 
                   required min="0"
                   placeholder="0.00"
                   className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-red-500"
                   value={newExpense.amount}
                   onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                 />
               </div>
               <div className="flex gap-3 pt-2">
                 <button 
                   type="button" 
                   onClick={() => setShowExpenseModal(false)}
                   className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit" 
                   className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 shadow-lg shadow-red-500/30"
                 >
                   Registrar Egreso
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};