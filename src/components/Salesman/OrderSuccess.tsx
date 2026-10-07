import React from 'react';
import { CheckCircle2, PlusCircle, ClipboardList, Copy, Check } from 'lucide-react';

interface OrderSuccessProps {
  orderCode: string;
  customerName: string;
  totalAmount: number;
  onNewOrder: () => void;
  onViewMyOrders: () => void;
}

export const OrderSuccess: React.FC<OrderSuccessProps> = ({
  orderCode,
  customerName,
  totalAmount,
  onNewOrder,
  onViewMyOrders,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 text-center space-y-6">
      {/* Big Success Icon */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Saved in Database
        </span>
        <h2 className="text-2xl font-black text-slate-900 mt-2">
          ORDER SUBMITTED SUCCESSFULLY
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Back office has received this order in real time.
        </p>
      </div>

      {/* Order Details Receipt Box */}
      <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500/30 shadow-md text-left space-y-3.5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-semibold uppercase">Order ID</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-sm text-slate-900">{orderCode}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="text-xs text-slate-500 font-semibold uppercase">Customer</span>
          <span className="font-bold text-sm text-slate-900">{customerName}</span>
        </div>

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-xs font-bold text-slate-700 uppercase">Total Amount</span>
          <span className="text-2xl font-black text-emerald-700">
            ₹{totalAmount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onNewOrder}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          <span>START NEW ORDER</span>
        </button>

        <button
          type="button"
          onClick={onViewMyOrders}
          className="w-full py-3.5 px-6 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-bold text-sm rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <ClipboardList className="w-4 h-4 text-slate-500" />
          <span>View My Orders</span>
        </button>
      </div>
    </div>
  );
};
