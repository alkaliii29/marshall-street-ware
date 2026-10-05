import React, { useState } from 'react';
import { Product, formatINR } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { ImageOff, ShoppingBag, Zap, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onBuyNow,
  onAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);
  const { isLiked, toggleWishlist } = useWishlist();
  const liked = isLiked(product.id);

  return (
    <div className="group relative flex flex-col bg-zinc-950/80 border border-zinc-900 hover:border-zinc-700/80 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl">
      {/* Product Image Slot */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 cursor-pointer"
      >
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-6 text-center">
            <ImageOff className="w-8 h-8 stroke-[1.5] mb-2 text-zinc-600" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              {product.name}
            </span>
          </div>
        )}

        {/* Subtle Dark Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-black font-bold bg-amber-400 px-2 py-0.5 rounded shadow-sm">
              New Drop
            </span>
          )}
          {product.isFeatured && !product.isNewArrival && (
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 bg-black/90 px-2 py-0.5 border border-zinc-800 rounded">
              Featured
            </span>
          )}
        </div>

        {/* ❤️ Like Button (Top-Right Corner of each Product Card) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-20 shadow-md ${
            liked
              ? 'bg-black/90 text-rose-500 border border-rose-500/40 scale-105'
              : 'bg-black/70 text-zinc-400 hover:text-white hover:bg-black border border-zinc-800 hover:scale-110'
          }`}
          aria-label={liked ? 'Unlike product' : 'Like product'}
          title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border border-zinc-700 px-3 py-1">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
            <span className="text-amber-400/90 font-medium">{product.category}</span>
            <span>{product.sku}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="font-semibold text-sm sm:text-base text-zinc-100 hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Price (INR Format) */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-white tracking-tight">
              {formatINR(product.price)}
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">MRP Incl. Taxes</span>
          </div>
        </div>

        {/* 2 Buttons: Add to Cart (Secondary) & Buy Now (Primary) */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-900">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="py-2.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="truncate">Add to Cart</span>
          </button>

          <button
            type="button"
            onClick={() => onBuyNow(product)}
            disabled={product.stock === 0}
            className="py-2.5 px-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-105 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:translate-y-0.5 disabled:opacity-40"
          >
            <Zap className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="truncate font-display font-extrabold">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
