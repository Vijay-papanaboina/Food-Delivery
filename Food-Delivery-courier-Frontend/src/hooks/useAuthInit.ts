import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/services/authApi";
import { logger } from "@/lib/logger";

/**
 * Hook to initialize authentication state on app load
 * Checks if user is still authenticated using stored tokens
 */
export const useAuthInit = () => {
  const { setLoading } = useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return; // Prevent double execution in StrictMode
    hasInitialized.current = true;
    const initializeAuth = async () => {
      setLoading(true);

      try {
        const authResult = await authApi.checkAuth();

        if (authResult.isAuthenticated && authResult.user) {
          logger.info("User authenticated on app load", {
            userId: authResult.user.userId,
            role: authResult.user.role,
          });
        } else {
          logger.info("No authenticated user found on app load");
        }
      } catch (error) {
        logger.error("[useAuthInit] Auth initialization failed", { error });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

