import { config } from "@/config/env";
import { ApiService } from "./baseApi";
import type { Restaurant, MenuItem } from "@/types";

export class RestaurantApi extends ApiService {
  constructor() {
    super(config.restaurantApiUrl);
  }

  getRestaurantProfile = async (restaurantId: string): Promise<Restaurant> => {
    return this.get(`/api/restaurant-service/restaurants/${restaurantId}`);
  };

  getMyRestaurant = async (): Promise<{ restaurant: Restaurant }> => {
    return this.get("/api/restaurant-service/restaurants/my-restaurant");
  };

  updateRestaurantStatus = async (
    restaurantId: string,
    isOpen: boolean
  ): Promise<{ message: string; restaurantId: string; isOpen: boolean }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${restaurantId}/status`,
      {
        isOpen: isOpen,
      }
    );
  };

  getMenuItems = async (
    restaurantId: string
  ): Promise<{ menu: MenuItem[] }> => {
    return this.get(`/api/restaurant-service/restaurants/${restaurantId}/menu`);
  };

  updateMenuItemAvailability = async (
    restaurantId: string,
    itemId: string,
    isAvailable: boolean
  ): Promise<{ message: string; itemId: string; isAvailable: boolean }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${itemId}/availability`,
      {
        isAvailable: isAvailable,
      }
    );
  };

  addMenuItem = async (
    restaurantId: string,
    itemData: Partial<MenuItem>
  ): Promise<{ message: string; menuItem: MenuItem }> => {
    return this.post(
      `/api/restaurant-service/restaurants/${restaurantId}/menu`,
      itemData
    );
  };

  updateMenuItem = async (
    restaurantId: string,
    itemId: string,
    itemData: Partial<MenuItem>
  ): Promise<{ message: string; menuItem: MenuItem }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${itemId}`,
      itemData
    );
  };

  deleteMenuItem = async (
    restaurantId: string,
    itemId: string
  ): Promise<{ message: string }> => {
    return this.delete(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${itemId}`
    );
  };
}

export const restaurantApi = new RestaurantApi();
