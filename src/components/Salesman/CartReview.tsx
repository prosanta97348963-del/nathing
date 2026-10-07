import React from 'react';
import { Customer, Product, OrderItem } from '../../types';
import { ArrowLeft, Plus, Minus, Trash2, Store, CheckCircle, AlertCircle } from 'lucide-react';

interface CartReviewProps {
  customer: Customer;
  products: Product[];
  quantities: Record<string, number>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onBackToProducts: () => void;
  onOpenConfirmModal: () => void;
}

export const CartReview: React.FC<CartReviewProps> = ({
  customer,
  products,
  quantities,
  onUpdateQuantity,
  onBackToProducts,
  onOpenConfirmModal,
}) => {
  // Construct cart items
  const cartItems: OrderItem[] = products
    .filter((p) => (quantities[p.id] || 0) > 0)
    .map((p) => {
      const qty = quantities[p.id] || 0;
      return {
        productId: p.id,
        productCode: p.code,
        productName: p.name,
        price: p.price,
        quantity: qty,
        total: qty * p.price,
      };
    });

  const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);
  const totalUnits = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-28">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBackToProducts}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          title="Back to products"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Step 3: Cart Review</h2>
          <p className="text-xs text-slate-500">Verify items before submission</p>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Customer</p>
            <h3 className="text-lg font-bold text-white mt-0.5">{customer.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-slate-800 text-slate-300 font-mono font-semibold px-2 py-0.5 rounded">
                Code: {customer.code}
              </span>
              {customer.phone && (
                <span className="text-xs text-slate-400 font-mono">
                  {customer.phone}
                </span>
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Store className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Selected Products ({cartItems.length})
          </span>
          <button
            type="button"
            onClick={onBackToProducts}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            + Add More Products
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">Your cart is empty</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Please select at least one product</p>
            <button
              type="button"
              onClick={onBackToProducts}
              className="bg-blue-600 text-white text-xs font-bold py-2 px-4 rounded-xl"
            >
              Back to Product List
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cartItems.map((item) => (
              <div key={item.productId} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.productName}</h4>
                    <p className="text-xs font-mono text-slate-500">Code: {item.productCode}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-base">
                      ₹{item.total.toLocaleString('en-IN')}
                    </span>
                    <p className="text-xs text-slate-500 font-mono">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>

                {/* Inline quantity adjuster */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.productId, 0)}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>

                  <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                      className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-slate-700 shadow-2xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center text-white shadow-2xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Grand Total summary */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total Units</span>
              <span className="font-bold font-mono">{totalUnits} units</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900 text-base uppercase">TOTAL AMOUNT:</span>
              <span className="font-black text-2xl text-slate-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Submit Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl p-4 z-30">
          <div className="max-w-md mx-auto">
            <button
              type="button"
              onClick={onOpenConfirmModal}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-6 h-6" />
              <span>SUBMIT ORDER</span>
              <span className="text-base font-normal opacity-90">
                (₹{totalAmount.toLocaleString('en-IN')})
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
