export const config = {
  userApiUrl: import.meta.env.VITE_USER_API_URL || "http://localhost:5005",
  restaurantApiUrl:
    import.meta.env.VITE_RESTAURANT_API_URL || "http://localhost:5006",
  orderApiUrl: import.meta.env.VITE_ORDER_API_URL || "http://localhost:5001",
  deliveryApiUrl:
    import.meta.env.VITE_DELIVERY_API_URL || "http://localhost:5004",
} as const;

