import React, { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface PaymentProps {
  amount: number;
  title?: string;
  details?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const Payment: React.FC<PaymentProps> = ({ amount, title = "Secure Payment", details, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'scan' | 'processing' | 'success'>('scan');

  // Simulate payment process
  const simulatePayment = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(onSuccess, 2000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
          {details && (
            <div className="mb-4 inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-100">
              {details}
            </div>
          )}
          <p className="text-slate-500 text-sm mb-6">Scan QR Code with any UPI App</p>

          <div className="relative w-48 h-48 mx-auto bg-slate-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden border-2 border-slate-200 border-dashed">
            {status === 'success' ? (
              <div className="bg-emerald-50 w-full h-full flex flex-col items-center justify-center text-emerald-600">
                <CheckCircle size={48} className="mb-2 animate-bounce" />
                <span className="font-bold">Paid Successfully</span>
              </div>
            ) : (
              // Simple CSS QR Code simulation
              <div className="w-full h-full p-4 grid grid-cols-6 grid-rows-6 gap-1" onClick={simulatePayment}>
                 <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                 <div className="col-span-1 row-span-1 bg-slate-900 rounded-sm"></div>
                 <div className="col-span-2 row-span-2 col-start-5 bg-slate-900 rounded-sm"></div>
                 <div className="col-span-2 row-span-2 row-start-5 bg-slate-900 rounded-sm"></div>
                 <div className="col-start-3 row-start-3 col-span-2 row-span-2 bg-indigo-600 rounded-sm opacity-50"></div>
                 <div className="col-start-4 row-start-1 bg-slate-900"></div>
                 <div className="col-start-1 row-start-4 bg-slate-900"></div>
                 <div className="col-start-6 row-start-4 bg-slate-900"></div>
              </div>
            )}
            
            {status === 'processing' && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            )}
          </div>

          <div className="text-2xl font-bold text-slate-800 mb-6">
            ₹{amount.toFixed(2)}
          </div>

          {status === 'scan' && (
             <div className="space-y-3">
               <button 
                onClick={simulatePayment}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
               >
                 Simulate Scan & Pay
               </button>
               <button 
                onClick={onCancel}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
               >
                 Cancel
               </button>
             </div>
          )}
        </div>
        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
          Encrypted • UPI • Safe
        </div>
      </div>
    </div>
  );
};

export default Payment;