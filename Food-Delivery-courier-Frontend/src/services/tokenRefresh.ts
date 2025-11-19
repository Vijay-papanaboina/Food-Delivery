import { useAuthStore } from "@/store/authStore";
import { logger } from "@/lib/logger";
import { authApi } from "./authApi";

export const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshResponse = await authApi.refreshToken();

    // Update the stored access token
    useAuthStore
      .getState()
      .login(useAuthStore.getState().user!, refreshResponse.accessToken);

    return refreshResponse.accessToken;
  } catch (error) {
    logger.error(`[TokenRefresh] Token refresh failed`, { error });
    throw error;
  }
};

