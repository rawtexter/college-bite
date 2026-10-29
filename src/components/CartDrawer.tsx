import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedPromo: string | null;
  onApplyPromo: (code: string) => boolean;
  onRemovePromo: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedPromo,
  onApplyPromo,
  onRemovePromo,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const packagingFee = cartItems.length > 0 ? 10 : 0; // ₹10 eco-friendly meal box fee
  const gst = subtotal > 0 ? subtotal * 0.05 : 0; // 5% GST on canteen food
  const discount = appliedPromo === 'STUDENT10' ? subtotal * 0.1 : 0;
  const estimatedTotal = Math.max(0, subtotal + packagingFee + gst - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (!promoInput.trim()) return;
    const success = onApplyPromo(promoInput.trim().toUpperCase());
    if (success) {
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon. Try "STUDENT10" for 10% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-amber-900/15">
          {/* Header */}
          <div className="p-5 border-b border-amber-900/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-900">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Canteen Tray</h2>
                <p className="text-xs text-slate-500">
                  {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close tray"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-100/70 flex items-center justify-center text-amber-800 mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your tray is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Add wholesome hot meals, quick samosas, fresh beverages, or desserts from the campus canteen menu.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Explore Today&rsquo;s Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 text-xs text-slate-500">
                  <span>Selected items for pickup</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Clear Tray
                  </button>
                </div>

                {cartItems.map(({ menuItem, quantity }) => (
                  <div
                    key={menuItem.id}
                    className="p-3.5 bg-white rounded-xl border border-amber-900/10 shadow-xs flex items-center gap-3"
                  >
                    <img
                      src={menuItem.image_url}
                      alt={menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover shrink-0 bg-slate-100"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {menuItem.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(menuItem.id)}
                          className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 mb-2">
                        <span>Counter {menuItem.counter_number}</span>
                        <span aria-hidden="true" className="mx-1">·</span>
                        <span className="font-mono tabular-nums">₹{menuItem.price} each</span>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 rounded-lg p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(menuItem.id, -1)}
                            className="w-6 h-6 rounded bg-white text-amber-950 flex items-center justify-center hover:bg-amber-100 shadow-2xs cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold font-mono tabular-nums text-amber-950">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(menuItem.id, 1)}
                            className="w-6 h-6 rounded bg-amber-700 text-white flex items-center justify-center hover:bg-amber-800 shadow-2xs cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                          ₹{(menuItem.price * quantity).toFixed(0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Promo Code Input */}
                <div className="pt-2">
                  {appliedPromo ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Code <strong className="font-mono">{appliedPromo}</strong> applied (-10% Student Offer)</span>
                      </div>
                      <button
                        onClick={onRemovePromo}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="space-y-1">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={promoInput}
                            onChange={(e) => setPromoInput(e.target.value)}
                            placeholder="Promo (use STUDENT10)"
                            className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-amber-900/15 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 uppercase font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-red-600">{promoError}</p>
                      )}
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Calculations and Proceed CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-white border-t border-amber-900/10 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-slate-800">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Eco-friendly packaging fee</span>
                  <span className="font-mono tabular-nums text-slate-800">
                    ₹{packagingFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Canteen GST (5%)</span>
                  <span className="font-mono tabular-nums text-slate-800">
                    ₹{gst.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Student Discount (10%)</span>
                    <span className="font-mono tabular-nums">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline text-sm font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-lg font-mono tabular-nums text-amber-900">
                    ₹{estimatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white font-bold rounded-xl shadow-md shadow-amber-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Reserve your slot & pick up without waiting in line
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
