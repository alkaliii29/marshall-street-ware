import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../types';
import { addOrder, generateOrderId } from '../services/orderStorage';
import { triggerOrderNotification } from '../services/browserNotification';
import { X, Trash2, ArrowRight, ShieldCheck, Check, ShoppingBag, Truck, Calendar } from 'lucide-react';

interface CartDrawerProps {
  onContinueShopping?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onContinueShopping }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    clearCart,
  } = useCart();
  const { showToast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<{
    orderId: string;
    productName: string;
    total: number;
    name: string;
    address: string;
  } | null>(null);

  // Checkout form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'cod' as 'card' | 'cod' | 'upi',
  });

  if (!isCartOpen) return null;

  // Free shipping above ₹999
  const shippingCost = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal + shippingCost;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      showToast('Please provide your name, phone and delivery address', 'error');
      return;
    }

    const assignedOrderId = generateOrderId();
    const allProductNames = cart
      .map((item) => `${item.product.name} (x${item.quantity})`)
      .join(', ');

    // Record each cart item into order storage with generated ORD ID
    cart.forEach((item, index) => {
      addOrder({
        id: index === 0 ? assignedOrderId : undefined,
        productName: `${item.product.name} (Qty: ${item.quantity}, Size: ${item.size})`,
        productId: item.product.id,
        price: item.product.price * item.quantity,
        customerName: formData.name.trim(),
        phone: formData.phone.trim(),
        address: `${formData.address.trim()}, ${formData.city.trim()}`,
        size: item.size,
        date: new Date().toISOString(),
        status: 'Processing',
      });
    });

    setOrderComplete({
      orderId: assignedOrderId,
      productName: allProductNames,
      total: finalTotal,
      name: formData.name,
      address: `${formData.address}, ${formData.city}`,
    });

    clearCart();
    setIsCheckingOut(false);

    // 1. Success toast message: "✅ Order placed successfully!"
    showToast('✅ Order placed successfully!', 'success', `Order ${assignedOrderId} confirmed.`);

    // 2. Browser notification
    triggerOrderNotification(assignedOrderId, allProductNames);
  };

  const handleFinishShopping = () => {
    setOrderComplete(null);
    setIsCartOpen(false);
    if (onContinueShopping) {
      onContinueShopping();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => {
          setIsCartOpen(false);
          setIsCheckingOut(false);
          setOrderComplete(null);
        }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-zinc-800 flex flex-col justify-between shadow-2xl text-zinc-100">
          
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="font-display text-lg font-bold uppercase tracking-tight text-white">
                Marshall Bag
              </span>
              <span className="font-mono text-xs text-zinc-400">
                ({totalItems} {totalItems === 1 ? 'piece' : 'pieces'})
              </span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckingOut(false);
                setOrderComplete(null);
              }}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            
            {/* Case 1: Order Completed Success Modal */}
            {orderComplete ? (
              <div className="py-6 text-center space-y-6 animate-in fade-in zoom-in-95">
                {/* Big Success Icon (✔) */}
                <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-amber-400/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                  <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
                    Cash On Delivery Confirmed
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-white">
                    Order Placed Successfully!
                  </h3>
                </div>

                {/* Highlighted Order ID */}
                <div className="py-2.5 px-4 bg-zinc-900 border border-zinc-800 rounded-xl inline-flex flex-col items-center">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Order ID Reference
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-extrabold text-amber-400 tracking-wider">
                    {orderComplete.orderId}
                  </span>
                </div>

                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-xl text-left space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-start gap-2 text-zinc-400">
                    <span className="text-zinc-500 uppercase shrink-0">Items</span>
                    <span className="text-white font-sans font-medium text-right line-clamp-2">
                      {orderComplete.productName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400 border-t border-zinc-800 pt-2 font-semibold">
                    <span className="text-zinc-500 uppercase">Total Amount (COD)</span>
                    <span className="text-amber-400 text-sm font-display">{formatINR(orderComplete.total)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400 border-t border-zinc-800 pt-2">
                    <span className="text-zinc-500 uppercase">Deliver To</span>
                    <span className="text-zinc-300 truncate max-w-[200px]">{orderComplete.address}</span>
                  </div>
                </div>

                {/* Delivery message: "Your order will be delivered within 3–5 days" */}
                <div className="p-3 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center gap-2 text-xs text-amber-300 font-mono">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-semibold">Your order will be delivered within 3–5 days</span>
                </div>

                {/* "Continue Shopping" Button */}
                <button
                  onClick={handleFinishShopping}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-extrabold text-xs uppercase tracking-widest rounded-xl hover:brightness-105 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            ) : isCheckingOut ? (
              /* Case 2: Checkout Form */
              <form onSubmit={handlePlaceOrder} className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                    Shipping & Payment
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-zinc-400 hover:text-white underline font-mono"
                  >
                    &larr; Back to items
                  </button>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block uppercase text-zinc-400 mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Arjun Kapoor"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-sans"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-zinc-400 mb-1">Mobile Phone *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block uppercase text-zinc-400 mb-1">Street Address *</label>
                    <input
                      required
                      type="text"
                      placeholder="House/Apartment, Street & Area"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-zinc-400 mb-1">City</label>
                      <input
                        required
                        type="text"
                        placeholder="Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none font-sans"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-zinc-400 mb-1">Pincode</label>
                      <input
                        required
                        type="text"
                        placeholder="400050"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block uppercase text-zinc-400 mb-2">Payment Preference</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className={`py-2 text-[11px] font-mono rounded border text-center transition-colors ${
                          formData.paymentMethod === 'cod'
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        COD
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className={`py-2 text-[11px] font-mono rounded border text-center transition-colors ${
                          formData.paymentMethod === 'upi'
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className={`py-2 text-[11px] font-mono rounded border text-center transition-colors ${
                          formData.paymentMethod === 'card'
                            ? 'bg-amber-400 text-black border-amber-400 font-bold'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                        }`}
                      >
                        Card
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] font-mono text-zinc-400 flex items-center gap-2 mt-4">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Delivered in 3–5 business days across India</span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Confirm Order &bull; {formatINR(finalTotal)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : cart.length === 0 ? (
              /* Case 3: Empty Bag */
              <div className="h-full flex flex-col items-center justify-center text-center py-16 text-zinc-500">
                <ShoppingBag className="w-12 h-12 text-zinc-700 stroke-[1.2] mb-3" />
                <span className="font-display text-lg uppercase tracking-wider text-zinc-300 mb-1">
                  Your Bag is Empty
                </span>
                <p className="text-xs text-zinc-500 max-w-xs mb-6 font-sans">
                  Browse our high-end streetwear archive and pick your oversized silhouettes.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-lg text-xs font-mono uppercase tracking-wider text-zinc-200 hover:text-white transition-colors"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              /* Case 4: Itemized Bag List */
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-4 p-3 bg-zinc-900/60 border border-zinc-900 rounded-lg"
                  >
                    <div className="w-16 h-20 bg-zinc-900 shrink-0 rounded overflow-hidden border border-zinc-800">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-zinc-500 hover:text-rose-400 p-0.5 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-1">
                          <span className="text-amber-400">Size: {item.size}</span>
                          <span>&bull;</span>
                          <span className="text-white font-medium">{formatINR(item.product.price)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-zinc-800 bg-zinc-950 rounded">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-mono"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-mono tabular-nums text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="px-2 py-0.5 text-zinc-400 hover:text-white text-xs font-mono"
                          >
                            +
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="font-display text-xs font-bold text-white">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          {!orderComplete && cart.length > 0 && !isCheckingOut && (
            <div className="p-5 sm:p-6 border-t border-zinc-900 bg-black/60 space-y-3">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-emerald-400">
                    {shippingCost === 0 ? 'FREE (Above ₹999)' : formatINR(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white border-t border-zinc-900 pt-2">
                  <span>Total Amount</span>
                  <span className="font-display text-amber-400 text-base font-bold">{formatINR(finalTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-105 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <p className="text-[10px] text-zinc-500 text-center font-mono">
                Cash On Delivery available &bull; 7-day easy returns
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
