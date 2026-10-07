import React, { useState, useMemo } from 'react';
import { Customer } from '../../types';
import { addCustomer, updateCustomer, deleteCustomer } from '../../services/db';
import { Plus, Search, Edit2, Trash2, X, Store, Phone, MapPin, AlertCircle } from 'lucide-react';

interface AdminCustomersProps {
  customers: Customer[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ customers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT' | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.code.toLowerCase().includes(term) ||
        (c.phone && c.phone.includes(term))
    );
  }, [customers, searchTerm]);

  const openAddModal = () => {
    setName('');
    setCode('');
    setPhone('');
    setAddress('');
    setActive(true);
    setFormError(null);
    setEditingCustomer(null);
    setModalMode('ADD');
  };

  const openEditModal = (c: Customer) => {
    setName(c.name);
    setCode(c.code);
    setPhone(c.phone || '');
    setAddress(c.address || '');
    setActive(c.active !== false);
    setFormError(null);
    setEditingCustomer(c);
    setModalMode('EDIT');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Please enter customer name');
      return;
    }
    if (!code.trim()) {
      setFormError('Please enter unique customer code');
      return;
    }

    try {
      setSaving(true);
      setFormError(null);

      if (modalMode === 'ADD') {
        await addCustomer({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          phone: phone.trim(),
          address: address.trim(),
          active,
        });
      } else if (modalMode === 'EDIT' && editingCustomer) {
        await updateCustomer(editingCustomer.id, {
          name: name.trim(),
          code: code.trim().toUpperCase(),
          phone: phone.trim(),
          address: address.trim(),
          active,
        });
      }
      setModalMode(null);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save customer in database.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Customer) => {
    if (confirm(`Are you sure you want to delete customer "${c.name}"?`)) {
      try {
        await deleteCustomer(c.id);
      } catch (err) {
        console.error(err);
        alert('Failed to delete customer.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Top action strip */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers by name, code, phone..."
            className="w-full pl-10 pr-9 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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

        <button
          type="button"
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Customer list */}
      <div className="space-y-2">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-sm">No customers found</p>
            <p className="text-xs text-slate-400 mt-1">Tap "+ Add Customer" to register your first retail shop.</p>
          </div>
        ) : (
          filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    {c.code}
                  </span>
                  {!c.active && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-xs text-slate-500">
                  {c.phone && (
                    <span className="flex items-center gap-1 font-mono text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {c.phone}
                    </span>
                  )}
                  {c.address && (
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <MapPin className="w-3 h-3" />
                      {c.address}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditModal(c)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit customer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Customer Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold text-base">
                {modalMode === 'ADD' ? 'Add New Customer' : 'Edit Customer'}
              </h3>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3.5">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-lg flex items-center gap-1.5 border border-red-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Store"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. C001"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono uppercase border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address / Area (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Main Market, Shop #12"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="custActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="custActive" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Active (salesmen can select this customer)
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
