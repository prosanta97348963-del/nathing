import React, { useState, useMemo } from 'react';
import { Customer, Product, OrderItem } from '../../types';
import { Search, ArrowLeft, ShoppingCart, Plus, Minus, X, Store } from 'lucide-react';

interface ProductCatalogProps {
  customer: Customer;
  products: Product[];
  quantities: Record<string, number>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProceedToCart: () => void;
  onChangeCustomer: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  customer,
  products,
  quantities,
  onUpdateQuantity,
  onProceedToCart,
  onChangeCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Fast filter by product name or code
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return products.filter((p) => p.active !== false);

    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(term);
      const matchCode = p.code.toLowerCase().includes(term);
      return (matchName || matchCode) && p.active !== false;
    });
  }, [products, searchTerm]);

  // Compute active order totals
  const totalItemsCount = Object.values(quantities).filter((q) => q > 0).length;
  const totalUnits = Object.values(quantities).reduce((acc, q) => acc + q, 0);
  const totalAmount = useMemo(() => {
    return products.reduce((acc, prod) => {
      const qty = quantities[prod.id] || 0;
      return acc + qty * prod.price;
    }, 0);
  }, [products, quantities]);

  const handleManualInput = (productId: string, rawVal: string) => {
    const cleaned = rawVal.replace(/[^0-9]/g, '');
    const num = parseInt(cleaned, 10);
    if (isNaN(num) || num <= 0) {
      onUpdateQuantity(productId, 0);
    } else {
      onUpdateQuantity(productId, Math.min(num, 9999));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 space-y-3 pb-28">
      {/* Customer Header Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500/30 text-blue-300 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Customer</p>
            <p className="font-bold text-sm text-white truncate">{customer.name}</p>
            <p className="text-[11px] text-slate-300 font-mono">Code: {customer.code}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onChangeCustomer}
          className="text-xs text-blue-300 hover:text-white font-semibold underline shrink-0 px-2 py-1"
        >
          Change
        </button>
      </div>

      {/* Title & Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Step 2: Select Products & Qty</h2>
          <span className="text-xs text-slate-500 font-medium">{filteredProducts.length} items</span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product name or code (e.g. P001)..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Product List */}
      <div className="space-y-2.5">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-slate-200">
            <p className="text-slate-700 font-medium text-sm">No products found</p>
            <p className="text-slate-400 text-xs mt-1">Try another search term</p>
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const qty = quantities[prod.id] || 0;
            const isSelected = qty > 0;
            const lineTotal = qty * prod.price;

            return (
              <div
                key={prod.id}
                className={`bg-white rounded-xl p-3.5 border transition-all shadow-xs ${
                  isSelected
                    ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-2.5">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{prod.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                        Code: {prod.code}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 text-base">
                      ₹{prod.price}
                    </span>
                    <span className="block text-[10px] text-slate-400">per unit</span>
                  </div>
                </div>

                {/* Quantity Controls: [-] QTY [+] */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="text-xs">
                    {isSelected ? (
                      <span className="font-bold text-blue-700">
                        Total: ₹{lineTotal.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Enter quantity</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    {/* Decrease Button */}
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(prod.id, Math.max(0, qty - 1))}
                      disabled={qty === 0}
                      className="w-10 h-10 rounded-lg bg-white active:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg shadow-xs disabled:opacity-40 disabled:active:bg-white cursor-pointer select-none"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    {/* Manual Input / Display */}
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={qty === 0 ? '' : qty}
                      placeholder="0"
                      onChange={(e) => handleManualInput(prod.id, e.target.value)}
                      className="w-14 h-10 text-center font-bold text-base text-slate-900 bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />

                    {/* Increase Button */}
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(prod.id, qty + 1)}
                      className="w-10 h-10 rounded-lg bg-blue-600 active:bg-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-xs cursor-pointer select-none"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl p-3 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
              <span>{totalItemsCount} items ({totalUnits} units)</span>
            </div>
            <div className="text-xl font-black text-slate-900 leading-tight">
              ₹{totalAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={onProceedToCart}
            disabled={totalItemsCount === 0}
            className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>REVIEW CART</span>
            <span className="text-xs bg-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
