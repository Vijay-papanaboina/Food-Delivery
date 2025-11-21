import { config } from "@/config/env";
import { ApiService } from "./baseApi";
import type {
  KitchenOrder,
  OrderHistory,
  OrderStats,
  OrderFilters,
} from "@/types";

export class OrdersApi extends ApiService {
  constructor() {
    super(config.restaurantApiUrl);
  }

  getKitchenOrders = async (
    status?: string
  ): Promise<{ orders: KitchenOrder[] }> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    return this.get(
      `/api/restaurant-service/kitchen/orders?${params.toString()}`
    );
  };

  getOrderHistory = async (
    restaurantId: string,
    filters?: OrderFilters
  ): Promise<{ orders: OrderHistory[]; total: number }> => {
    const params = new URLSearchParams();
    params.append("restaurantId", restaurantId);

    if (filters?.status) params.append("status", filters.status);
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.limit) params.append("limit", filters.limit.toString());

    // Use order service for order history
    const orderApiUrl = config.userApiUrl.replace("5005", "5001");
    return this.get(
      `${orderApiUrl}/api/order-service/orders?${params.toString()}`
    );
  };

  markOrderReady = async (id: string): Promise<{ message: string }> => {
    return this.post(`/api/restaurant-service/kitchen/orders/${id}/ready`);
  };

  getOrderStats = async (restaurantId: string): Promise<OrderStats> => {
    // Use order service for restaurant-specific stats
    const orderApiUrl = config.userApiUrl.replace("5005", "5001");
    const response = await this.get<{ message: string; stats: OrderStats }>(
      `${orderApiUrl}/api/order-service/orders/restaurant/${restaurantId}/stats`
    );
    return response.stats;
  };
}

export const ordersApi = new OrdersApi();
