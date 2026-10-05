import React, { useState } from 'react';
import { Product, formatINR } from '../types';
import { addOrder } from '../services/orderStorage';
import { triggerOrderNotification } from '../services/browserNotification';
import { useToast } from '../context/ToastContext';
import { X, Check, ShieldCheck, Zap, Truck, ShoppingBag, ArrowRight } from 'lucide-react';

interface DirectOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (orderId: string) => void;
  onContinueShopping?: () => void;
}

export const DirectOrderModal: React.FC<DirectOrderModalProps> = ({
  product,
  isOpen,
  onClose,
  onOrderSuccess,
  onContinueShopping,
}) => {
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    productName: string;
    price: number;
    customerName: string;
    phone: string;
    address: string;
    date: string;
  } | null>(null);

  // Initialize selected size when modal opens with a new product
  React.useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('ONE SIZE');
    }
    setConfirmedOrder(null);
  }, [product]);

  if (!isOpen || !product) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !address.trim()) {
      showToast('Please fill all required shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);

    // Save order in localStorage with product name, price, date, and generated order ID (e.g. ORD12345)
    const newOrder = addOrder({
      productName: product.name,
      productId: product.id,
      price: product.price,
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      address: address.trim(),
      size: selectedSize,
      date: new Date().toISOString(),
      status: 'Processing',
    });

    setIsSubmitting(false);
    setConfirmedOrder({
      orderId: newOrder.id,
      productName: product.name,
      price: product.price,
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      address: address.trim(),
      date: newOrder.date,
    });

    // 1. Show exact success toast message: "✅ Order placed successfully!"
    showToast('✅ Order placed successfully!', 'success', `Order ${newOrder.id} has been registered.`);

    // 2. Trigger standard browser notification
    triggerOrderNotification(newOrder.id, product.name);

    if (onOrderSuccess) {
      onOrderSuccess(newOrder.id);
    }

    // Reset form fields
    setFullName('');
    setPhoneNumber('');
    setAddress('');
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    onClose();
  };

  const handleContinue = () => {
    setConfirmedOrder(null);
    onClose();
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={confirmedOrder ? handleContinue : handleClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 text-zinc-100 my-8 animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={confirmedOrder ? handleContinue : handleClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* 1 & 4. ORDER CONFIRMATION CARD (Centered Clean Layout) */
          <div className="text-center space-y-6 py-2 animate-in fade-in">
            {/* Big Success Icon (✔) */}
            <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-amber-400/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
              </span>
            </div>

            {/* Header */}
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
                Cash On Delivery Verified
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Order Placed Successfully!
              </h2>
            </div>

            {/* Order ID Highlighted (e.g. ORD12345) */}
            <div className="py-2.5 px-4 bg-zinc-900/90 border border-zinc-800 rounded-xl inline-flex flex-col items-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                Order ID Reference
              </span>
              <span className="font-display text-xl sm:text-2xl font-extrabold text-amber-400 tracking-wider">
                {confirmedOrder.orderId}
              </span>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-left text-xs font-mono space-y-2.5">
              <div className="flex justify-between items-start gap-3">
                <span className="text-zinc-500 uppercase shrink-0">Product</span>
                <span className="text-white font-sans font-semibold text-right max-w-[240px] truncate">
                  {confirmedOrder.productName}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-2">
                <span className="text-zinc-500 uppercase">Amount Due (COD)</span>
                <span className="text-amber-400 font-display font-bold text-sm">
                  {formatINR(confirmedOrder.price)}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-zinc-800/60 pt-2">
                <span className="text-zinc-500 uppercase">Customer</span>
                <span className="text-zinc-200">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-start gap-2 border-t border-zinc-800/60 pt-2">
                <span className="text-zinc-500 uppercase shrink-0">Deliver To</span>
                <span className="text-zinc-300 text-right max-w-[220px] truncate">
                  {confirmedOrder.address}
                </span>
              </div>
            </div>

            {/* Required Delivery Message: "Your order will be delivered within 3–5 days" */}
            <div className="p-3.5 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center gap-2.5 text-xs text-amber-300 font-mono">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-semibold">Your order will be delivered within 3–5 days</span>
            </div>

            {/* "Continue Shopping" Button -> Goes back to homepage */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinue}
                className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-extrabold text-xs uppercase tracking-widest rounded-xl hover:brightness-105 active:translate-y-0.5 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>
          </div>
        ) : (
          /* Order Checkout Form View */
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-900">
              <div className="p-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-md">
                <Zap className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                  Quick Buy Now
                </h2>
                <span className="text-[11px] font-mono text-zinc-400">
                  Cash On Delivery &bull; Instant Confirmation
                </span>
              </div>
            </div>

            {/* Product Summary Row */}
            <div className="flex gap-4 p-3.5 bg-zinc-900/80 border border-zinc-800/80 rounded-lg mb-5">
              <div className="w-16 h-20 bg-zinc-950 rounded overflow-hidden shrink-0 border border-zinc-800">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    {product.category} &bull; {product.sku}
                  </span>
                  <h3 className="font-semibold text-white text-sm line-clamp-1 mt-0.5">
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold text-white">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Free Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <label className="text-zinc-400 uppercase">Select Size</label>
                    <span className="text-zinc-300 font-semibold">{selectedSize}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`py-2 text-xs font-mono uppercase rounded transition-all border ${
                          selectedSize === sz
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Arjun Kapoor"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-sans"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                  Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="House/Flat No., Street, Landmark, City & Pincode"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-sans"
                />
              </div>

              {/* Trust Badge */}
              <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Zero upfront payment &bull; Delivered in 3–5 days</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-105 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>Place Order &bull; {formatINR(product.price)}</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
