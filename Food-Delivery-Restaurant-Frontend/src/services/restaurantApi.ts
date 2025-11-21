import { config } from "@/config/env";
import { ApiService } from "./baseApi";
import type { Restaurant, MenuItem } from "@/types";

export class RestaurantApi extends ApiService {
  constructor() {
    super(config.restaurantApiUrl);
  }

  getRestaurantProfile = async (id: string): Promise<Restaurant> => {
    return this.get(`/api/restaurant-service/restaurants/${id}`);
  };

  getMyRestaurant = async (): Promise<{ restaurant: Restaurant }> => {
    return this.get("/api/restaurant-service/restaurants/my-restaurant");
  };

  updateRestaurantStatus = async (
    id: string,
    isOpen: boolean
  ): Promise<{ message: string; restaurantId: string; isOpen: boolean }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${id}/status`,
      {
        isOpen: isOpen,
      }
    );
  };

  getMenuItems = async (
    id: string
  ): Promise<{ menu: MenuItem[] }> => {
    return this.get(`/api/restaurant-service/restaurants/${id}/menu`);
  };

  updateMenuItemAvailability = async (
    restaurantId: string,
    id: string,
    isAvailable: boolean
  ): Promise<{ message: string; itemId: string; isAvailable: boolean }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${id}/availability`,
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
    id: string,
    itemData: Partial<MenuItem>
  ): Promise<{ message: string; menuItem: MenuItem }> => {
    return this.put(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${id}`,
      itemData
    );
  };

  deleteMenuItem = async (
    restaurantId: string,
    id: string
  ): Promise<{ message: string }> => {
    return this.delete(
      `/api/restaurant-service/restaurants/${restaurantId}/menu/${id}`
    );
  };
}

export const restaurantApi = new RestaurantApi();
