import React from 'react';
import { ArrowDown, Sparkles, Zap } from 'lucide-react';
import { HERO_IMAGE } from '../services/productStorage';

interface HeroProps {
  onExploreClick: () => void;
  onFeaturedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onFeaturedClick }) => {
  return (
    <section className="relative w-full min-h-[80vh] lg:min-h-[85vh] flex items-end justify-start overflow-hidden bg-black border-b border-zinc-900">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="Marshall Street Wear Runway Campaign"
          className="w-full h-full object-cover object-center opacity-65 filter brightness-90 contrast-105"
          referrerPolicy="no-referrer"
          loading="eager"
        />
        {/* Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
        <div className="max-w-3xl space-y-5">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-mono font-semibold tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>MARSHALL STREET WEAR &bull; WINTER 2026 DROP</span>
          </div>

          {/* Primary Bold Streetwear Typography */}
          <div className="space-y-1">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95]">
              OVERSIZED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                STREETWEAR ARCHIVE
              </span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-xl pt-2">
              Engineered with 480 GSM French Terry cotton and brutalist architectural drape.
              Delivered straight to your doorstep with Cash On Delivery across India.
            </p>
          </div>

          {/* Key Trust Perks */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
            <span className="text-amber-400 font-medium">Free Shipping Above ₹999</span>
            <span>&bull;</span>
            <span>Cash On Delivery Available</span>
            <span>&bull;</span>
            <span>7-Day Easy Returns</span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-black font-display font-bold text-xs uppercase tracking-widest rounded-lg hover:brightness-105 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg active:translate-y-0.5"
            >
              <span>Explore New Arrivals</span>
              <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
            <button
              onClick={onFeaturedClick}
              className="px-6 py-3.5 bg-zinc-900/80 backdrop-blur-md text-white border border-zinc-700 hover:border-amber-400/50 font-semibold text-xs uppercase tracking-widest rounded-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Featured Products</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
