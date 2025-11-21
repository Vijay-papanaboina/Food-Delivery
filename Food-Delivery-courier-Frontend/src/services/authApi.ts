import { config } from "@/config/env";
import { useAuthStore } from "@/store/authStore";
import { logger } from "@/lib/logger";
import { ApiService } from "./baseApi";
import type {
  User,
  BackendUser,
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
} from "@/types";

// Auth API
export class AuthApi extends ApiService {
  constructor() {
    super(config.userApiUrl, true); // Enable credentials for auth service
  }

  private transformBackendUser(backendUser: BackendUser): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.name,
      role: "driver",
    };
  }

  private handleRefreshResponse(refreshResponse: RefreshResponse): {
    isAuthenticated: boolean;
    user: User;
  } {
    const user = this.transformBackendUser(refreshResponse.user);

    // Store new token in localStorage and update Zustand
    localStorage.setItem("access_token", refreshResponse.accessToken);
    useAuthStore.getState().login(user, refreshResponse.accessToken);

    return { isAuthenticated: true, user };
  }

  login = async (
    credentials: LoginCredentials
  ): Promise<{
    user: User;
    accessToken: string;
  }> => {
    const result = await this.post<LoginResponse>(
      "/api/user-service/auth/login/driver",
      credentials
    );

    const user = this.transformBackendUser(result.user);
    useAuthStore.getState().login(user, result.accessToken);

    logger.info("Login successful", { id: user.id, role: user.role });
    return { user, accessToken: result.accessToken };
  };

  validateToken = async (): Promise<{ message: string; user: BackendUser }> => {
    return this.request({
      method: "POST",
      url: "/api/user-service/auth/validate",
      _skipAuthRefresh: true,
    });
  };

  refreshToken = async (): Promise<{
    message: string;
    accessToken: string;
    user: BackendUser;
  }> => {
    return this.request({
      method: "POST",
      url: "/api/user-service/auth/refresh",
      _skipAuthRefresh: true,
    });
  };

  checkAuth = async (): Promise<{ isAuthenticated: boolean; user?: User }> => {
    try {
      // Step 1: Check localStorage for access token
      const storedToken = localStorage.getItem("access_token");

      if (storedToken) {
        // Step 2: Validate the token
        try {
          const validateResponse = await this.validateToken();

          // Transform BackendUser to User
          const user: User = this.transformBackendUser(validateResponse.user);

          // Update user in Zustand store
          useAuthStore.getState().login(user, storedToken);
          return { isAuthenticated: true, user };
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

export const authApi = new AuthApi();
