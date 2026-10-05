import React from 'react';
import { formatINR } from '../types';
import { Check, Truck, Calendar, ShoppingBag, ArrowRight } from 'lucide-react';

export interface OrderConfirmationData {
  orderId: string;
  productName: string;
  price: number;
  customerName?: string;
  phone?: string;
  address?: string;
  date?: string;
}

interface OrderConfirmationModalProps {
  orderData: OrderConfirmationData | null;
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  orderData,
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  if (!isOpen || !orderData) return null;

  // Delivery timeframe (3-5 days from now)
  const today = new Date();
  const deliveryMin = new Date(today);
  deliveryMin.setDate(today.getDate() + 3);
  const deliveryMax = new Date(today);
  deliveryMax.setDate(today.getDate() + 5);

  const deliveryDateFormatted = `${deliveryMin.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })} – ${deliveryMax.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })}`;

  const handleContinue = () => {
    onClose();
    onContinueShopping();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleContinue}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Confirmation Card (Centered, Clean Layout) */}
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-zinc-100 z-10 animate-in fade-in zoom-in-95 my-8 text-center space-y-6">
        
        {/* Big Success Icon (✔) */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-amber-400/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
          <Check className="w-10 h-10 text-emerald-400 stroke-[3]" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500" />
          </span>
        </div>

        {/* Success Header */}
        <div className="space-y-1.5">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
            Payment On Delivery Verified
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
            Order Confirmed!
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Thank you for shopping with <span className="text-white font-semibold">Marshall Street Wear</span>.
          </p>
        </div>

        {/* Highlighted Order ID Badge */}
        <div className="py-2.5 px-4 bg-zinc-900/90 border border-zinc-800 rounded-xl inline-flex flex-col items-center">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Generated Order ID
          </span>
          <span className="font-display text-xl sm:text-2xl font-extrabold text-amber-400 tracking-wider">
            {orderData.orderId}
          </span>
        </div>

        {/* Structured Order Details Card */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 text-left space-y-3 text-xs font-mono">
          <div className="flex justify-between items-start gap-4">
            <span className="text-zinc-500 shrink-0 uppercase">Product</span>
            <span className="text-white font-sans font-semibold text-right line-clamp-2">
              {orderData.productName}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-800/60 pt-2.5">
            <span className="text-zinc-500 uppercase">Amount Due</span>
            <span className="font-display text-base font-bold text-white">
              {formatINR(orderData.price)}
            </span>
          </div>

          {orderData.customerName && (
            <div className="flex justify-between items-center border-t border-zinc-800/60 pt-2.5">
              <span className="text-zinc-500 uppercase">Customer</span>
              <span className="text-zinc-300">{orderData.customerName}</span>
            </div>
          )}

          {orderData.address && (
            <div className="flex justify-between items-start gap-3 border-t border-zinc-800/60 pt-2.5">
              <span className="text-zinc-500 shrink-0 uppercase">Deliver To</span>
              <span className="text-zinc-300 text-right max-w-[240px] truncate">
                {orderData.address}
              </span>
            </div>
          )}
        </div>

        {/* Required Prominent Delivery Message: "Your order will be delivered within 3–5 days" */}
        <div className="p-3.5 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center gap-2.5 text-xs text-amber-300 font-mono">
          <Truck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-semibold">Your order will be delivered within 3–5 days</span>
        </div>

        {/* Estimated Date Tag */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Expected by: <strong className="text-zinc-300">{deliveryDateFormatted}</strong></span>
        </div>

        {/* Action Button: "Continue Shopping" */}
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
    </div>
  );
};
