import { config } from "@/config/env";
import { logger } from "@/lib/logger";
import type { User, DeliveryAddress } from "@/types";
import { ApiService } from "./baseApi";

// User API
export class UserApi extends ApiService {
  constructor() {
    super(config.userApiUrl);
  }

  getProfile = async (): Promise<{ message: string; user: User }> => {
    const result = await this.get<{
      message: string;
      user: User;
    }>("/api/user-service/users/profile");

    return {
      message: result.message,
      user: result.user,
    };
  };

  updateProfile = async (userData: {
    name?: string;
    phone?: string;
  }): Promise<{ message: string; user: User }> => {
    const result = await this.put<{
      message: string;
      user: User;
    }>("/api/user-service/users/profile", userData);

    return {
      message: result.message,
      user: result.user,
    };
  };

  deleteProfile = async (): Promise<{ message: string }> => {
    const result = await this.delete<{ message: string }>(
      "/api/user-service/users/profile"
    );

    return result;
  };

  getAddresses = async (): Promise<{
    message: string;
    addresses: DeliveryAddress[];
  }> => {
    const result = await this.get<{
      message: string;
      addresses: DeliveryAddress[];
    }>("/api/user-service/users/addresses");

    return {
      message: result.message,
      addresses: result.addresses,
    };
  };

  addAddress = async (addressData: {
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault?: boolean;
  }): Promise<{ message: string; address: DeliveryAddress }> => {
    const result = await this.post<{
      message: string;
      address: DeliveryAddress;
    }>("/api/user-service/users/addresses", {
      label: addressData.label,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      isDefault: addressData.isDefault || false,
    });

    return {
      message: result.message,
      address: result.address,
    };
  };

  updateAddress = async (
    addressId: string,
    addressData: {
      label?: string;
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      isDefault?: boolean;
    }
  ): Promise<{ message: string; address: DeliveryAddress }> => {
    const result = await this.put<{
      message: string;
      address: DeliveryAddress;
    }>(`/api/user-service/users/addresses/${addressId}`, {
      label: addressData.label,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      isDefault: addressData.isDefault,
    });

    return {
      message: result.message,
      address: result.address,
    };
  };

  deleteAddress = async (addressId: string): Promise<{ message: string }> => {
    const result = await this.delete<{ message: string }>(
      `/api/user-service/users/addresses/${addressId}`
    );

    return result;
  };

  getCart = async (): Promise<{
    message: string;
    items: Array<{ itemId: string; quantity: number }>;
  }> => {
    logger.info(`[UserAPI] Getting user cart`);

    const result = await this.get<{
      message: string;
      items: Array<{ itemId: string; quantity: number }>;
    }>("/api/user-service/cart");

    logger.info(`[UserAPI] User cart retrieved successfully`, {
      itemCount: result.items.length,
    });

    return result;
  };

  updateCart = async (
    items: Array<{ itemId: string; quantity: number }>
  ): Promise<{ message: string }> => {
    logger.info(`[UserAPI] Updating user cart`, {
      itemCount: items.length,
    });

    const result = await this.put<{ message: string }>(
      "/api/user-service/cart",
      { items }
    );

    return result;
  };
}
