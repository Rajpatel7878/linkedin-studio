// In-Memory sliding-window rate limiter for public API & abuse protection

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of Array.from(memoryStore.entries())) {
    if (now > record.resetTime) {
      memoryStore.delete(key);
    }
  }
}, 300000);

export function checkRateLimit(
  identifier: string,
  limit: number = 60, // requests
  windowMs: number = 60000 // 1 minute
): { success: boolean; limit: number; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    memoryStore.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}
