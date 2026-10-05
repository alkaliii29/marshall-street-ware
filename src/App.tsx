import React, { useState, useEffect } from 'react';
import { Product, Order, PageRoute, AdminTab } from './types';
import { getStoredProducts, subscribeToProducts } from './services/productStorage';
import { getStoredOrders, subscribeToOrders } from './services/orderStorage';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { TopInfoBar } from './components/TopInfoBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureHighlights } from './components/FeatureHighlights';
import { ProductCard } from './components/ProductCard';
import { ProductDetails } from './components/ProductDetails';
import { WishlistPage } from './components/WishlistPage';
import { DirectOrderModal } from './components/DirectOrderModal';
import { OrderConfirmationModal, OrderConfirmationData } from './components/OrderConfirmationModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { ArrowRight } from 'lucide-react';

function MainAppContent() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#product/')) {
      const id = hash.replace('#product/', '');
      return { view: 'product', productId: id };
    }
    if (hash.startsWith('#wishlist')) {
      return { view: 'wishlist' };
    }
    if (hash.startsWith('#admin')) {
      const tab = hash.replace('#admin/', '') as AdminTab;
      return { view: 'admin', adminTab: tab === 'products' || tab === 'analytics' ? tab : 'dashboard' };
    }
    return { view: 'home' };
  });

  const [activeCatalogCategory, setActiveCatalogCategory] = useState<string>('All');
  const [directOrderProduct, setDirectOrderProduct] = useState<Product | null>(null);
  const [isDirectOrderOpen, setIsDirectOrderOpen] = useState(false);
  const [viewingConfirmationOrder, setViewingConfirmationOrder] = useState<OrderConfirmationData | null>(null);

  const { isAdminAuthenticated, setIsLoginModalOpen } = useAuth();
  const { addToCart } = useCart();

  // Listen to product and order storage updates reactively
  useEffect(() => {
    const unsubProducts = subscribeToProducts((updated) => setProducts(updated));
    const unsubOrders = subscribeToOrders((updated) => setOrders(updated));
    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Hash-based history and back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product/')) {
        const id = hash.replace('#product/', '');
        setCurrentRoute({ view: 'product', productId: id });
      } else if (hash.startsWith('#wishlist')) {
        setCurrentRoute({ view: 'wishlist' });
      } else if (hash.startsWith('#admin')) {
        const tab = hash.replace('#admin/', '') as AdminTab;
        setCurrentRoute({ view: 'admin', adminTab: tab === 'products' || tab === 'analytics' ? tab : 'dashboard' });
      } else {
        setCurrentRoute({ view: 'home' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: PageRoute) => {
    setCurrentRoute(route);
    if (route.view === 'home') {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route.view === 'product') {
      window.location.hash = `product/${route.productId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route.view === 'wishlist') {
      window.location.hash = 'wishlist';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (route.view === 'admin') {
      window.location.hash = route.adminTab ? `admin/${route.adminTab}` : 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    navigateTo({ view: 'product', productId: product.id });
  };

  // Direct Buy Now trigger
  const handleBuyNow = (product: Product) => {
    setDirectOrderProduct(product);
    setIsDirectOrderOpen(true);
  };

  // Filtered views
  const newArrivals = products.filter((p) => p.isNewArrival);
  const featuredProducts = products.filter((p) => p.isFeatured);
  const catalogProducts =
    activeCatalogCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCatalogCategory);

  const categories = ['All', 'Hoodies', 'Outerwear', 'Pants', 'T-Shirts', 'Footwear', 'Accessories'];

  // Current selected product for detail view
  const currentProduct =
    currentRoute.view === 'product'
      ? products.find((p) => p.id === currentRoute.productId)
      : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans">
      {/* 2. Top Info Bar (Golden strip above navbar) */}
      {currentRoute.view !== 'admin' && <TopInfoBar />}

      {/* 1. Navbar with Bell Dropdown, Wishlist & Cart */}
      {currentRoute.view !== 'admin' && (
        <Navbar
          currentRoute={currentRoute}
          orders={orders}
          onNavigate={navigateTo}
          onViewOrder={(order) => {
            setViewingConfirmationOrder({
              orderId: order.id,
              productName: order.productName,
              price: order.price,
              customerName: order.customerName,
              phone: order.phone,
              address: order.address,
              date: order.date,
            });
          }}
        />
      )}

      {/* Direct Order System Modal ("Buy Now") */}
      <DirectOrderModal
        product={directOrderProduct}
        isOpen={isDirectOrderOpen}
        onClose={() => {
          setIsDirectOrderOpen(false);
          setDirectOrderProduct(null);
        }}
        onContinueShopping={() => navigateTo({ view: 'home' })}
      />

      {/* Order Confirmation Card Modal (for viewing from notification bell) */}
      <OrderConfirmationModal
        orderData={viewingConfirmationOrder}
        isOpen={!!viewingConfirmationOrder}
        onClose={() => setViewingConfirmationOrder(null)}
        onContinueShopping={() => {
          setViewingConfirmationOrder(null);
          navigateTo({ view: 'home' });
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer onContinueShopping={() => navigateTo({ view: 'home' })} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        onLoginSuccess={() => {
          navigateTo({ view: 'admin', adminTab: 'dashboard' });
        }}
      />

      {/* VIEW 1: ADMIN DASHBOARD */}
      {currentRoute.view === 'admin' ? (
        isAdminAuthenticated ? (
          <AdminDashboard
            products={products}
            orders={orders}
            initialTab={currentRoute.adminTab || 'dashboard'}
            onExit={() => navigateTo({ view: 'home' })}
            onViewProductOnStorefront={(productId) => {
              navigateTo({ view: 'product', productId });
            }}
          />
        ) : (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md p-8 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                MARSHALL STUDIO CLEARANCE
              </span>
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                Admin Authentication Required
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Log in to access products management, store inventory, and the sales analytics engine.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all shadow-md"
                >
                  Open Login Gate
                </button>
                <button
                  onClick={() => navigateTo({ view: 'home' })}
                  className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Return to Store
                </button>
              </div>
            </div>
          </div>
        )
      ) : currentRoute.view === 'wishlist' ? (
        /* VIEW 2: WISHLIST / LIKED PRODUCTS PAGE */
        <WishlistPage
          products={products}
          onBack={() => navigateTo({ view: 'home' })}
          onSelectProduct={handleSelectProduct}
          onBuyNow={handleBuyNow}
        />
      ) : currentRoute.view === 'product' && currentProduct ? (
        /* VIEW 3: PRODUCT DETAIL PAGE */
        <ProductDetails
          product={currentProduct}
          allProducts={products}
          onBack={() => navigateTo({ view: 'home' })}
          onSelectProduct={handleSelectProduct}
          onBuyNow={handleBuyNow}
        />
      ) : (
        /* VIEW 4: HOME STOREFRONT */
        <main className="flex-1">
          {/* Hero Section */}
          <Hero
            onExploreClick={() => {
              document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onFeaturedClick={() => {
              document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Feature Cards Section (Below Hero, 4 cards with gold icons) */}
          <FeatureHighlights />

          {/* Section 1: NEW ARRIVALS */}
          <section id="new-arrivals" className="py-16 sm:py-24 border-b border-zinc-900 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1 font-semibold">
                    <span>LATEST RUN</span>
                    <span>&bull;</span>
                    <span>OCTOBER 2026 ARCHIVE</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                    New Arrivals
                  </h2>
                </div>

                <div className="text-xs font-mono text-zinc-400">
                  <span>{newArrivals.length} Exclusive Pieces</span>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                    onBuyNow={handleBuyNow}
                    onAddToCart={(p) => {
                      const sz = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'ONE SIZE';
                      addToCart(p, sz, 1);
                    }}
                  />
                ))}
              </div>

            </div>
          </section>

          {/* Section 2: FEATURED PRODUCTS */}
          <section id="featured-products" className="py-16 sm:py-24 border-b border-zinc-900 bg-zinc-950/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-1 font-semibold">
                    <span>CORE ARCHIVE</span>
                    <span>&bull;</span>
                    <span>CRITICAL SILHOUETTES</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                    Featured Products
                  </h2>
                </div>

                <a
                  href="#all-catalog"
                  className="text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Complete Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                    onBuyNow={handleBuyNow}
                    onAddToCart={(p) => {
                      const sz = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'ONE SIZE';
                      addToCart(p, sz, 1);
                    }}
                  />
                ))}
              </div>

            </div>
          </section>

          {/* Section 3: COMPLETE ARCHIVE & FILTERABLE CATALOG (12 DEMO PRODUCTS) */}
          <section id="all-catalog" className="py-16 sm:py-24 border-b border-zinc-900 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">
                    <span>FULL ARCHIVE ({products.length} PIECES)</span>
                    <span>&bull;</span>
                    <span>HEAVYWEIGHT SILHOUETTES</span>
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
                    All Studio Products
                  </h2>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto max-w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCatalogCategory(cat)}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        activeCatalogCategory === cat
                          ? 'bg-amber-400 text-black font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              {catalogProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {catalogProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={handleSelectProduct}
                      onBuyNow={handleBuyNow}
                      onAddToCart={(p) => {
                        const sz = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'ONE SIZE';
                        addToCart(p, sz, 1);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center border border-zinc-900 bg-zinc-950 rounded-xl">
                  <p className="font-display text-lg uppercase text-zinc-400">
                    No products currently found in "{activeCatalogCategory}"
                  </p>
                  <button
                    onClick={() => setActiveCatalogCategory('All')}
                    className="mt-4 px-4 py-2 border border-zinc-800 rounded-lg text-xs font-mono uppercase text-zinc-300 hover:text-white"
                  >
                    View All Items
                  </button>
                </div>
              )}

            </div>
          </section>

          {/* Footer */}
          <Footer
            onAdminClick={() => {
              if (isAdminAuthenticated) {
                navigateTo({ view: 'admin', adminTab: 'dashboard' });
              } else {
                setIsLoginModalOpen(true);
              }
            }}
            onNavigateHome={() => navigateTo({ view: 'home' })}
          />
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainAppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
