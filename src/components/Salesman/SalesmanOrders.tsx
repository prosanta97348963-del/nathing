import React, { useState } from 'react';
import { Order } from '../../types';
import { ArrowLeft, Clock, Store, ChevronRight, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface SalesmanOrdersProps {
  orders: Order[];
  onBackToHome: () => void;
  onStartNewOrder: () => void;
}

export const SalesmanOrders: React.FC<SalesmanOrdersProps> = ({
  orders,
  onBackToHome,
  onStartNewOrder,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Submitted Orders</h2>
            <p className="text-xs text-slate-500">{orders.length} orders recorded</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartNewOrder}
          className="text-xs bg-emerald-600 text-white font-bold py-2 px-3 rounded-xl hover:bg-emerald-700 shadow-xs"
        >
          + New Order
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 shadow-xs">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No orders yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              You haven't submitted any orders yet. Tap below to create your first order.
            </p>
            <button
              type="button"
              onClick={onStartNewOrder}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md"
            >
              Take First Order
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-blue-400 shadow-xs transition-all cursor-pointer active:bg-slate-50"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {order.orderCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerName}</span>
                  </h4>
                </div>

                <div className="text-right">
                  <span className="font-black text-slate-900 text-base">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[11px] text-slate-400">
                    {order.items?.length || 0} products
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {order.dateStr || ''} {order.timeStr ? `• ${order.timeStr}` : ''}
                </span>
                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                  View Details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal for Salesman */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Order Details</p>
                <h3 className="font-mono font-bold text-base text-white">{selectedOrder.orderCode}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Status and Timestamp */}
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span
                    className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mt-0.5 ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Submitted</span>
                  <span className="text-xs font-mono text-slate-700">
                    {selectedOrder.dateStr} {selectedOrder.timeStr}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</p>
                <div className="flex gap-3 text-xs text-slate-500 font-mono mt-0.5">
                  <span>Code: {selectedOrder.customerCode}</span>
                  {selectedOrder.customerPhone && <span>Ph: {selectedOrder.customerPhone}</span>}
                </div>
              </div>

              {/* Line Items */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Products ({selectedOrder.items?.length || 0})
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{item.productName}</span>
                        <span>₹{item.total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                        <span>Code: {item.productCode}</span>
                        <span>₹{item.price} × {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-baseline">
                <span className="font-bold text-emerald-900 text-sm uppercase">GRAND TOTAL:</span>
                <span className="font-black text-xl text-emerald-900">
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                Submitted order is locked and recorded in database.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 font-semibold text-slate-800 text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
