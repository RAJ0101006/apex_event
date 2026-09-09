interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Periodic cleanup every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if an action is allowed for the given key (e.g. IP + action)
 * @param key unique identifier (e.g. `login:127.0.0.1`)
 * @param maxAttempts maximum requests allowed in window
 * @param windowMs time window in milliseconds
 * @returns { success: boolean, remaining: number, resetSeconds: number }
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.ceil((record.resetTime - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetSeconds: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Resets rate limit for a key (e.g. on successful login)
 */
export function resetRateLimit(key: string) {
  rateLimitStore.delete(key);
}
