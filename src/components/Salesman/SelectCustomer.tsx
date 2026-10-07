import React, { useState, useMemo } from 'react';
import { Customer } from '../../types';
import { Search, Phone, MapPin, ArrowLeft, Store, X } from 'lucide-react';

interface SelectCustomerProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onBack: () => void;
}

export const SelectCustomer: React.FC<SelectCustomerProps> = ({
  customers,
  onSelectCustomer,
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fast search by name, code, or phone
  const filteredCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return customers.filter((c) => c.active !== false);

    return customers.filter((c) => {
      const matchName = c.name.toLowerCase().includes(term);
      const matchCode = c.code.toLowerCase().includes(term);
      const matchPhone = c.phone ? c.phone.toLowerCase().includes(term) : false;
      return (matchName || matchCode || matchPhone) && c.active !== false;
    });
  }, [customers, searchTerm]);

  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Step 1: Select Customer</h2>
          <p className="text-xs text-slate-500">Tap customer to start order</p>
        </div>
      </div>

      {/* Fast Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, code, or phone..."
          autoFocus
          className="w-full pl-10 pr-9 py-3 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Customer Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {filteredCustomers.length} customers</span>
        {searchTerm && <span>Filtered by "{searchTerm}"</span>}
      </div>

      {/* Customers List */}
      <div className="space-y-2.5 pb-8">
        {filteredCustomers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <Store className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-semibold text-sm">No customers found</p>
            <p className="text-slate-400 text-xs mt-1">Try a different name, code, or phone number</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => (
            <div
              key={cust.id}
              onClick={() => onSelectCustomer(cust)}
              className="w-full bg-white hover:bg-blue-50/50 active:bg-blue-100/70 text-left p-4 rounded-xl border border-slate-200 hover:border-blue-400 shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-base leading-tight truncate">
                    {cust.name}
                  </h3>
                  <span className="shrink-0 bg-slate-100 text-slate-700 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                    {cust.code}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  {cust.phone && (
                    <span className="flex items-center gap-1 font-mono text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {cust.phone}
                    </span>
                  )}
                  {cust.address && (
                    <span className="flex items-center gap-1 truncate text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{cust.address}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 text-blue-600 font-bold text-xs bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                Select →
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
