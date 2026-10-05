import React, { useState } from 'react';
import { Product, formatINR } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ArrowLeft, Check, Shield, Truck, RotateCcw, ImageOff, ShoppingBag, Zap, Heart } from 'lucide-react';

interface ProductDetailsProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onBuyNow,
}) => {
  const { addToCart } = useCart();
  const { isLiked, toggleWishlist } = useWishlist();
  const liked = isLiked(product.id);

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0] : 'ONE SIZE'
  );
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black text-zinc-100 pb-20">
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
            <span className="text-zinc-400">{product.category}</span>
            <span>/</span>
            <span className="text-amber-400">{product.sku}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Main Grid: Gallery (Left) + Purchase Module (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
          
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] w-full bg-zinc-900 overflow-hidden border border-zinc-900 rounded-xl">
              {!imageError ? (
                <img
                  src={product.image}
                  alt={product.name}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-8 text-center">
                  <ImageOff className="w-12 h-12 stroke-[1.5] mb-3 text-zinc-600" />
                  <span className="font-mono text-sm uppercase text-zinc-400">{product.name}</span>
                  <span className="text-xs text-zinc-600 mt-1">Image Preview Unavailable</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isNewArrival && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-black font-bold bg-amber-400 px-2.5 py-1 rounded shadow-md">
                    New Drop
                  </span>
                )}
                {product.isFeatured && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-200 bg-black/90 px-2.5 py-1 border border-zinc-800 rounded">
                    Featured
                  </span>
                )}
              </div>

              {/* Like Button on Detail Page Gallery */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all z-20 shadow-lg ${
                  liked
                    ? 'bg-black/90 text-rose-500 border border-rose-500/40'
                    : 'bg-black/70 text-zinc-300 hover:text-white hover:bg-black border border-zinc-800'
                }`}
                title={liked ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'}`} />
              </button>
            </div>

            {/* Editorial Callout */}
            <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-lg text-xs font-mono text-zinc-400 flex items-center justify-between">
              <span className="text-amber-400 font-semibold">MARSHALL STREET WEAR &bull; RUNWAY ARCHIVE</span>
              <span>AUTHENTIC HEAVYWEIGHT SPEC</span>
            </div>
          </div>

          {/* Contiguous Purchase Module (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-start space-y-6">
            
            {/* Title & Price Header */}
            <div className="border-b border-zinc-900 pb-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 uppercase tracking-widest">
                <span className="text-amber-400 font-semibold">{product.category}</span>
                <span>SKU: {product.sku}</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 pt-2">
                <span className="font-display text-3xl font-extrabold text-white">
                  {formatINR(product.price)}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-medium">
                  Free Shipping &bull; COD Available
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                Piece Architecture & Cut
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {product.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-mono uppercase tracking-wider text-zinc-300">
                  Select Size: <span className="text-amber-400 font-bold">{selectedSize}</span>
                </label>
                <span className="text-zinc-500 font-mono text-[11px]">True to Oversized Fit</span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-xs font-mono uppercase rounded transition-all duration-150 border ${
                      selectedSize === size
                        ? 'bg-amber-400 text-black border-amber-400 font-bold'
                        : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper & Stock */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <label>Quantity</label>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span className="text-zinc-300">
                    {product.stock > 0 ? `${product.stock} Units In Stock` : 'Sold Out'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || product.stock === 0}
                    className="px-3.5 py-2.5 text-zinc-400 hover:text-white disabled:opacity-40 font-mono transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 font-mono text-xs tabular-nums text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="px-3.5 py-2.5 text-zinc-400 hover:text-white disabled:opacity-40 font-mono transition-colors"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs font-mono text-zinc-400">
                  Total: <strong className="text-white font-sans">{formatINR(product.price * quantity)}</strong>
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS: Add to Cart, Buy Now, and Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3.5 px-4 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border ${
                    product.stock === 0
                      ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-zinc-900 text-zinc-200 hover:text-white border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Buy Now (Primary Highlighted) */}
                <button
                  type="button"
                  onClick={() => onBuyNow(product)}
                  disabled={product.stock === 0}
                  className="flex-1 py-3.5 px-4 rounded-lg text-xs uppercase tracking-widest font-extrabold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:translate-y-0.5 disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 stroke-[2.2]" />
                  <span className="font-display">Buy Now (Cash On Delivery)</span>
                </button>
              </div>

              {/* Wishlist Toggle Button on Detail Page */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`w-full py-2.5 px-4 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border ${
                  liked
                    ? 'bg-rose-950/30 text-rose-400 border-rose-800/60'
                    : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{liked ? 'Saved in Wishlist (Click to Remove)' : 'Save to Liked Products'}</span>
              </button>
            </div>

            {/* Specifications */}
            {product.details && product.details.length > 0 && (
              <div className="border-t border-zinc-900 pt-6 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
                  Fabric & Technical Specifications
                </h3>
                <ul className="space-y-1.5 text-xs text-zinc-300 font-sans">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-mono mt-0.5">&bull;</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feature Assurances */}
            <div className="border-t border-zinc-900 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Free shipping above ₹999</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>7-day hassle-free returns</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verified genuine streetwear</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related Pieces */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-zinc-900 pt-12">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Complete the Look
                </span>
                <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-white mt-1">
                  Complementary Streetwear Pieces
                </h2>
              </div>
              <button
                onClick={onBack}
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                View Full Collection &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-zinc-950 border border-zinc-900 hover:border-zinc-700 p-4 rounded-xl transition-all duration-200"
                >
                  <div className="aspect-[4/5] bg-zinc-900 rounded-lg overflow-hidden mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">{p.category}</span>
                      <h4 className="font-semibold text-white group-hover:text-amber-400 line-clamp-1 mt-0.5">
                        {p.name}
                      </h4>
                    </div>
                    <span className="font-display font-bold text-white">{formatINR(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
