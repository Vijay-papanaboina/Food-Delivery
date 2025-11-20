// API Response types for backend data transformation
export interface BackendRestaurant {
  restaurantId: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string;
  rating: string;
  deliveryTime: string;
  deliveryFee: string;
  isActive: boolean;
  isOpen: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface BackendMenuItem {
  itemId: string;
  restaurantId: string;
  name: string;
  description: string;
  price: string;
  category: string;
  isAvailable: boolean;
  preparationTime?: number;
  imageUrl?: string;
  createdAt: string;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendAddress {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BackendOrder {
  id: string;
  restaurantId: string;
  userId: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
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
  updatedAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
}

export interface BackendPayment {
  paymentId: string;
  orderId: string;
  amount: string;
  method: string;
  userId: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface BackendDelivery {
  deliveryId: string;
  orderId: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  vehicle: string;
  licensePlate: string;
  status: string;
  assignedAt?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
}
