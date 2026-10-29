import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  CreditCard, 
  Wallet, 
  Banknote, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Store,
  Sparkles,
  Loader2
} from 'lucide-react';
import { CartItem, Order, PickupSlot, StudentInfo, StudentProfile } from '../types';
import { INITIAL_PICKUP_SLOTS } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  studentProfile: StudentProfile;
  appliedPromo: string | null;
  onOrderCreated: (order: Order) => void;
  onViewOrderInDashboard: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  studentProfile,
  appliedPromo,
  onOrderCreated,
  onViewOrderInDashboard,
}) => {
  // Form State
  const [fullName, setFullName] = useState(studentProfile.full_name);
  const [studentId, setStudentId] = useState(studentProfile.student_id);
  const [phone, setPhone] = useState(studentProfile.phone);
  const [campusBlock, setCampusBlock] = useState(studentProfile.campus_block);
  const [selectedSlotId, setSelectedSlotId] = useState(INITIAL_PICKUP_SLOTS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'campus_card' | 'card' | 'counter_cash'>('upi');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Checkout Stages: 'form' | 'processing' | 'confirmed' | 'failed'
  const [stage, setStage] = useState<'form' | 'processing' | 'confirmed' | 'failed'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );
  const packagingFee = 10;
  const taxes = subtotal * 0.05;
  const discount = appliedPromo === 'STUDENT10' ? subtotal * 0.1 : 0;
  const totalAmount = Math.max(0, subtotal + packagingFee + taxes - discount);

  const selectedSlot = INITIAL_PICKUP_SLOTS.find((s) => s.id === selectedSlotId) || INITIAL_PICKUP_SLOTS[0];

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your full name.';
    if (!studentId.trim()) errs.studentId = 'Student Roll or ID is required.';
    if (!phone.trim()) {
      errs.phone = 'Contact number is required for SMS/Pickup.';
    } else if (phone.replace(/[^0-9]/g, '').length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number.';
    }
    if (!selectedSlotId) errs.slot = 'Please select a pickup time slot.';

    if (paymentMethod === 'campus_card' && studentProfile.campus_card_balance < totalAmount) {
      errs.payment = `Insufficient campus card balance (₹${studentProfile.campus_card_balance.toFixed(0)} available, ₹${totalAmount.toFixed(0)} required).`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = () => {
    if (!validateForm()) return;

    setStage('processing');

    // Simulate backend verification & slot reservation
    setTimeout(() => {
      const orderTokenNumber = Math.floor(100 + Math.random() * 900);
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        order_number: `CB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        user_id: studentProfile.id,
        status: 'confirmed',
        subtotal,
        applicable_charges: {
          packagingFee,
          taxes,
        },
        discount_amount: discount > 0 ? discount : undefined,
        total_amount: totalAmount,
        payment_status: paymentMethod === 'counter_cash' ? 'pending' : 'completed',
        payment_method: paymentMethod,
        pickup_token: `CB-${orderTokenNumber}`,
        pickup_slot: selectedSlot.timeWindow,
        counter_number: cartItems[0]?.menuItem.counter_number || 1,
        student_info: {
          fullName,
          studentId,
          phone,
          campusBlock,
        },
        items: cartItems.map((ci) => ({
          menu_item_id: ci.menuItem.id,
          item_name_snapshot: ci.menuItem.name,
          unit_price_snapshot: ci.menuItem.price,
          quantity: ci.quantity,
          line_total: ci.menuItem.price * ci.quantity,
        })),
        special_instructions: specialInstructions.trim() || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        estimated_pickup_time: selectedSlot.timeWindow,
      };

      setCreatedOrder(newOrder);
      onOrderCreated(newOrder);
      setStage('confirmed');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden my-6">
        
        {/* Processing State */}
        {stage === 'processing' && (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-amber-700 animate-spin" />
            <h3 className="text-lg font-bold text-slate-900">
              Securing Kitchen Slot & Generating Token...
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Validating capacity for Counter 1, preparing live ticket, and creating demo payment authorization.
            </p>
          </div>
        )}

        {/* Confirmation State */}
        {stage === 'confirmed' && createdOrder && (
          <div className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Demo Order Confirmed (Phase 1 Simulation)
            </span>

            <h3 className="text-2xl font-black text-slate-900 mt-3 mb-1">
              Your Pickup Token is Ready
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              Show this token number or scan the QR code at the counter during your booked time slot.
            </p>

            {/* Token Badge Card */}
            <div className="max-w-xs mx-auto p-6 bg-gradient-to-b from-amber-500/10 to-amber-700/10 rounded-2xl border-2 border-dashed border-amber-600/40 text-center mb-6">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-900 mb-1">
                Express Pickup Token
              </div>
              <div className="text-4xl sm:text-5xl font-black font-mono text-amber-950 tracking-wider my-2">
                {createdOrder.pickup_token}
              </div>
              <div className="text-xs text-amber-900/80 font-medium">
                Counter {createdOrder.counter_number} · Slot: {createdOrder.pickup_slot}
              </div>
            </div>

            {/* Order Details Brief */}
            <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl max-w-md mx-auto space-y-1 mb-8 text-left">
              <div className="flex justify-between">
                <span>Order Reference:</span>
                <span className="font-mono font-medium text-slate-800">{createdOrder.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Student Name:</span>
                <span className="font-medium text-slate-800">{createdOrder.student_info.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{createdOrder.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-medium text-slate-800 uppercase">{createdOrder.payment_method} (Simulated)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onViewOrderInDashboard();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Live on Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Return to Menu
              </button>
            </div>
          </div>
        )}

        {/* Form State */}
        {stage === 'form' && (
          <div>
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Checkout & Slot Reservation</h3>
                <p className="text-xs text-slate-500">
                  Pre-order to skip the lunch queue at the college canteen
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice for Phase 1 */}
            <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200/60 flex items-center gap-2 text-xs text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Phase 1 Demo Mode:</strong> Realistic checkout and token generation. Supabase and Razorpay will be hooked up in Phases 2, 3 & 4.
              </span>
            </div>

            <div className="p-6 max-w-full space-y-6 max-h-[75vh] overflow-y-auto">
              {/* 1. Student Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Student Identification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                    />
                    {errors.fullName && <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Roll Number / Student ID *
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. CS-2024-089"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white uppercase font-mono"
                    />
                    {errors.studentId && <p className="text-[11px] text-red-600 mt-1">{errors.studentId}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number (for Ready SMS/Alert) *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white font-mono"
                    />
                    {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Department / Hostel Block
                    </label>
                    <input
                      type="text"
                      value={campusBlock}
                      onChange={(e) => setCampusBlock(e.target.value)}
                      placeholder="e.g. Engineering Block B"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Pickup Slot Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    2. Select Pickup Time Slot
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Reduces counter waiting time
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {INITIAL_PICKUP_SLOTS.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {slot.timeWindow}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              slot.rushLevel === 'Low'
                                ? 'bg-emerald-100 text-emerald-800'
                                : slot.rushLevel === 'Moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {slot.rushLevel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{slot.displayTime}</span>
                          <span className="font-mono text-slate-600">
                            {slot.remainingCapacity} tokens left
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.slot && <p className="text-[11px] text-red-600">{errors.slot}</p>}
              </div>

              {/* 3. Payment Method */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  3. Payment Method (Demo Flow)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* UPI */}
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <QrCode className="w-4 h-4 text-amber-700" />
                        <span>UPI (GPay / PhonePe / QR)</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Fastest counter clearance</span>
                    </div>
                  </label>

                  {/* Campus Student Card */}
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'campus_card'
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="campus_card"
                      checked={paymentMethod === 'campus_card'}
                      onChange={() => setPaymentMethod('campus_card')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Wallet className="w-4 h-4 text-emerald-700" />
                        <span>Campus Student Card</span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Balance: ₹{studentProfile.campus_card_balance.toFixed(0)}
                      </span>
                    </div>
                  </label>

                  {/* Debit / Credit Cards */}
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <CreditCard className="w-4 h-4 text-indigo-700" />
                        <span>Credit / Debit Card</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Visa / Mastercard / RuPay</span>
                    </div>
                  </label>

                  {/* Pay at Counter */}
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'counter_cash'
                        ? 'border-amber-600 bg-amber-50/70 ring-1 ring-amber-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="counter_cash"
                      checked={paymentMethod === 'counter_cash'}
                      onChange={() => setPaymentMethod('counter_cash')}
                      className="text-amber-700 focus:ring-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Banknote className="w-4 h-4 text-slate-700" />
                        <span>Pay at Counter</span>
                      </div>
                      <span className="text-[11px] text-slate-500">Cash / Counter POS on pickup</span>
                    </div>
                  </label>
                </div>
                {errors.payment && <p className="text-[11px] text-red-600">{errors.payment}</p>}
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Kitchen Notes / Dietary Requests (Optional)
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Extra green chutney, less spicy, pack separately"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-600 focus:bg-white"
                />
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-900/10 space-y-2">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Order Items ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="font-mono tabular-nums text-amber-900">
                    Total: ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  {cartItems.map((ci) => (
                    <div key={ci.menuItem.id} className="flex justify-between text-[11px]">
                      <span>{ci.quantity}x {ci.menuItem.name}</span>
                      <span className="font-mono tabular-nums">₹{(ci.menuItem.price * ci.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="p-5 bg-white border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Total Payable</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>Confirm & Generate Token</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
