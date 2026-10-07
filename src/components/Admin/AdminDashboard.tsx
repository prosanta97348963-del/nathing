import React, { useState } from 'react';
import { Customer, Product, Order, UserProfile } from '../../types';
import { AdminOrders } from './AdminOrders';
import { AdminProducts } from './AdminProducts';
import { AdminCustomers } from './AdminCustomers';
import { AdminSalesmen } from './AdminSalesmen';
import { FileText, Package, Store, Users, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  salesmen: UserProfile[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  customers,
  salesmen,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers' | 'salesmen'>('orders');

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 pb-20">
      {/* Admin Title Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Admin Back Office</h2>
          <p className="text-xs text-slate-500">Live order receiving and master management</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Orders</span>
          <span className="text-[10px] bg-blue-100 text-blue-800 font-mono font-bold px-1.5 py-0.2 rounded-full">
            {orders.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('customers')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'customers'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Customers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('salesmen')}
          className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'salesmen'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Salesmen</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'orders' && <AdminOrders orders={orders} />}
      {activeTab === 'products' && <AdminProducts products={products} />}
      {activeTab === 'customers' && <AdminCustomers customers={customers} />}
      {activeTab === 'salesmen' && <AdminSalesmen salesmen={salesmen} orders={orders} />}
    </div>
  );
};
