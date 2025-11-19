export interface KitchenOrder {
  order_id: string;
  restaurant_id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: "received" | "preparing" | "ready" | "completed" | "cancelled";
  received_at: string;
  started_at?: string;
  estimated_ready_time?: string;
  ready_at?: string;
  preparation_time?: number;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface OrderHistory {
  order_id: string;
  restaurant_id: string;
  user_id: string;
  delivery_address_json: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  confirmed_at?: string;
  delivered_at?: string;
  items: OrderItem[];
}

export interface OrderStats {
  todayOrders: number;
  todayRevenue: string;
  averagePreparationTime: number;
}

export interface MenuItem {
  itemId: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  imageUrl?: string;
  createdAt: string;
}

export interface Restaurant {
  restaurant_id: string;
  owner_id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  rating: string;
  delivery_time: string;
  delivery_fee: string;
  is_open: boolean;
  opening_time?: string;
  closing_time?: string;
  is_active: boolean;
  created_at: string;
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
