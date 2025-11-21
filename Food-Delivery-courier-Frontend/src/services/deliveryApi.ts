import { config } from "@/config/env";
import { ApiService } from "./baseApi";
import type { Delivery, DriverStats } from "@/types";

// Delivery API Service
export class DeliveryApi extends ApiService {
  constructor() {
    super(config.deliveryApiUrl);
  }

  // Get deliveries for the logged-in driver
  getMyDeliveries = async (
    status?: string
  ): Promise<{ deliveries: Delivery[]; total: number }> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    const url = `/api/delivery-service/delivery${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.get<{ deliveries: Delivery[]; total: number; message: string }>(
      url
    );
  };

  // Mark delivery as picked up
  pickupDelivery = async (
    id: string,
    orderId: string,
    driverId: string
  ): Promise<{ message: string }> => {
    return this.post("/api/delivery-service/delivery/pickup", {
      deliveryId: id,
      orderId,
      driverId,
    });
  };

  // Mark delivery as completed
  completeDelivery = async (
    id: string,
    orderId: string,
    driverId: string
  ): Promise<{ message: string }> => {
    return this.post("/api/delivery-service/delivery/complete", {
      deliveryId: id,
      orderId,
      driverId,
    });
  };

  // Get driver stats
  getStats = async (): Promise<DriverStats> => {
    const response = await this.get<{ stats: DriverStats; message: string }>(
      "/api/delivery-service/delivery/stats"
    );
    return response.stats;
  };

  // Get full delivery details
  getDeliveryDetails = async (
    id: string
  ): Promise<{ message: string; delivery: Delivery }> => {
    return this.get<{ message: string; delivery: Delivery }>(
      `/api/delivery-service/delivery/${id}/details`
    );
  };

  // Toggle driver availability (online/offline)
  toggleMyAvailability = async (
    isAvailable: boolean
  ): Promise<{ message: string; isAvailable: boolean }> => {
    return this.patch<{ message: string; isAvailable: boolean }>(
      "/api/delivery-service/drivers/me/availability",
      { isAvailable }
    );
  };

  // Accept delivery request
  acceptDelivery = async (
    id: string
  ): Promise<{ message: string; deliveryId: string }> => {
    return this.post<{ message: string; deliveryId: string }>(
      `/api/delivery-service/delivery/${id}/accept`,
      {}
    );
  };

  // Decline delivery request
  declineDelivery = async (
    id: string,
    reason?: string
  ): Promise<{ message: string; deliveryId: string }> => {
    return this.post<{ message: string; deliveryId: string }>(
      `/api/delivery-service/delivery/${id}/decline`,
      { reason }
    );
  };
}

export const deliveryApi = new DeliveryApi();
