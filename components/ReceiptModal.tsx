import React, { useEffect } from 'react';
import { X, Printer } from 'lucide-react';
import { Transaction, CartItem } from '../types';

interface ReceiptModalProps {
  transaction: Transaction;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Screen View */}
      <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh] pb-[env(safe-area-inset-bottom)]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Comprobante</h2>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Imprimir">
                <Printer size={20} />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full">
                <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-white overflow-y-auto">
            <div id="receipt-preview" className="font-mono text-sm leading-relaxed border border-gray-200 p-4 rounded bg-gray-50 shadow-inner">
                {/* This structure mirrors the print layout */}
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold uppercase">Nueva Era</h1>
                    <p className="text-xs font-bold uppercase text-gray-500">Supermercado</p>
                    <div className="my-2 h-px bg-gray-300 w-1/2 mx-auto"></div>
                    <p>Av. Corrientes 1234</p>
                    <p>IVA Responsable Inscripto</p>
                    <p>CUIT: 30-12345678-9</p>
                </div>
                
                <div className="mb-4 border-b border-dashed border-gray-400 pb-2">
                    <p>Fecha: {new Date(transaction.date).toLocaleString()}</p>
                    <p>Ticket #: {transaction.id.slice(-6)}</p>
                    <p>Cajero: {transaction.cashierName || 'Generico'}</p>
                    <p>Cliente: {transaction.clientName || 'Consumidor Final'}</p>
                </div>

                <div className="mb-4">
                    {transaction.items && transaction.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between mb-1">
                            <span>{item.quantity} x {item.name.substring(0, 15)}</span>
                            <span>${(item.appliedPrice * item.quantity).toLocaleString()}</span>
                        </div>
                    ))}
                    {!transaction.items && <p className="text-center italic text-gray-500">Detalle no disponible</p>}
                </div>

                <div className="border-t border-dashed border-gray-400 pt-2 font-bold text-lg flex justify-between">
                    <span>TOTAL</span>
                    <span>${transaction.amount.toLocaleString()}</span>
                </div>
                
                <div className="mt-2 text-xs text-center">
                    <p>Forma de Pago: {transaction.method}</p>
                </div>

                <div className="mt-6 text-center text-xs">
                    <p>¡Gracias por su compra!</p>
                    <p>www.nuevaera.com.ar</p>
                </div>
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 w-full flex justify-center items-center gap-2">
                <Printer size={18} />
                IMPRIMIR TICKET
            </button>
        </div>
      </div>

      {/* Hidden Print Section (Only visible when printing) */}
      <div className="print-only hidden">
         <div className="font-mono text-xs leading-tight">
            <div className="text-center mb-2">
                <h1 className="text-base font-bold uppercase">Supermercado Nueva Era</h1>
                <p>Av. Corrientes 1234</p>
                <p>CUIT: 30-12345678-9</p>
            </div>
            
            <div className="mb-2 border-b border-black pb-1">
                <p>{new Date(transaction.date).toLocaleString()}</p>
                <p>Ticket: {transaction.id.slice(-6)}</p>
                <p>Cajero: {transaction.cashierName}</p>
            </div>

            <div className="mb-2">
                {transaction.items && transaction.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                        <span>{item.quantity} {item.name.substring(0, 15)}</span>
                        <span>${(item.appliedPrice * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
            </div>

            <div className="border-t border-black pt-1 font-bold text-sm flex justify-between">
                <span>TOTAL</span>
                <span>${transaction.amount.toLocaleString()}</span>
            </div>
             <p className="mt-1">Pago: {transaction.method}</p>

            <div className="mt-4 text-center">
                <p>¡Gracias por su compra!</p>
                <p>www.nuevaera.com.ar</p>
            </div>
        </div>
      </div>
    </div>
  );
};