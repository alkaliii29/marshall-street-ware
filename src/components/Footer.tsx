import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface FooterProps {
  onAdminClick: () => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick, onNavigateHome }) => {
  const { showToast } = useToast();
  const { isAdminAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed to Marshall VIP Drops', 'success', 'You will receive early drop access.');
    setEmail('');
  };

  return (
    <footer id="brand-story" className="w-full bg-black border-t border-zinc-900 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Brand Ethos & Newsletter Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-14 border-b border-zinc-900">
          
          {/* Brand Ethos */}
          <div className="lg:col-span-6 space-y-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center font-display font-extrabold text-black text-base">
                M
              </div>
              <span className="font-display text-2xl font-extrabold uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                MARSHALL STREET WEAR
              </span>
            </button>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md font-sans">
              Marshall Street Wear is a bespoke urban apparel label founded on heavyweight textiles, uncompromising oversized cuts, and direct-to-consumer access with nationwide Cash On Delivery.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 pt-1">
              <span className="text-amber-400">FREE SHIPPING &gt; ₹999</span>
              <span>&bull;</span>
              <span>COD AVAILABLE</span>
              <span>&bull;</span>
              <span>7-DAY RETURNS</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Marshall VIP Release Wire</span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md font-sans">
              Get notified for limited drop releases, restocks, and private seasonal warehouse sales.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-md gap-2 pt-1">
              <input
                type="email"
                required
                placeholder="Enter client email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black hover:brightness-105 rounded-lg text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Joined</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Links & Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs font-mono">
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-zinc-400">
            <a href="#new-arrivals" className="hover:text-amber-400 transition-colors">
              New Drops
            </a>
            <a href="#featured-products" className="hover:text-amber-400 transition-colors">
              Featured Grid
            </a>
            <a href="#all-catalog" className="hover:text-amber-400 transition-colors">
              All Products
            </a>
            <button
              onClick={onAdminClick}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminAuthenticated ? 'Admin Panel (Active)' : 'Admin Dashboard'}</span>
            </button>
          </div>

          <div className="text-zinc-500 text-[11px]">
            &copy; 2026 MARSHALL STREET WEAR &bull; ALL RIGHTS RESERVED.
          </div>

        </div>

      </div>
    </footer>
  );
};
