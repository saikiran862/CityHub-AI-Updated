import React from 'react';
import { Booking } from '../types';
import { Download, QrCode, Clock, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface HistoryProps {
  bookings: Booking[];
}

const History: React.FC<HistoryProps> = ({ bookings }) => {
  const downloadInvoice = (booking: Booking) => {
    const invoiceContent = `
      CITYHUB AI - INVOICE
      --------------------
      Invoice ID: ${booking.id}
      Date: ${booking.date.toLocaleDateString()} ${booking.date.toLocaleTimeString()}
      
      Service: ${booking.itemTitle}
      Type: ${booking.type}
      
      Base Amount: ₹${(booking.amount - (booking.penalty || 0)).toFixed(2)}
      ${booking.penalty ? `Overdue Penalty: ₹${booking.penalty.toFixed(2)}` : ''}
      --------------------
      TOTAL PAID: ₹${booking.amount.toFixed(2)}
      
      Status: ${booking.status}
      ${booking.isOverdue ? '(Time Limit Exceeded)' : ''}
      
      Thank you for using CityHub AI!
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${booking.id}.txt`;
    a.click();
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-800">No Booking History</h3>
        <p className="text-slate-500">Your past parking and movie bookings will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Booking History</h2>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className={`bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center ${booking.isOverdue ? 'border-rose-200 bg-rose-50/30' : 'border-slate-200'}`}>
            {/* QR Code Section */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col items-center">
              <QrCode size={64} className="text-slate-800" />
              <span className="text-[10px] text-slate-500 mt-2 font-mono">SCAN FOR ENTRY</span>
            </div>

            {/* Details Section */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    {booking.itemTitle}
                    {booking.isOverdue && (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs rounded-full border border-rose-200 font-bold flex items-center gap-1">
                        <AlertTriangle size={10} /> Overdue
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} /> {booking.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {booking.date.toLocaleTimeString()}
                    </span>
                    {booking.timeLimit && (
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                        Max {booking.timeLimit}h
                      </span>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  booking.status === 'ACTIVE' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                  booking.status === 'COMPLETED' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                  'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {booking.status}
                </div>
              </div>

              <div className="flex flex-col mt-4">
                 <div className="flex items-end gap-2">
                   <span className="text-2xl font-bold text-slate-900">₹{booking.amount}</span>
                   <span className="text-xs text-slate-500 mb-1">Total Paid via UPI</span>
                 </div>
                 {booking.penalty > 0 && (
                   <div className="text-xs text-rose-600 font-medium">
                     Includes ₹{booking.penalty} overdue penalty
                   </div>
                 )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
               <button 
                 onClick={() => downloadInvoice(booking)}
                 className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
               >
                 <Download size={16} /> Invoice
               </button>
               {booking.status === 'ACTIVE' && (
                 <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                   <CheckCircle size={16} /> Navigate
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;