// User & Auth Types
export interface User {
  userId: string;
  email: string;
  name: string;
  role: "driver";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: BackendUser;
}

export interface RefreshResponse {
  accessToken: string;
  user: BackendUser;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Delivery Types
export interface Delivery {
  deliveryId: string;
  orderId: string;
  driverId: string;
  driverName?: string;
  driverPhone?: string;
  vehicle?: string;
  licensePlate?: string;
  status: "assigned" | "picked_up" | "completed";
  assignedAt: string;
  pickedUpAt?: string;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  createdAt: string;
  deliveryAddress?: DeliveryAddress;
  restaurantAddress?: DeliveryAddress;
  customerName?: string;
  customerPhone?: string;
  // Gig-worker model fields
  acceptanceStatus?: "pending" | "accepted" | "declined";
  deliveryFee?: number;
  declinedByDrivers?: string[];
  // Restaurant information
  restaurantId?: string;
  restaurantName?: string;
  restaurantPhone?: string;
  // Order information
  orderItems?: OrderItem[];
  orderTotal?: number;
}

// Order Item Types
export interface OrderItem {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

// Driver Stats Types
export interface DriverStats {
  totalDeliveries: number;
  completedToday: number;
  averageRating: string;
  earnings: string;
}

// Driver Types
export interface Driver {
  driverId: string;
  userId: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  isAvailable: boolean;
  rating: string;
  totalDeliveries: number;
  createdAt: string;
}
