export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[delivery-app] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[delivery-app] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[delivery-app] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(`[delivery-app] ${message}`, ...args);
  },
};

/**
 * Helper function to sanitize sensitive data before logging
 * @param data - Data object to sanitize
 * @returns Sanitized data object
 */
export function sanitizeForLogging(data: unknown): unknown {
  if (!data || typeof data !== "object") return data;

  const sensitiveFields = [
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "authorization",
  ];
  const sanitized = { ...(data as Record<string, unknown>) };

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  }

  return sanitized;
}

