import { config } from "@/config/env";
import type { Restaurant, MenuItem, RestaurantFilters } from "@/types";
import { ApiService } from "./baseApi";

// Restaurant API
export class RestaurantApi extends ApiService {
  constructor() {
    super(config.restaurantApiUrl);
  }

  getRestaurants = async (
    filters?: RestaurantFilters
  ): Promise<{
    message: string;
    restaurants: Restaurant[];
  }> => {
    const queryParams = new URLSearchParams();

    if (filters?.search) queryParams.append("search", filters.search);
    if (filters?.cuisine) queryParams.append("cuisine", filters.cuisine);
    if (filters?.minRating)
      queryParams.append("minRating", filters.minRating.toString());
    if (filters?.maxDeliveryTime)
      queryParams.append("maxDeliveryTime", filters.maxDeliveryTime.toString());
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) queryParams.append("sortOrder", filters.sortOrder);

    const queryString = queryParams.toString();
    const url = queryString
      ? `/api/restaurant-service/restaurants?${queryString}`
      : "/api/restaurant-service/restaurants";

    const result = await this.get<{
      message: string;
      restaurants: Restaurant[];
    }>(url);

    return {
      message: result.message,
      restaurants: result.restaurants,
    };
  };

  getRestaurant = async (
    restaurantId: string
  ): Promise<{
    message: string;
    restaurant: Restaurant;
  }> => {
    const result = await this.get<{
      message: string;
      restaurant: Restaurant;
    }>(`/api/restaurant-service/restaurants/${restaurantId}`);

    return {
      message: result.message,
      restaurant: result.restaurant,
    };
  };

  getRestaurantMenu = async (
    restaurantId: string,
    category?: string
  ): Promise<MenuItem[]> => {
    const params = category ? `?category=${category}` : "";
    const response = await this.get<{
      message: string;
      menu: MenuItem[];
    }>(`/api/restaurant-service/restaurants/${restaurantId}/menu${params}`);

    // Backend already returns camelCase, so return directly
    return response.menu;
  };

  getMenuItem = async (itemId: string): Promise<MenuItem> => {
    const result = await this.get<{ message: string; item: MenuItem }>(
      `/api/restaurant-service/menu-items/${itemId}`
    );

    return result.item;
  };

  validateMenuItems = async (
    restaurantId: string,
    items: Array<{ id: string; quantity: number }>
  ): Promise<{ valid: boolean; items: MenuItem[]; errors?: string[] }> => {
    return this.post<{ valid: boolean; items: MenuItem[]; errors?: string[] }>(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/validate`,
      { items }
    );
  };
}
