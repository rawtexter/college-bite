import React, { useState } from 'react';
import { 
  ChefHat, 
  Shield, 
  Check, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Layers, 
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { MenuItem, Order, OrderStatus } from '../types';

interface StaffAndAdminPreviewProps {
  orders: Order[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onToggleItemAvailability: (itemId: string) => void;
}

export const StaffAndAdminPreview: React.FC<StaffAndAdminPreviewProps> = ({
  orders,
  menuItems,
  onUpdateOrderStatus,
  onToggleItemAvailability,
}) => {
  const [viewMode, setViewMode] = useState<'staff' | 'admin'>('staff');
  const [counterFilter, setCounterFilter] = useState<number | 'all'>('all');

  const filteredOrders = orders.filter((o) => {
    if (counterFilter !== 'all' && o.counter_number !== counterFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Switcher Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Shield className="w-4 h-4" />
            <span>Role-Based Portal Architecture (Phases 1–3 Preview)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {viewMode === 'staff' ? 'Canteen Kitchen & Counter Staff Terminal' : 'Canteen Admin Management Console'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            In Phase 1, explore the operational workflows. In Phases 2–4, Supabase Auth and Row Level Security will secure these panels per role.
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 rounded-2xl border border-white/15">
          <button
            onClick={() => setViewMode('staff')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'staff'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen Staff View</span>
          </button>
          <button
            onClick={() => setViewMode('admin')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      {viewMode === 'staff' ? (
        /* KITCHEN STAFF VIEW */
        <div className="space-y-6">
          {/* Counter Filter Tabs */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
                Filter by Counter:
              </span>
              {[
                { id: 'all', label: 'All Counters' },
                { id: 1, label: 'Counter 1 (Meals)' },
                { id: 2, label: 'Counter 2 (Snacks)' },
                { id: 3, label: 'Counter 3 (Brews & Bakery)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCounterFilter(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    counterFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500 hidden sm:block">
              {filteredOrders.length} live kitchen tickets
            </span>
          </div>

          {/* Kitchen Order Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const isReady = order.status === 'ready';
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xs ${
                    isReady
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : isCompleted
                      ? 'border-slate-200 opacity-60'
                      : 'border-amber-900/15'
                  }`}
                >
                  {/* Order Ticket Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400 font-mono">
                        {order.order_number}
                      </div>
                      <div className="text-lg font-black font-mono text-slate-900">
                        Token: {order.pickup_token}
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          order.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : order.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-900'
                            : order.status === 'preparing'
                            ? 'bg-purple-100 text-purple-900'
                            : order.status === 'ready'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>
                      <div className="text-[11px] text-slate-500 font-medium mt-1">
                        Slot: {order.pickup_slot}
                      </div>
                    </div>
                  </div>

                  {/* Customer info & Counter */}
                  <div className="p-4 flex-1">
                    <div className="text-xs text-slate-600 mb-2 flex items-center justify-between">
                      <span className="font-semibold">{order.student_info.fullName}</span>
                      <span className="font-mono text-slate-400">{order.student_info.studentId}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Kitchen Items (Counter {order.counter_number}):
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="font-bold text-slate-900">
                            {item.quantity}x {item.item_name_snapshot}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.special_instructions && (
                      <div className="p-2 bg-amber-50 rounded-lg text-xs text-amber-900 border border-amber-200">
                        <strong>Student Note:</strong> {order.special_instructions}
                      </div>
                    )}
                  </div>

                  {/* Staff Action Buttons */}
                  <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                    {order.status !== 'ready' && order.status !== 'completed' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'ready')}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                      >
                        Mark Ready for Pickup
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'completed')}
                        className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer text-center"
                      >
                        Handover & Complete
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <span className="text-xs text-emerald-700 font-semibold mx-auto">
                        Delivered to Student
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ADMIN MANAGEMENT VIEW */
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Menu Inventory & Availability Management
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Toggle kitchen item availability in real-time. Sold-out items are instantly marked on student devices to prevent backorders.
            </p>

            <div className="divide-y divide-slate-100">
              {menuItems.map((item) => {
                const isAvailable = item.is_available && item.stock_quantity > 0;
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">
                          Counter {item.counter_number} · ₹{item.price} · {item.dietary_labels.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isAvailable ? 'In Stock' : 'Sold Out'}
                      </span>

                      <button
                        onClick={() => onToggleItemAvailability(item.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                          isAvailable
                            ? 'border-rose-300 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
