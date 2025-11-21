import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantApi } from "@/services/restaurantApi";
import { toast } from "sonner";

export const useMyRestaurant = () => {
  return useQuery({
    queryKey: ["my-restaurant"],
    queryFn: () => restaurantApi.getMyRestaurant(),
  });
};

export const useMenuItems = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;

  return useQuery({
    queryKey: ["menu-items", restaurantId],
    queryFn: () => restaurantApi.getMenuItems(restaurantId!),
    enabled: !!restaurantId,
  });
};

export const useToggleAvailability = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isAvailable,
    }: {
      id: string;
      isAvailable: boolean;
    }) =>
      restaurantApi.updateMenuItemAvailability(
        restaurantId!,
        id,
        isAvailable
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success(
        variables.isAvailable
          ? "Menu item is now available"
          : "Menu item is now unavailable"
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update availability: ${error.message}`);
    },
  });
};

export const useAddMenuItem = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemData: Partial<import("@/types").MenuItem>) =>
      restaurantApi.addMenuItem(restaurantId!, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add menu item: ${error.message}`);
    },
  });
};

export const useUpdateMenuItem = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      itemData,
    }: {
      id: string;
      itemData: Partial<import("@/types").MenuItem>;
    }) => restaurantApi.updateMenuItem(restaurantId!, id, itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update menu item: ${error.message}`);
    },
  });
};

export const useDeleteMenuItem = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      restaurantApi.deleteMenuItem(restaurantId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
      toast.success("Menu item deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete menu item: ${error.message}`);
    },
  });
};
