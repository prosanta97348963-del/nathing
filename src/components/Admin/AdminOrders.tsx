import React, { useState, useMemo } from 'react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus } from '../../services/db';
import {
  Search,
  Clock,
  User,
  Store,
  ChevronRight,
  Filter,
  FileText,
  X,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  Check,
  RefreshCw,
} from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState<string | null>(null);

  // Search by Order ID, Customer, Salesman
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const term = searchTerm.toLowerCase().trim();
      const matchSearch =
        !term ||
        o.orderCode.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerCode.toLowerCase().includes(term) ||
        o.salesmanName.toLowerCase().includes(term);

      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      setStatusSuccessMsg(null);
      await updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      setStatusSuccessMsg(`Status updated to ${newStatus}`);
      setTimeout(() => setStatusSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
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

  // Quick stats
  const totalBookings = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;

  return (
    <div className="space-y-4">
      {/* Quick Stat Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 font-semibold uppercase block">Total Orders</span>
          <span className="text-xl font-black text-slate-900">{orders.length}</span>
        </div>
        <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 shadow-2xs">
          <span className="text-[11px] text-blue-700 font-semibold uppercase block">NEW Orders</span>
          <span className="text-xl font-black text-blue-900">{newOrdersCount}</span>
        </div>
        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] text-emerald-700 font-semibold uppercase block">Total Booking</span>
          <span className="text-xl font-black text-emerald-900 truncate block">
            ₹{totalBookings.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2.5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer, or salesman..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['ALL', 'NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-2.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">No orders found</p>
            <p className="text-xs text-slate-400 mt-1">
              {orders.length === 0
                ? 'Salesmen orders will appear here automatically when submitted.'
                : 'Try adjusting your search or status filter.'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 shadow-2xs transition-all"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="font-mono text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-200 transition-colors cursor-pointer"
                    >
                      {order.orderCode}
                    </button>

                    {/* Fast Status Dropdown */}
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-hidden ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-1.5 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({order.customerCode})</span>
                  </h4>

                  <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Salesman: <strong className="text-slate-800">{order.salesmanName}</strong></span>
                  </p>
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
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {order.dateStr || ''} {order.timeStr ? `• ${order.timeStr}` : ''}
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-0.5 cursor-pointer"
                >
                  Full Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Admin Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Back Office Order Details</p>
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

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Direct Status Update Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-blue-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Order Status:
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  {updatingId === selectedOrder.id && (
                    <span className="text-xs text-blue-600 font-semibold flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </span>
                  )}
                </div>

                {statusSuccessMsg && (
                  <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{statusSuccessMsg}</span>
                  </div>
                )}

                {/* Direct 1-Tap Status Selector Buttons */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                    Click to Change Status (Saved Instantly):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((st) => {
                      const isCurrent = selectedOrder.status === st;
                      const isBusy = updatingId === selectedOrder.id;

                      let activeClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                      if (isCurrent) {
                        if (st === 'NEW') activeClass = 'bg-blue-600 text-white border-blue-700 shadow-xs ring-2 ring-blue-300';
                        else if (st === 'PROCESSING') activeClass = 'bg-amber-500 text-white border-amber-600 shadow-xs ring-2 ring-amber-300';
                        else if (st === 'COMPLETED') activeClass = 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-300';
                        else if (st === 'CANCELLED') activeClass = 'bg-red-600 text-white border-red-700 shadow-xs ring-2 ring-red-300';
                      }

                      return (
                        <button
                          key={st}
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(selectedOrder.id, st)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 ${activeClass}`}
                        >
                          {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                          <span>{st}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-200 text-xs text-slate-500">
                  <span>Timestamp:</span>
                  <span className="font-mono text-slate-700 font-semibold">
                    {selectedOrder.dateStr} {selectedOrder.timeStr}
                  </span>
                </div>
              </div>

              {/* Salesman & Customer Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Salesman</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.salesmanName}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Customer</span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedOrder.customerName}</p>
                  <p className="text-[11px] font-mono text-slate-500">Code: {selectedOrder.customerCode}</p>
                  {selectedOrder.customerPhone && (
                    <p className="text-[11px] font-mono text-slate-500">Ph: {selectedOrder.customerPhone}</p>
                  )}
                </div>
              </div>

              {/* Product Breakdown Table */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Products Breakdown ({selectedOrder.items?.length || 0})
                </span>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                  <div className="bg-slate-100 px-3 py-2 text-[11px] font-bold text-slate-600 grid grid-cols-12">
                    <span className="col-span-6">Product / Code</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Unit Price</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 bg-white text-xs grid grid-cols-12 items-center">
                      <div className="col-span-6">
                        <span className="font-bold text-slate-900 block leading-tight">{item.productName}</span>
                        <span className="font-mono text-[10px] text-slate-500">Code: {item.productCode}</span>
                      </div>
                      <span className="col-span-2 text-center font-bold font-mono text-slate-800">
                        {item.quantity}
                      </span>
                      <span className="col-span-2 text-right font-mono text-slate-600">
                        ₹{item.price}
                      </span>
                      <span className="col-span-2 text-right font-bold text-slate-900 font-mono">
                        ₹{item.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-baseline">
                <span className="font-bold text-emerald-900 text-sm uppercase">GRAND TOTAL:</span>
                <span className="font-black text-2xl text-emerald-900">
                  ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Sticky Footer with Direct Status Bar & Close */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Status:</span>
                <div className="flex items-center gap-1">
                  {(['NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingId === selectedOrder.id}
                      onClick={() => handleStatusChange(selectedOrder.id, st)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-md transition-colors cursor-pointer ${
                        selectedOrder.status === st
                          ? 'bg-slate-900 text-white'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="py-1.5 px-4 bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-xs rounded-xl cursor-pointer"
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
