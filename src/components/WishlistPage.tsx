import React from 'react';
import { Product, formatINR } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, Zap, ShoppingBag, ArrowLeft, ImageOff } from 'lucide-react';

interface WishlistPageProps {
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  onBack,
  onSelectProduct,
  onBuyNow,
}) => {
  const { wishlistIds, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const likedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-24">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors uppercase font-mono tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </button>
          <div className="text-zinc-500 font-mono hidden sm:flex items-center gap-2">
            <span>MARSHALL STORE</span>
            <span>/</span>
            <span className="text-amber-400">LIKED PRODUCTS</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-zinc-900 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold mb-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>SAVED ARCHIVE</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              Liked Products ({likedProducts.length})
            </h1>
          </div>

          <p className="text-xs text-zinc-400 font-mono">
            Pieces saved in your browser &bull; Cash On Delivery ready
          </p>
        </div>

        {/* Empty State */}
        {likedProducts.length === 0 ? (
          <div className="py-20 text-center border border-zinc-900 bg-zinc-950 rounded-2xl p-8 max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-white">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm mx-auto">
              Click the ❤️ icon on any streetwear product card to bookmark it for direct ordering anytime.
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 transition-all shadow-md"
            >
              Explore Streetwear Catalog
            </button>
          </div>
        ) : (
          /* Liked Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {likedProducts.map((product) => (
              <div
                key={product.id}
                className="group relative flex flex-col bg-zinc-950 border border-zinc-900 hover:border-zinc-700/80 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Product Image */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Remove from Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/80 hover:bg-black text-rose-500 border border-zinc-800 transition-all z-10 shadow-md group-hover:scale-110"
                    title="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-black/90 px-2 py-0.5 border border-zinc-800 rounded">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{product.sku}</span>
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-semibold text-sm text-zinc-100 hover:text-amber-400 transition-colors cursor-pointer line-clamp-1 mt-0.5"
                    >
                      {product.name}
                    </h3>
                    <div className="mt-1.5 flex items-baseline gap-2">
                      <span className="font-display text-lg font-bold text-white">
                        {formatINR(product.price)}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">In Stock</span>
                    </div>
                  </div>

                  {/* Action Buttons: Buy Now & Add to Cart */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
                    <button
                      type="button"
                      onClick={() => {
                        const sz = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'ONE SIZE';
                        addToCart(product, sz, 1);
                      }}
                      className="py-2.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="truncate">Add to Cart</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onBuyNow(product)}
                      className="py-2.5 px-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:brightness-105 flex items-center justify-center gap-1.5 transition-all shadow-md active:translate-y-0.5"
                    >
                      <Zap className="w-3.5 h-3.5 stroke-[2.2]" />
                      <span className="truncate">Buy Now</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
