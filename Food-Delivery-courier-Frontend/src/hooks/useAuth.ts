import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import type { LoginCredentials } from "@/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await authApi.login(credentials);
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
    },
    onError: (error: Error) => {
      logger.error("Login failed", { error });
      toast.error("Login failed - please check your credentials");
    },
  });
};

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
