import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantApi } from "@/services/restaurantApi";
import { toast } from "sonner";

export const useMyRestaurant = () => {
  return useQuery({
    queryKey: ["my-restaurant"],
    queryFn: () => restaurantApi.getMyRestaurant(),
  });
};

export const useRestaurantProfile = () => {
  return useMyRestaurant();
};

export const useUpdateRestaurantStatus = () => {
  const { data: restaurantData } = useMyRestaurant();
  const restaurantId = restaurantData?.restaurant?.id;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isOpen: boolean) =>
      restaurantApi.updateRestaurantStatus(restaurantId!, isOpen),
    onSuccess: (_, isOpen) => {
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      toast.success(
        isOpen ? "Restaurant is now open!" : "Restaurant is now closed!"
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to update restaurant status: ${error.message}`);
    },
  });
};
