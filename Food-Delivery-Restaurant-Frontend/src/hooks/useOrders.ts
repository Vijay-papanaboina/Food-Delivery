import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "@/services/ordersApi";
import { restaurantApi } from "@/services/restaurantApi";
import { toast } from "sonner";
import type { OrderFilters } from "@/types";

export const useKitchenOrders = (status?: string) => {
  return useQuery({
    queryKey: ["kitchen-orders", status],
    queryFn: () => ordersApi.getKitchenOrders(status),
    refetchInterval: 10000, // Refetch every 10 seconds for live updates
  });
};

export const useOrderHistory = (filters?: OrderFilters) => {
  const { data: restaurantData } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: () => restaurantApi.getMyRestaurant(),
  });
  const restaurantId = restaurantData?.restaurant?.restaurant_id;

  return useQuery({
    queryKey: ["order-history", restaurantId, filters],
    queryFn: () => ordersApi.getOrderHistory(restaurantId!, filters),
    enabled: !!restaurantId,
  });
};

export const useMarkOrderReady = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => ordersApi.markOrderReady(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] });
      toast.success("Order marked as ready!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark order ready: ${error.message}`);
    },
  });
};

export const useOrderStats = () => {
  const { data: restaurantData } = useQuery({
    queryKey: ["my-restaurant"],
    queryFn: () => restaurantApi.getMyRestaurant(),
  });
  const restaurantId = restaurantData?.restaurant?.restaurant_id;

  return useQuery({
    queryKey: ["order-stats", restaurantId],
    queryFn: () => ordersApi.getOrderStats(restaurantId!),
    enabled: !!restaurantId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
