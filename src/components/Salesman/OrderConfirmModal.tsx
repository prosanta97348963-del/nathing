import React from 'react';
import { Customer } from '../../types';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface OrderConfirmModalProps {
  isOpen: boolean;
  customer: Customer;
  totalAmount: number;
  totalItems: number;
  submitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OrderConfirmModal: React.FC<OrderConfirmModalProps> = ({
  isOpen,
  customer,
  totalAmount,
  totalItems,
  submitting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95">
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Submit this order?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to submit this order?
            </p>
          </div>

          {/* Quick Recap Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Customer</span>
              <p className="font-bold text-slate-900 text-sm leading-tight">{customer.name}</p>
              <p className="text-xs font-mono text-slate-500">Code: {customer.code}</p>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Items</span>
                <p className="font-semibold text-slate-700 text-xs">{totalItems} distinct products</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                <p className="font-black text-slate-900 text-lg">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onConfirm}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>SUBMIT ORDER</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={onCancel}
              className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
