import React, { useState } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, ArrowUpRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { PageRoute, Order } from '../types';
import { OrdersBellDropdown } from './OrdersBellDropdown';

interface NavbarProps {
  currentRoute: PageRoute;
  orders: Order[];
  onNavigate: (route: PageRoute) => void;
  onViewOrder?: (order: Order) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  orders,
  onNavigate,
  onViewOrder,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAdminAuthenticated, setIsLoginModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      onNavigate({ view: 'admin', adminTab: 'dashboard' });
    } else {
      setIsLoginModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId?: string) => {
    setMobileMenuOpen(false);
    if (currentRoute.view !== 'home') {
      onNavigate({ view: 'home' });
      if (sectionId) {
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (sectionId) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-zinc-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Zone */}
          <button
            onClick={() => handleNavClick()}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 flex items-center justify-center font-display font-extrabold text-black text-base shadow-sm">
              M
            </div>
            <div>
              <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                MARSHALL
              </span>
              <span className="text-[10px] tracking-widest uppercase font-mono text-zinc-400 ml-1.5 hidden sm:inline-block">
                STREET WEAR
              </span>
            </div>
          </button>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            <button
              onClick={() => handleNavClick('new-arrivals')}
              className="hover:text-amber-400 transition-colors relative py-1 hover:border-b hover:border-amber-400"
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleNavClick('featured-products')}
              className="hover:text-amber-400 transition-colors relative py-1 hover:border-b hover:border-amber-400"
            >
              Featured
            </button>
            <button
              onClick={() => handleNavClick('all-catalog')}
              className="hover:text-amber-400 transition-colors relative py-1 hover:border-b hover:border-amber-400"
            >
              All Catalog
            </button>
            <button
              onClick={() => onNavigate({ view: 'wishlist' })}
              className={`hover:text-amber-400 transition-colors relative py-1 hover:border-b hover:border-amber-400 flex items-center gap-1.5 ${
                currentRoute.view === 'wishlist' ? 'text-amber-400 border-b border-amber-400 font-bold' : ''
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Wishlist</span>
            </button>
            <button
              onClick={() => handleNavClick('brand-story')}
              className="hover:text-amber-400 transition-colors relative py-1 hover:border-b hover:border-amber-400"
            >
              About
            </button>
          </nav>

          {/* Primary Actions: Notifications Bell + Wishlist Heart + Bag + Admin */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* 5. Notification Bell Icon in Navbar (Recent Orders) */}
            <OrdersBellDropdown
              orders={orders}
              onViewOrder={onViewOrder}
            />

            {/* ❤️ Wishlist Button in Navbar */}
            <button
              onClick={() => onNavigate({ view: 'wishlist' })}
              className={`relative p-2 transition-colors flex items-center focus:outline-none rounded-lg ${
                currentRoute.view === 'wishlist' ? 'text-rose-500 bg-zinc-900' : 'text-zinc-300 hover:text-rose-400'
              }`}
              aria-label={`Wishlist with ${wishlistCount} liked products`}
              title="Liked Products"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500/20 text-rose-500 stroke-[1.75]' : 'stroke-[1.75]'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[9px] font-bold font-mono tabular-nums bg-rose-500 text-white rounded-full shadow-sm animate-in zoom-in-75">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 focus:outline-none rounded-lg"
              aria-label={`Shopping bag with ${totalItems} pieces`}
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-[10px] font-bold font-mono tabular-nums bg-amber-400 text-black rounded-full shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin Entry Button */}
            <button
              onClick={handleAdminClick}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-150 border ${
                isAdminAuthenticated
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/40 hover:bg-amber-400/20'
                  : 'text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700 bg-zinc-900/60'
              }`}
              title={isAdminAuthenticated ? 'Open Admin Panel' : 'Admin Login'}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isAdminAuthenticated ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">
                {isAdminAuthenticated ? 'Admin Panel' : 'Admin'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-widest text-zinc-300">
            <button
              onClick={() => handleNavClick('new-arrivals')}
              className="text-left py-2 hover:text-amber-400 transition-colors flex items-center justify-between"
            >
              <span>New Arrivals</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </button>
            <button
              onClick={() => handleNavClick('featured-products')}
              className="text-left py-2 hover:text-amber-400 transition-colors flex items-center justify-between"
            >
              <span>Featured Products</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </button>
            <button
              onClick={() => handleNavClick('all-catalog')}
              className="text-left py-2 hover:text-amber-400 transition-colors flex items-center justify-between"
            >
              <span>All Catalog</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate({ view: 'wishlist' });
              }}
              className="text-left py-2 hover:text-amber-400 transition-colors flex items-center justify-between text-rose-400"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 fill-rose-500" />
                <span>Liked Products ({wishlistCount})</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </button>
            <button
              onClick={() => handleNavClick('brand-story')}
              className="text-left py-2 hover:text-amber-400 transition-colors flex items-center justify-between"
            >
              <span>About Marshall</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest">Management</span>
            <button
              onClick={handleAdminClick}
              className="text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 px-3 py-1.5 rounded-lg hover:brightness-105"
            >
              {isAdminAuthenticated ? 'Admin Panel &rarr;' : 'Admin Login &rarr;'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
