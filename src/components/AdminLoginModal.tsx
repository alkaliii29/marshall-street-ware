import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldAlert, KeyRound, Eye, EyeOff, X, ArrowRight, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess }) => {
  const { isLoginModalOpen, setIsLoginModalOpen, loginAdmin } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const res = loginAdmin(username, password);
    if (res.success) {
      showToast('Admin studio verified', 'success', 'Welcome back, Owner.');
      setUsername('');
      setPassword('');
      onLoginSuccess();
    } else {
      setErrorMessage(res.error || 'Authentication denied');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('streetwear2026');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsLoginModalOpen(false)}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 text-zinc-100 z-10 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1"
          aria-label="Close login dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon & Title */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
            <KeyRound className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white">
              Studio Access Gate
            </h2>
            <span className="text-[10px] font-mono uppercase bg-zinc-900 px-1.5 py-0.5 border border-zinc-800 text-zinc-400">
              OWNER PORTAL
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Authorized store operators only. Manage inventory, drops, and orders.
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="mb-6 p-3 bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
          <div className="font-mono text-[11px] text-zinc-400">
            <span className="text-zinc-300 font-semibold">Demo Credentials:</span>
            <span className="block text-zinc-400">user: <code className="text-zinc-200">admin</code> &middot; pass: <code className="text-zinc-200">streetwear2026</code></span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Autofill</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 font-mono">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Username ID
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin"
              className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Access Secret
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:border-white focus:outline-none font-mono pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
            >
              <span>Unlock Admin Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
