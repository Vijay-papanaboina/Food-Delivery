export const config = {
  userApiUrl: import.meta.env.VITE_USER_API_URL || 'http://localhost:3001',
  restaurantApiUrl: import.meta.env.VITE_RESTAURANT_API_URL || 'http://localhost:3003',
} as const;
