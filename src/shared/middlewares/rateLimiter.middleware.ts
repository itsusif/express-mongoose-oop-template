import rateLimit from 'express-rate-limit';
import { Config } from '../config';

/**
 * Rate limiting configurations for different route types
 */
export class RateLimiterMiddleware {
  /**
   * General API rate limiter
   * Limits: 100 requests per 15 minutes
   */
  public static general = rateLimit({
    windowMs: Config.RATE_LIMIT_WINDOW_MS,
    max: Config.RATE_LIMIT_MAX_REQUESTS,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  /**
   * Strict rate limiter for sensitive operations (auth, password reset)
   * Limits: 5 requests per 15 minutes
   */
  public static strict = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
      success: false,
      message: 'Too many attempts, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  /**
   * Moderate rate limiter for authenticated endpoints
   * Limits: 30 requests per 15 minutes
   */
  public static moderate = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: {
      success: false,
      message: 'Rate limit exceeded, please slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  /**
   * Create custom rate limiter with specific options
   */
  public static custom(windowMs: number, max: number, message?: string) {
    return rateLimit({
      windowMs,
      max,
      message: {
        success: false,
        message: message || 'Rate limit exceeded',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }
}
