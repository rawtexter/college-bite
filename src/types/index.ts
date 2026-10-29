export type DietaryType = 'Veg' | 'Non-Veg' | 'Vegan' | 'Gluten-Free' | 'High-Protein';

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  dietary_labels: DietaryType[];
  preparation_time_minutes: number;
  stock_quantity: number;
  is_available: boolean;
  calories?: number;
  counter_number: number;
  rating?: number;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customNote?: string;
}

export interface PickupSlot {
  id: string;
  timeWindow: string;
  displayTime: string;
  rushLevel: 'Low' | 'Moderate' | 'Peak Rush';
  remainingCapacity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItemSnapshot {
  menu_item_id: string;
  item_name_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
}

export interface StudentInfo {
  fullName: string;
  studentId: string;
  phone: string;
  campusBlock: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  applicable_charges: {
    packagingFee: number;
    taxes: number;
  };
  discount_amount?: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_method: 'upi' | 'campus_card' | 'card' | 'counter_cash';
  pickup_token: string;
  pickup_slot: string;
  counter_number: number;
  student_info: StudentInfo;
  items: OrderItemSnapshot[];
  special_instructions?: string;
  created_at: string;
  updated_at: string;
  estimated_pickup_time: string;
}

export interface StudentProfile {
  id: string;
  full_name: string;
  student_id: string;
  email: string;
  phone: string;
  campus_block: string;
  campus_card_balance: number;
  dietary_preference: 'all' | 'veg_only';
}
