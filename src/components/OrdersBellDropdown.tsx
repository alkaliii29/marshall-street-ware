import React, { useState, useRef, useEffect } from 'react';
import { Order, formatINR } from '../types';
import { Bell, Clock, CheckCircle2, Truck, ArrowRight, Package } from 'lucide-react';

interface OrdersBellDropdownProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
}

export const OrdersBellDropdown: React.FC<OrdersBellDropdownProps> = ({
  orders,
  onViewOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Grab the last 3 orders
  const recentOrders = orders.slice(0, 3);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors flex items-center focus:outline-none rounded-lg ${
          isOpen ? 'text-amber-400 bg-zinc-900' : 'text-zinc-300 hover:text-amber-400'
        }`}
        aria-label="Recent order notifications"
        title="Recent Orders"
      >
        <Bell className="w-5 h-5 stroke-[1.75]" />
        {recentOrders.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-4 z-50 text-zinc-100 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                Recent Orders ({recentOrders.length})
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Last 3 Dispatches
            </span>
          </div>

          <div className="py-2 space-y-2.5">
            {recentOrders.length === 0 ? (
              <div className="py-6 text-center text-xs font-mono text-zinc-500">
                No orders placed yet.
              </div>
            ) : (
              recentOrders.map((order) => {
                const dateFormatted = new Date(order.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                });

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      if (onViewOrder) onViewOrder(order);
                      setIsOpen(false);
                    }}
                    className="p-3 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-lg cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400 font-bold">{order.id}</span>
                      <span className="text-zinc-500 text-[10px]">{dateFormatted}</span>
                    </div>

                    <div className="text-xs font-medium text-white font-sans line-clamp-1">
                      {order.productName}
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-zinc-800/50">
                      <span className="font-bold font-display text-white">{formatINR(order.price)}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : order.status === 'Dispatched'
                            ? 'bg-amber-400/10 text-amber-400'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {order.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'Dispatched' && <Truck className="w-3 h-3" />}
                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-2 border-t border-zinc-900 text-center">
            <span className="text-[10px] font-mono text-zinc-500">
              Delivery within 3–5 days across India &bull; Cash On Delivery
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
