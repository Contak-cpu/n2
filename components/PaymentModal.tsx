import React, { useState, useEffect } from 'react';
import { X, Banknote, QrCode, CreditCard, Smartphone, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onConfirm: (method: PaymentMethod) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ total, onClose, onConfirm }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [cashGiven, setCashGiven] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const change = Math.max(0, (parseFloat(cashGiven) || 0) - total);
  const canConfirmCash = parseFloat(cashGiven) >= total;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onConfirm(selectedMethod!);
      }, 1000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center animate-bounce-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
          <p className="text-gray-500">Registrando venta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Seleccionar método de pago</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-1">Total a cobrar</p>
            <p className="text-5xl font-bold text-gray-900">${total.toLocaleString()}</p>
          </div>

          {!selectedMethod ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: PaymentMethod.CASH, icon: Banknote, label: 'Efectivo', color: 'bg-green-50 text-green-700 border-green-200' },
                { id: PaymentMethod.MERCADOPAGO, icon: QrCode, label: 'MercadoPago', color: 'bg-blue-50 text-blue-500 border-blue-200' },
                { id: PaymentMethod.MODO, icon: Smartphone, label: 'MODO', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                { id: PaymentMethod.CARD, icon: CreditCard, label: 'Débito / Crédito', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all hover:scale-105 ${m.color} hover:shadow-lg`}
                >
                  <m.icon size={40} className="mb-3" />
                  <span className="font-bold text-lg">{m.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-fade-in">
               <button 
                onClick={() => setSelectedMethod(null)}
                className="mb-6 text-sm text-blue-600 hover:underline flex items-center gap-1"
               >
                 ← Cambiar método
               </button>

               {selectedMethod === PaymentMethod.CASH && (
                 <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Monto Recibido</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">$</span>
                        <input 
                          type="number" 
                          value={cashGiven}
                          onChange={(e) => setCashGiven(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-xl border-2 border-gray-300 focus:border-green-500 focus:ring-0 outline-none"
                          placeholder="0"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-100 p-4 rounded-xl flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-lg">Vuelto:</span>
                      <span className={`text-2xl font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                        ${change.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={handleSimulatePayment}
                      disabled={!canConfirmCash || isProcessing}
                      className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
                        !canConfirmCash 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-green-500/30'
                      }`}
                    >
                      {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                    </button>
                 </div>
               )}

               {(selectedMethod === PaymentMethod.MERCADOPAGO || selectedMethod === PaymentMethod.MODO) && (
                 <div className="text-center space-y-6">
                   <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block shadow-inner">
                     {/* QR Placeholder using a div pattern */}
                     <div className="w-48 h-48 bg-gray-900 mx-auto relative flex items-center justify-center overflow-hidden rounded-lg">
                        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(white 2px, transparent 2px)', backgroundSize: '10px 10px'}}></div>
                        <QrCode className="text-white w-24 h-24 relative z-10" />
                        <div className="absolute inset-0 border-4 border-white/30 rounded-lg"></div>
                     </div>
                   </div>
                   <p className="text-gray-600">Escanea el código QR con la app de {selectedMethod}</p>
                   
                   <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Esperando confirmación...
                        </>
                      ) : (
                        'Simular confirmación externa'
                      )}
                    </button>
                 </div>
               )}

               {selectedMethod === PaymentMethod.CARD && (
                 <div className="text-center space-y-8 py-8">
                   <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                     <CreditCard className="text-orange-600 w-12 h-12" />
                   </div>
                   <p className="text-xl font-medium text-gray-700">Acerque la tarjeta al lector...</p>
                   <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-gray-800 transition-all"
                    >
                      {isProcessing ? 'Procesando...' : 'Simular Lectura de Tarjeta'}
                    </button>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};