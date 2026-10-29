import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { StudentDashboard } from './components/StudentDashboard';
import { LiveQueueTracker } from './components/LiveQueueTracker';
import { StaffAndAdminPreview } from './components/StaffAndAdminPreview';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_STUDENT_PROFILE 
} from './data/mockData';
import { CartItem, MenuItem, Order, OrderStatus, StudentProfile } from './types';
import { CheckCircle2, Info, ArrowUp } from 'lucide-react';

const CART_STORAGE_KEY = 'collegebite_cart_v1';
const ORDERS_STORAGE_KEY = 'collegebite_orders_v1';
const PROFILE_STORAGE_KEY = 'collegebite_profile_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'queue' | 'orders' | 'profile' | 'staff_preview'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic state initialized from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (err) {
      console.error('Failed to save orders to localStorage', err);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(studentProfile));
    } catch (err) {
      console.error('Failed to save profile to localStorage', err);
    }
  }, [studentProfile]);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Cart calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  // Active orders count
  const activeOrdersCount = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  ).length;

  // Handlers
  const handleAddToCart = (item: MenuItem) => {
    if (!item.is_available || item.stock_quantity <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.menuItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.menuItem.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });

    showToast(`Added "${item.name}" to your tray`);
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedPromo(null);
  };

  const handleApplyPromo = (code: string): boolean => {
    if (code === 'STUDENT10') {
      setAppliedPromo('STUDENT10');
      showToast('10% student discount applied!');
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Deduct campus card balance if payment was campus_card
    if (newOrder.payment_method === 'campus_card') {
      setStudentProfile((prev) => ({
        ...prev,
        campus_card_balance: Math.max(0, prev.campus_card_balance - newOrder.total_amount),
      }));
    }
    setCartItems([]);
    setAppliedPromo(null);
  };

  const handleReorder = (order: Order) => {
    const reloadedCart: CartItem[] = [];
    order.items.forEach((itemSnapshot) => {
      const foundMenuItem = menuItems.find((m) => m.id === itemSnapshot.menu_item_id);
      if (foundMenuItem && foundMenuItem.is_available && foundMenuItem.stock_quantity > 0) {
        reloadedCart.push({
          menuItem: foundMenuItem,
          quantity: itemSnapshot.quantity,
        });
      }
    });

    if (reloadedCart.length > 0) {
      setCartItems(reloadedCart);
      setIsCartOpen(true);
      showToast(`Reordered ${reloadedCart.length} items from previous order`);
    } else {
      showToast('Selected items are currently sold out or unavailable.');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o))
    );
    showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
  };

  const handleToggleItemAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newAvailability = !item.is_available || item.stock_quantity <= 0;
          return {
            ...item,
            is_available: newAvailability,
            stock_quantity: newAvailability ? 35 : 0,
          };
        }
        return item;
      })
    );
  };

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800 selection:bg-amber-100 selection:text-amber-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        cartTotal={cartSubtotal}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: MENU & ORDER */}
        {activeTab === 'menu' && (
          <div>
            <HeroBanner
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeOrdersCount={activeOrdersCount}
              onViewOrders={() => setActiveTab('orders')}
            />

            <MenuSection
              categories={INITIAL_CATEGORIES}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              menuItems={menuItems}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
              onUpdateQuantity={handleUpdateQuantity}
              searchQuery={searchQuery}
            />
          </div>
        )}

        {/* TAB 2: LIVE QUEUE TIMES & ADVISORY */}
        {activeTab === 'queue' && (
          <LiveQueueTracker
            onOrderNow={() => {
              setActiveTab('menu');
              setSelectedCategory('all');
            }}
          />
        )}

        {/* TAB 3: STUDENT DASHBOARD (ORDERS & PROFILE) */}
        {(activeTab === 'orders' || activeTab === 'profile') && (
          <StudentDashboard
            studentProfile={studentProfile}
            orders={orders}
            onReorder={handleReorder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onBrowseMenu={() => setActiveTab('menu')}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {/* TAB 4: STAFF & ADMIN WORKFLOW PREVIEW */}
        {activeTab === 'staff_preview' && (
          <StaffAndAdminPreview
            orders={orders}
            menuItems={menuItems}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleItemAvailability={handleToggleItemAvailability}
          />
        )}
      </main>

      {/* Slide-over Shopping Cart */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      {/* Checkout & Slot Booking Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        studentProfile={studentProfile}
        appliedPromo={appliedPromo}
        onOrderCreated={handleOrderCreated}
        onViewOrderInDashboard={() => {
          setActiveTab('orders');
        }}
      />

      {/* Quiet, Anti-Slop Footer */}
      <footer className="mt-16 border-t border-amber-900/10 bg-white/70 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 text-sm tracking-tight">
              College<span className="text-amber-700">Bite</span>
            </span>
            <span>·</span>
            <span>Digital College Canteen Operations</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Counter 1: Meals</span>
            <span>·</span>
            <span>Counter 2: Snacks</span>
            <span>·</span>
            <span>Counter 3: Beverages</span>
          </div>

          <div className="text-slate-400">
            Phase 1 Frontend Verified · Ready for Supabase Phase 2
          </div>
        </div>
      </footer>
    </div>
  );
}
