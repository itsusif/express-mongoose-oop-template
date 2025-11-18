import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware that adds a unique correlation ID to every request
 * This ID can be used to track requests across logs and services
 */
export class CorrelationIdMiddleware {
  public static addCorrelationId(req: Request, res: Response, next: NextFunction): void {
    // Generate unique ID for this request
    const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
    
    // Add to request object
    req.correlationId = correlationId;
    
    // Add to response headers so client can reference it
    res.setHeader('X-Correlation-ID', correlationId);
    
    next();
  }
}
