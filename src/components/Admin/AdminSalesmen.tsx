import React, { useState } from 'react';
import { UserProfile, Order } from '../../types';
import { saveUserProfile } from '../../services/db';
import { Plus, User, Mail, Shield, CheckCircle, X, AlertCircle } from 'lucide-react';

interface AdminSalesmenProps {
  salesmen: UserProfile[];
  orders: Order[];
}

export const AdminSalesmen: React.FC<AdminSalesmenProps> = ({ salesmen, orders }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSalesman = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter salesman name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      // Create user entry
      const cleanEmail = email.trim().toLowerCase();
      const generatedUid = `salesman_${Date.now()}`;
      await saveUserProfile({
        uid: generatedUid,
        name: name.trim(),
        email: cleanEmail,
        role: 'salesman',
        status: 'active',
        createdAt: new Date().toISOString(),
      });
      setShowAddModal(false);
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      setError('Failed to add salesman');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user: UserProfile) => {
    try {
      const nextStatus = user.status === 'active' ? 'inactive' : 'active';
      await saveUserProfile({
        ...user,
        status: nextStatus,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to update salesman status');
    }
  };

  // Group orders count by salesman
  const getSalesmanOrderStats = (user: UserProfile) => {
    const userOrders = orders.filter(
      (o) => o.salesmanUid === user.uid || o.salesmanName === user.name
    );
    const totalSales = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { count: userOrders.length, total: totalSales };
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">Registered Salesmen</h3>
          <p className="text-xs text-slate-500">Field staff collecting digital orders</p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddModal(true);
            setError(null);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Salesman</span>
        </button>
      </div>

      {/* Salesmen list */}
      <div className="space-y-2.5">
        {salesmen.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">No registered salesmen found</p>
            <p className="text-xs text-slate-400 mt-1">
              Tap "+ Add Salesman" or salesmen will automatically appear when they sign in.
            </p>
          </div>
        ) : (
          salesmen.map((s) => {
            const stats = getSalesmanOrderStats(s);
            const isActive = s.status !== 'inactive';

            return (
              <div
                key={s.uid}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                    {s.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                      {s.role === 'admin' && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.email}</p>

                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-semibold text-slate-700">
                        Orders: <strong className="text-blue-700">{stats.count}</strong>
                      </span>
                      <span className="font-semibold text-slate-700">
                        Total: <strong className="text-emerald-700">₹{stats.total.toLocaleString('en-IN')}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {s.role !== 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(s)}
                    className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isActive
                        ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                        : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Salesman Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">Add New Salesman</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSalesman} className="p-4 space-y-3.5">
              {error && (
                <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-1.5 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Salesman Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Salesman Email / Login *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@distributor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Orders submitted by this account will automatically record this salesman.
                </p>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Salesman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
