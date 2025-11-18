import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types';

/**
 * Middleware that adds custom response methods to the Express Response object
 * This makes sending consistent API responses much easier
 */
export class ResponseHandlerMiddleware {
  public static enhanceResponse(req: Request, res: Response, next: NextFunction): void {
    // Success response
    res.sendSuccess = function <T = any>(
      data: T,
      message: string = 'Success',
      statusCode: number = 200
    ): Response {
      return this.status(statusCode).json({
        success: true,
        message,
        data,
      } as ApiResponse<T>);
    };

    // Error response
    res.sendError = function (
      message: string,
      statusCode: number = 400,
      errors?: any[]
    ): Response {
      return this.status(statusCode).json({
        success: false,
        message,
        error: message,
        errors,
      } as ApiResponse);
    };

    // Created response (201)
    res.sendCreated = function <T = any>(data: T, message: string = 'Created'): Response {
      return this.status(201).json({
        success: true,
        message,
        data,
      } as ApiResponse<T>);
    };

    // No content response (204)
    res.sendNoContent = function (): Response {
      return this.status(204).send();
    };

    next();
  }
}
