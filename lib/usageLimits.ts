import { kv } from '@vercel/kv';

// Configuration - adjust these limits as needed
export const USAGE_LIMITS = {
  DAILY_REQUESTS: 500,      // Max requests per day
  MONTHLY_REQUESTS: 5000,   // Max requests per month
  ENABLED: true,            // Set to false to disable limits
};

// Keys for KV storage
const DAILY_KEY = 'mike:usage:daily';
const MONTHLY_KEY = 'mike:usage:monthly';
const DAILY_DATE_KEY = 'mike:usage:daily:date';
const MONTHLY_DATE_KEY = 'mike:usage:monthly:date';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
}

export interface UsageStatus {
  allowed: boolean;
  reason?: 'daily_limit' | 'monthly_limit';
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
}

/**
 * Check if a request is allowed based on usage limits
 * Returns usage status and whether the request should proceed
 */
export async function checkUsageLimit(): Promise<UsageStatus> {
  // If limits are disabled, always allow
  if (!USAGE_LIMITS.ENABLED) {
    return {
      allowed: true,
      dailyUsed: 0,
      dailyLimit: USAGE_LIMITS.DAILY_REQUESTS,
      monthlyUsed: 0,
      monthlyLimit: USAGE_LIMITS.MONTHLY_REQUESTS,
    };
  }

  try {
    const today = getTodayString();
    const month = getMonthString();

    // Get current counts and dates
    const [dailyCount, monthlyCount, storedDailyDate, storedMonthlyDate] = await Promise.all([
      kv.get<number>(DAILY_KEY),
      kv.get<number>(MONTHLY_KEY),
      kv.get<string>(DAILY_DATE_KEY),
      kv.get<string>(MONTHLY_DATE_KEY),
    ]);

    // Reset daily counter if it's a new day
    let currentDailyCount = dailyCount || 0;
    if (storedDailyDate !== today) {
      currentDailyCount = 0;
    }

    // Reset monthly counter if it's a new month
    let currentMonthlyCount = monthlyCount || 0;
    if (storedMonthlyDate !== month) {
      currentMonthlyCount = 0;
    }

    // Check limits
    if (currentDailyCount >= USAGE_LIMITS.DAILY_REQUESTS) {
      return {
        allowed: false,
        reason: 'daily_limit',
        dailyUsed: currentDailyCount,
        dailyLimit: USAGE_LIMITS.DAILY_REQUESTS,
        monthlyUsed: currentMonthlyCount,
        monthlyLimit: USAGE_LIMITS.MONTHLY_REQUESTS,
      };
    }

    if (currentMonthlyCount >= USAGE_LIMITS.MONTHLY_REQUESTS) {
      return {
        allowed: false,
        reason: 'monthly_limit',
        dailyUsed: currentDailyCount,
        dailyLimit: USAGE_LIMITS.DAILY_REQUESTS,
        monthlyUsed: currentMonthlyCount,
        monthlyLimit: USAGE_LIMITS.MONTHLY_REQUESTS,
      };
    }

    return {
      allowed: true,
      dailyUsed: currentDailyCount,
      dailyLimit: USAGE_LIMITS.DAILY_REQUESTS,
      monthlyUsed: currentMonthlyCount,
      monthlyLimit: USAGE_LIMITS.MONTHLY_REQUESTS,
    };
  } catch (error) {
    // If KV is not configured, allow the request but log warning
    console.warn('Usage limits check failed (KV not configured?):', error);
    return {
      allowed: true,
      dailyUsed: 0,
      dailyLimit: USAGE_LIMITS.DAILY_REQUESTS,
      monthlyUsed: 0,
      monthlyLimit: USAGE_LIMITS.MONTHLY_REQUESTS,
    };
  }
}

/**
 * Increment usage counters after a successful request
 */
export async function incrementUsage(): Promise<void> {
  if (!USAGE_LIMITS.ENABLED) return;

  try {
    const today = getTodayString();
    const month = getMonthString();

    // Get current dates
    const [storedDailyDate, storedMonthlyDate] = await Promise.all([
      kv.get<string>(DAILY_DATE_KEY),
      kv.get<string>(MONTHLY_DATE_KEY),
    ]);

    // Reset and increment daily
    if (storedDailyDate !== today) {
      await kv.set(DAILY_KEY, 1);
      await kv.set(DAILY_DATE_KEY, today);
    } else {
      await kv.incr(DAILY_KEY);
    }

    // Reset and increment monthly
    if (storedMonthlyDate !== month) {
      await kv.set(MONTHLY_KEY, 1);
      await kv.set(MONTHLY_DATE_KEY, month);
    } else {
      await kv.incr(MONTHLY_KEY);
    }
  } catch (error) {
    console.warn('Failed to increment usage counters:', error);
  }
}

/**
 * Get current usage stats (for admin/monitoring)
 */
export async function getUsageStats(): Promise<UsageStatus> {
  return checkUsageLimit();
}
