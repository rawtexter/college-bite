import React from 'react';
import { Clock, Zap, Search, ShieldCheck, Flame } from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeOrdersCount: number;
  onViewOrders: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  activeOrdersCount,
  onViewOrders,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-8 shadow-xl shadow-amber-950/10">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE}
          alt="College Canteen Dining Hall"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-45 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 max-w-4xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
          <span>Campus Central Dining</span>
          <span aria-hidden="true">·</span>
          <span>Open 07:30 AM – 09:00 PM</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 text-balance">
          Beat the Lunch Rush. Order Ahead & Pick Up in Minutes.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed">
          Select meals, book a designated pickup slot between lectures, and collect directly from the express counter with your unique token.
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 max-w-xl mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thali, samosa, cold brew, sandwiches..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-slate-100 focus:text-slate-900 placeholder:text-slate-400 rounded-2xl border border-white/20 focus:border-amber-500 focus:outline-none transition-all shadow-inner text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          {activeOrdersCount > 0 && (
            <button
              onClick={onViewOrders}
              className="px-5 py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-amber-900/30"
            >
              <Clock className="w-4 h-4" />
              <span>Track Active Order ({activeOrdersCount})</span>
            </button>
          )}
        </div>

        {/* Operational Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/15 text-xs text-slate-300">
          <div>
            <div className="text-slate-400 uppercase tracking-wider mb-0.5">Average Wait</div>
            <div className="text-base font-bold text-white font-mono tabular-nums">7–10 Mins</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider mb-0.5">Express Counters</div>
            <div className="text-base font-bold text-white">3 Active Lines</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider mb-0.5">Current Shift</div>
            <div className="text-base font-bold text-amber-300">Hot Lunch Menu</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider mb-0.5">Safety & Hygiene</div>
            <div className="text-base font-bold text-emerald-400">FSSAI Certified</div>
          </div>
        </div>
      </div>
    </div>
  );
};
