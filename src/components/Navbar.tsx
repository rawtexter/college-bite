import React from 'react';
import { ShoppingBag, Clock, User, UtensilsCrossed, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'menu' | 'queue' | 'orders' | 'profile' | 'staff_preview';
  setActiveTab: (tab: 'menu' | 'queue' | 'orders' | 'profile' | 'staff_preview') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-amber-900/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('menu')}
              className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-sm shadow-amber-900/20 group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5 text-amber-100" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                College<span className="text-amber-700">Bite</span>
              </span>
            </button>
            <span className="hidden sm:inline-block text-xs font-medium text-amber-900/60 bg-amber-100/60 border border-amber-200/50 px-2 py-0.5 rounded-full whitespace-nowrap">
              College Canteen
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('menu')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'menu'
                  ? 'text-amber-800 border-amber-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Menu & Order
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'text-amber-800 border-amber-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-700" />
              Live Queue Times
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-amber-800 border-amber-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              My Orders & Token
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`hover:text-amber-800 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'text-amber-800 border-amber-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              <User className="w-4 h-4 text-slate-500" />
              Student Profile
            </button>
            <button
              onClick={() => setActiveTab('staff_preview')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 text-xs px-2.5 py-1 rounded-md border border-slate-300/80 cursor-pointer ${
                activeTab === 'staff_preview'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Preview staff & kitchen order dispatch screen"
            >
              Staff Preview
            </button>
          </nav>

          {/* Zone 3: Primary Action (Cart CTA) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 active:bg-amber-900 rounded-xl shadow-sm shadow-amber-900/20 transition-all cursor-pointer whitespace-nowrap shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-100 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Tray</span>
              {cartCount > 0 ? (
                <span className="inline-flex items-center gap-1 bg-amber-900/60 px-2 py-0.5 rounded-full text-xs font-mono tabular-nums text-white">
                  <span>{cartCount}</span>
                  <span className="text-amber-300">·</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </span>
              ) : (
                <span className="text-xs text-amber-200/90 font-normal">Empty</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-amber-900/10 px-2 py-2 bg-[#FAF7F2] text-xs">
        <button
          onClick={() => setActiveTab('menu')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'menu' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Menu
        </button>
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'queue' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Live Queue
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'orders' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600'
          }`}
        >
          Profile
        </button>
      </div>
    </header>
  );
};
