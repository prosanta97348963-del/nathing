import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShoppingBag, ShieldCheck, User, Smartphone, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { userProfile, isAdmin, activeRole, setActiveRole, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xs">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight text-base sm:text-lg">A.R. Enterprise</h1>
            <p className="text-[10px] text-slate-500 font-medium">Distributor Order Portal</p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* If user is Admin, allow switching between Salesman Order Collection & Admin Dashboard */}
          {isAdmin && (
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveRole('salesman')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeRole === 'salesman'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Salesman Order Screen"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salesman</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('admin')}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeRole === 'admin'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Admin Back Office"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          )}

          {/* User profile tag */}
          <div className="flex items-center gap-1.5 pl-1 text-xs font-medium text-slate-700">
            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold">
              {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="hidden md:inline font-semibold max-w-[120px] truncate">
              {userProfile?.name}
            </span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
