import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deliveryApi } from "@/services/deliveryApi";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

// Get deliveries for the logged-in driver with optional status filter
export const useMyDeliveries = (status?: string) => {
  return useQuery({
    queryKey: ["deliveries", status],
    queryFn: () => deliveryApi.getMyDeliveries(status),
    // Auto-refresh every 10 seconds for active deliveries
    refetchInterval: status === "completed" ? false : 10000,
    staleTime: status === "completed" ? 5 * 60 * 1000 : 5000,
  });
};

// Mark delivery as picked up
export const usePickupDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      orderId,
      driverId,
    }: {
      id: string;
      orderId: string;
      driverId: string;
    }) => deliveryApi.pickupDelivery(id, orderId, driverId),
    onSuccess: () => {
      // Invalidate and refetch all delivery-related queries
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({
        queryKey: ["delivery"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["driver-stats"] });
      toast.success("Delivery picked up successfully");
    },
    onError: (error: Error) => {
      logger.error("Failed to pickup delivery", { error });
      toast.error("Failed to pickup delivery - please try again");
    },
  });
};

// Mark delivery as completed
export const useCompleteDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      orderId,
      driverId,
    }: {
      id: string;
      orderId: string;
      driverId: string;
    }) => deliveryApi.completeDelivery(id, orderId, driverId),
    onSuccess: () => {
      // Invalidate and refetch all delivery-related queries
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({
        queryKey: ["delivery"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["driver-stats"] });
      toast.success("Delivery completed successfully");
    },
    onError: (error: Error) => {
      logger.error("Failed to complete delivery", { error });
      toast.error("Failed to complete delivery - please try again");
    },
  });
};

// Get driver stats
export const useDriverStats = () => {
  return useQuery({
    queryKey: ["driver-stats"],
    queryFn: () => deliveryApi.getStats(),
    // Auto-refresh every 30 seconds
    refetchInterval: 30000,
    staleTime: 20000,
  });
};

// Get full delivery details
export const useDeliveryDetails = (id: string) => {
  return useQuery({
    queryKey: ["delivery", id],
    queryFn: () => deliveryApi.getDeliveryDetails(id),
    enabled: !!id,
  });
};

// Toggle driver availability
export const useToggleAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAvailable: boolean) =>
      deliveryApi.toggleMyAvailability(isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({ queryKey: ["driver-stats"] });
    },
  });
};

// Accept delivery
export const useAcceptDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deliveryApi.acceptDelivery(id),
    onSuccess: () => {
      // Invalidate all delivery-related queries
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({
        queryKey: ["delivery"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["driver-stats"] });
      toast.success("Delivery accepted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to accept delivery");
    },
  });
};

// Decline delivery
export const useDeclineDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason?: string;
    }) => deliveryApi.declineDelivery(id, reason),
    onSuccess: () => {
      // Invalidate all delivery-related queries
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
      queryClient.invalidateQueries({
        queryKey: ["delivery"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({ queryKey: ["driver-stats"] });
      toast.success("Delivery declined. Reassigning to another driver...");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to decline delivery");
    },
  });
};
