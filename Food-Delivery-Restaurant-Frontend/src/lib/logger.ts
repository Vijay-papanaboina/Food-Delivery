export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[restaurants-app] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[restaurants-app] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[restaurants-app] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(`[restaurants-app] ${message}`, ...args);
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
