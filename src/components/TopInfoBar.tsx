import React from 'react';
import { Truck, Banknote, RotateCcw } from 'lucide-react';

export const TopInfoBar: React.FC = () => {
  return (
    <aside aria-label="Announcement" className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-black py-2 px-3 text-[11px] sm:text-xs font-semibold tracking-wide border-b border-amber-500/40">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 text-center">
        
        <div className="flex items-center gap-1.5 shrink-0">
          <Truck className="w-3.5 h-3.5 text-black stroke-[2.2]" />
          <span>Free Shipping Above ₹999</span>
        </div>

        <span className="hidden sm:inline text-black/50">&bull;</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <Banknote className="w-3.5 h-3.5 text-black stroke-[2.2]" />
          <span>Cash On Delivery Available</span>
        </div>

        <span className="hidden sm:inline text-black/50">&bull;</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <RotateCcw className="w-3.5 h-3.5 text-black stroke-[2.2]" />
          <span>Easy Returns</span>
        </div>

      </div>
    </aside>
  );
};
