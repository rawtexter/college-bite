import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  QrCode, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Check,
  Smartphone,
  Flame,
  ChefHat
} from 'lucide-react';
import { Order, OrderStatus, StudentProfile, MenuItem } from '../types';

interface StudentDashboardProps {
  studentProfile: StudentProfile;
  orders: Order[];
  onReorder: (order: Order) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onBrowseMenu: () => void;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

const STATUS_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'pending', label: 'Received', desc: 'Order placed' },
  { status: 'confirmed', label: 'Accepted', desc: 'Slot locked' },
  { status: 'preparing', label: 'Cooking', desc: 'Kitchen active' },
  { status: 'ready', label: 'Ready', desc: 'Counter call' },
  { status: 'completed', label: 'Collected', desc: 'Enjoy meal' },
];

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentProfile,
  orders,
  onReorder,
  onUpdateOrderStatus,
  onBrowseMenu,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'profile_settings'>('orders');
  const [rechargeAmount, setRechargeAmount] = useState<number>(200);
  const [rechargeSuccess, setRechargeSuccess] = useState(false);

  // Active orders are those not completed or cancelled
  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );
  const pastOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  const getStatusIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const handleSimulateNextStage = (order: Order) => {
    const currentIndex = getStatusIndex(order.status);
    const nextStatusOrder: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'completed'];
    if (currentIndex < 4) {
      const nextStatus = nextStatusOrder[currentIndex] || 'completed';
      onUpdateOrderStatus(order.id, nextStatus);
    }
  };

  const handleSimulateRecharge = () => {
    onUpdateProfile({
      campus_card_balance: studentProfile.campus_card_balance + rechargeAmount,
    });
    setRechargeSuccess(true);
    setTimeout(() => setRechargeSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Card & Profile Strip */}
      <div className="bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm shadow-amber-950/20">
              {studentProfile.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">
                  {studentProfile.full_name}
                </h2>
                <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {studentProfile.student_id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {studentProfile.campus_block} · {studentProfile.email}
              </p>
            </div>
          </div>

          {/* Quick Metrics / Campus Card Balance */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 px-5 text-right">
              <span className="text-[11px] font-medium text-amber-900/70 block uppercase tracking-wider">
                Campus Card Balance
              </span>
              <div className="text-2xl font-black text-amber-950 font-mono tabular-nums">
                ₹{studentProfile.campus_card_balance.toFixed(0)}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Subtabs */}
        <div className="flex items-center gap-4 mt-6 pt-5 border-t border-slate-100 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile_settings')}
            className={`pb-1 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'profile_settings'
                ? 'border-amber-700 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Card Recharge & Dietary Settings
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <>
          {/* Active Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-700" />
                <h3 className="text-lg font-bold text-slate-900">
                  Active Pickup Orders ({activeOrders.length})
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Present token at counter when &ldquo;Ready&rdquo;
              </span>
            </div>

            {activeOrders.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-amber-900/10">
                <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No active orders right now</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Order lunch or snacks ahead of your next lecture break to collect without waiting in queue.
                </p>
                <button
                  onClick={onBrowseMenu}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Browse Canteen Menu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {activeOrders.map((order) => {
                  const currentIdx = getStatusIndex(order.status);
                  const isReady = order.status === 'ready';

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                        isReady
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                          : 'border-amber-900/15 shadow-sm'
                      }`}
                    >
                      {/* Top Banner with Token & Counter */}
                      <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-100/30 border-b border-amber-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="bg-slate-900 text-white p-3 px-4 rounded-2xl text-center shadow-md">
                            <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-widest">
                              Pickup Token
                            </span>
                            <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider">
                              {order.pickup_token}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                Counter {order.counter_number}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="text-xs font-medium text-amber-900 font-mono">
                                Slot: {order.pickup_slot}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Ref: {order.order_number} · Total: ₹{order.total_amount.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Status Simulator Action for Testing */}
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {currentIdx < 4 ? (
                            <button
                              onClick={() => handleSimulateNextStage(order)}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                              title="Click to simulate kitchen processing next stage"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>Simulate Next Stage ({STATUS_STEPS[currentIdx + 1]?.label})</span>
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                              Order Completed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 5-Step Status Timeline */}
                      <div className="p-6 border-b border-slate-100">
                        <div className="relative">
                          {/* Progress Line */}
                          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
                          <div
                            className="absolute top-4 left-6 h-0.5 bg-amber-600 transition-all duration-500 -z-0"
                            style={{
                              width: `${(Math.min(currentIdx, 3) / 3) * 88}%`,
                            }}
                          />

                          <div className="grid grid-cols-5 relative z-10 text-center">
                            {STATUS_STEPS.map((step, idx) => {
                              const isCompleted = idx < currentIdx;
                              const isCurrent = idx === currentIdx;

                              return (
                                <div key={step.status} className="flex flex-col items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                      isCompleted
                                        ? 'bg-amber-600 text-white'
                                        : isCurrent
                                        ? 'bg-slate-900 text-amber-300 ring-4 ring-amber-100'
                                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}
                                  >
                                    {isCompleted ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <div className="mt-2 text-xs font-bold text-slate-800">
                                    {step.label}
                                  </div>
                                  <div className="text-[10px] text-slate-400 hidden sm:block">
                                    {step.desc}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {isReady && (
                          <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                                #{order.pickup_token.replace('CB-', '')}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-emerald-950">
                                  Ready at Counter {order.counter_number}!
                                </h5>
                                <p className="text-[11px] text-emerald-800">
                                  Your hot food is packed. Show your token to staff to collect.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                            >
                              Mark Collected
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Items List Inside Order */}
                      <div className="p-6 bg-slate-50/50">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Order Contents
                        </div>
                        <div className="divide-y divide-slate-100">
                          {order.items.map((item, i) => (
                            <div key={i} className="py-2 flex items-center justify-between text-xs">
                              <span className="font-medium text-slate-800">
                                {item.quantity}x {item.item_name_snapshot}
                              </span>
                              <span className="font-mono text-slate-600 tabular-nums">
                                ₹{item.line_total.toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>
                        {order.special_instructions && (
                          <div className="mt-3 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
                            <strong>Note:</strong> {order.special_instructions}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Orders Section with Reorder */}
          <div className="space-y-4 pt-6">
            <h3 className="text-lg font-bold text-slate-900">
              Order History & Quick Reorder
            </h3>

            {pastOrders.length === 0 ? (
              <p className="text-xs text-slate-400">No past orders yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-amber-900/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="font-mono">{order.order_number}</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>

                      <div className="text-sm font-bold text-slate-900 mb-2">
                        {order.items.map((i) => `${i.quantity}x ${i.item_name_snapshot}`).join(', ')}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <span>Paid via {order.payment_method.toUpperCase()}</span>
                        <span>·</span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          ₹{order.total_amount.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md">
                        Completed
                      </span>
                      <button
                        onClick={() => onReorder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reorder Tray</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Settings & Campus Card Recharge Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Recharge */}
          <div className="p-6 bg-white rounded-3xl border border-amber-900/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Campus Card Top-Up</h4>
                <p className="text-xs text-slate-500">
                  Instant balance for 1-tap checkout at canteen
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
              <span className="text-xs text-slate-600">Current Balance:</span>
              <span className="text-xl font-black font-mono text-slate-900">
                ₹{studentProfile.campus_card_balance.toFixed(2)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Quick Recharge Amount (INR)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[100, 200, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setRechargeAmount(amt)}
                    className={`py-2 text-xs font-bold font-mono rounded-xl border cursor-pointer transition-colors ${
                      rechargeAmount === amt
                        ? 'bg-amber-800 text-white border-amber-800'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSimulateRecharge}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Simulate Top-Up +₹{rechargeAmount}
              </button>

              {rechargeSuccess && (
                <p className="text-xs text-emerald-700 text-center mt-2 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Card recharged successfully!</span>
                </p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="p-6 bg-white rounded-3xl border border-amber-900/10 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Dietary & Notification Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Vegetarian Items by Default
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Prioritize vegetarian meals on main menu
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={studentProfile.dietary_preference === 'veg_only'}
                  onChange={(e) =>
                    onUpdateProfile({
                      dietary_preference: e.target.checked ? 'veg_only' : 'all',
                    })
                  }
                  className="rounded text-amber-700 focus:ring-amber-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Pickup Token Ready Notifications
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Receive alert when kitchen status turns to &ldquo;Ready&rdquo;
                  </div>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-amber-700 focus:ring-amber-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
