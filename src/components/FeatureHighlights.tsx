import React from 'react';
import { Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      subtitle: 'On all orders above ₹999',
    },
    {
      icon: Banknote,
      title: 'Cash On Delivery',
      subtitle: 'Pay when it arrives',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      subtitle: '7-day hassle-free returns',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      subtitle: '100% protected checkout',
    },
  ];

  return (
    <section className="w-full py-10 bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="bg-zinc-950/90 border border-zinc-800/80 hover:border-amber-400/40 rounded-xl p-5 sm:p-6 transition-all duration-200 group flex items-start gap-4 shadow-sm"
              >
                {/* Gold Accent Icon Circle */}
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-amber-400/50 transition-all">
                  <Icon className="w-6 h-6 text-amber-400 stroke-[1.75]" />
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    {feat.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
