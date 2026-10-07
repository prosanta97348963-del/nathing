import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserCheck, Shield, ShoppingBag, ArrowRight } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { signInWithGoogle, signInAsDemoSalesman } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      console.error(err);
      setError('Google Sign-In was cancelled or not supported in this window. Try Field Salesman sign-in below.');
    } finally {
      setLoading(false);
    }
  };

  const handleSalesmanQuickLogin = async (name: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInAsDemoSalesman(name);
    } catch (err: unknown) {
      console.error(err);
      setError('Unable to log in as salesman. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Brand Banner */}
        <div className="bg-blue-600 px-6 py-8 text-white text-center">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">A.R. Enterprise</h1>
          <p className="text-blue-100 text-sm mt-1">Distributor Sales Order Collection</p>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Primary Google Login */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-4 rounded-xl border-2 border-slate-300 shadow-xs transition-colors active:scale-[0.99] cursor-pointer disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
            </button>
            <p className="text-center text-xs text-slate-500 mt-2">
              (Owner/Admin email: prosanta97348963@gmail.com has full admin rights)
            </p>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              Or Field Salesman Fast Access
            </span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Quick Salesman Login */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              Direct Salesman Login for Field Orders:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSalesmanQuickLogin('Rahul (Salesman 1)')}
                disabled={loading}
                className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-sm">Rahul</div>
                <div className="text-[11px] text-blue-700">Area: North Market</div>
              </button>
              <button
                type="button"
                onClick={() => handleSalesmanQuickLogin('Amit (Salesman 2)')}
                disabled={loading}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl font-medium text-xs text-left transition-colors cursor-pointer"
              >
                <div className="font-bold text-sm">Amit</div>
                <div className="text-[11px] text-emerald-700">Area: South Market</div>
              </button>
            </div>

            {showCustomInput ? (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Enter salesman full name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={!customName.trim() || loading}
                    onClick={() => handleSalesmanQuickLogin(customName.trim())}
                    className="flex-1 bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Enter as {customName.trim() || 'Salesman'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium py-1"
              >
                + Enter Custom Salesman Name
              </button>
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Distributor Digital Order Dispatcher
          </p>
        </div>
      </div>
    </div>
  );
};
