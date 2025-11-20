import { config } from "@/config/env";
import { useAuthStore } from "@/store/authStore";
import { logger } from "@/lib/logger";
import type { User } from "@/types";
import { ApiService } from "./baseApi";

// Auth API
export class AuthApi extends ApiService {
  constructor() {
    super(config.userApiUrl, true); // Enable credentials for auth service
  }

  signup = async (userData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }): Promise<{
    message: string;
    user: User;
    accessToken: string;
  }> => {
    const result = await this.post<{
      message: string;
      user: User;
      accessToken: string;
    }>("/api/user-service/auth/signup", userData);

    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    };
  };

  login = async (credentials: {
    email: string;
    password: string;
  }): Promise<{
    message: string;
    user: User;
    accessToken: string;
  }> => {
    const result = await this.post<{
      message: string;
      user: User;
      accessToken: string;
    }>("/api/user-service/auth/login/customer", credentials);

    return {
      message: result.message,
      user: result.user,
      accessToken: result.accessToken,
    };
  };

  refreshToken = async (): Promise<{
    message: string;
    accessToken: string;
    user: User;
  }> => {
    return this.request({
      method: "POST",
      url: "/api/user-service/auth/refresh",
      _skipAuthRefresh: true,
    });
  };

  validateToken = async (): Promise<{ message: string; user: User }> => {
    return this.request({
      method: "POST",
      url: "/api/user-service/auth/validate",
      _skipAuthRefresh: true,
    });
  };

  private handleRefreshResponse = (refreshResponse: {
    accessToken: string;
    user: User;
  }): { isAuthenticated: boolean; user: User } => {
    // Store new token in localStorage and update Zustand
    localStorage.setItem("access_token", refreshResponse.accessToken);
    useAuthStore.getState().login(refreshResponse.user, refreshResponse.accessToken);

    return { isAuthenticated: true, user: refreshResponse.user };
  };

  checkAuth = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
    try {
      // Step 1: Check localStorage for access token
      const storedToken = localStorage.getItem("access_token");

      if (storedToken) {
        // Step 2: Validate the token
        try {
          const validateResponse = await this.validateToken();

          // Update user in Zustand store
          useAuthStore.getState().login(validateResponse.user, storedToken);
          return { isAuthenticated: true, user: validateResponse.user };
        } catch (validateError) {
          // Step 3: Token validation failed, try to refresh
          logger.warn(`[AuthAPI] Token validation failed, attempting refresh`, {
            error: validateError,
          });

          try {
            const refreshResponse = await this.refreshToken();
            return this.handleRefreshResponse(refreshResponse);
          } catch (error) {
            logger.error(`[AuthAPI] Refresh token failed`, { error });
            // Clear invalid tokens
            localStorage.removeItem("access_token");
            useAuthStore.getState().logout();
            return { isAuthenticated: false };
          }
        }
      }

      // No stored token found, but try to refresh from HTTP-only cookie
      logger.info(
        `[AuthAPI] No stored token found, attempting refresh from cookie`
      );
      try {
        const refreshResponse = await this.refreshToken();
        return this.handleRefreshResponse(refreshResponse);
      } catch (error) {
        logger.error(`[AuthAPI] Refresh token failed`, { error });
        // Clear any invalid tokens
        localStorage.removeItem("access_token");
        useAuthStore.getState().logout();
        return { isAuthenticated: false };
      }
    } catch (error) {
      logger.error(`[AuthAPI] Auth check failed`, { error });
      return { isAuthenticated: false };
    }
  };

  logout = async (): Promise<{ message: string }> => {
    return this.post("/api/user-service/auth/logout");
  };
}
