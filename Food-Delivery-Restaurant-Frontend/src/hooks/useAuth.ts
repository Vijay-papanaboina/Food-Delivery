import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // First, call logout API to clear server-side session/cookies
      // This MUST succeed to properly clear the refresh token cookie
      await authApi.logout();

      // Only after successful API call, clear local state
      queryClient.clear();
      logout();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error: Error) => {
      logger.error("Logout failed", { error });
      toast.error("Logout failed - please try again");
      // Don't clear local state if API call failed
    },
  });
};
