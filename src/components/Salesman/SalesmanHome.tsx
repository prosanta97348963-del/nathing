import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, ClipboardList, TrendingUp, Calendar, User, ArrowRight } from 'lucide-react';
import { Order } from '../../types';

interface SalesmanHomeProps {
  onStartNewOrder: () => void;
  onViewMyOrders: () => void;
  orders: Order[];
}

export const SalesmanHome: React.FC<SalesmanHomeProps> = ({
  onStartNewOrder,
  onViewMyOrders,
  orders,
}) => {
  const { userProfile } = useAuth();

  // Calculate today's stats for this salesman
  const todayStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const todayOrders = orders.filter((o) => o.dateStr === todayStr);
  const todayTotalAmount = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Salesman Welcome Card */}
      <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl border border-white/30">
            {userProfile?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <p className="text-xs text-blue-200 uppercase font-semibold tracking-wider">Field Salesman</p>
            <h2 className="text-xl font-bold">{userProfile?.name || 'Salesman'}</h2>
          </div>
        </div>

        {/* Today's Quick Summary */}
        <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-blue-200 block">Today's Orders</span>
            <span className="text-2xl font-black">{todayOrders.length}</span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <span className="text-[11px] text-blue-200 block">Today's Booking</span>
            <span className="text-2xl font-black">₹{todayTotalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Main Action: NEW ORDER (Huge, prominent button) */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={onStartNewOrder}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-lg py-5 px-6 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-xl tracking-wide uppercase">NEW ORDER</span>
              <span className="block text-xs font-normal text-emerald-100">Select Customer & Products</span>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-emerald-200" />
        </button>

        {/* Secondary Action: MY ORDERS */}
        <button
          type="button"
          onClick={onViewMyOrders}
          className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-bold text-base py-4 px-6 rounded-2xl border-2 border-slate-200 shadow-xs flex items-center justify-between transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-slate-900">My Orders</span>
              <span className="block text-xs font-normal text-slate-500">
                {orders.length} orders submitted
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 font-bold text-slate-700 px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      {orders.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-800">Latest Submission</h3>
            <button
              onClick={onViewMyOrders}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          {orders.slice(0, 1).map((ord) => (
            <div key={ord.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{ord.customerName}</span>
                  <p className="text-xs text-slate-500 font-mono">{ord.orderCode}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700 text-sm">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`block text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                      ord.status === 'NEW'
                        ? 'bg-blue-100 text-blue-800'
                        : ord.status === 'PROCESSING'
                        ? 'bg-amber-100 text-amber-800'
                        : ord.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
