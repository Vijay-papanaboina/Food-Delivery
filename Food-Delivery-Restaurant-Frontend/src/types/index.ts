export interface KitchenOrder {
  id: string;
  restaurantId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "received" | "preparing" | "ready" | "completed" | "cancelled";
  receivedAt: string;
  startedAt?: string;
  estimatedReadyTime?: string;
  readyAt?: string;
  preparationTime?: number;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  special_instructions?: string;
}

export interface OrderHistory {
  id: string;
  restaurantId: string;
  userId: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  items: OrderItem[];
}

export interface OrderStats {
  todayOrders: number;
  todayRevenue: string;
  averagePreparationTime: number;
}

export interface MenuItem {
  id: string;
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
  id: string;
  ownerId: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  rating: string;
  deliveryTime: string;
  deliveryFee: string;
  isOpen: boolean;
  openingTime?: string;
  closingTime?: string;
  isActive: boolean;
  createdAt: string;
}

export interface OrderFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}
