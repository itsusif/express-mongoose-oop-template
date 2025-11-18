import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ErrorHandlerMiddleware {
  public static handle(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
        error: err.message,
      } as ApiResponse);
      return;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: err.message,
      } as ApiResponse);
      return;
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
      res.status(409).json({
        success: false,
        message: 'Duplicate entry',
        error: 'A record with this value already exists',
      } as ApiResponse);
      return;
    }

    // Default error
    console.error('Unhandled error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    } as ApiResponse);
  }

  public static notFound(req: Request, res: Response): void {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      error: `Cannot ${req.method} ${req.path}`,
    } as ApiResponse);
  }
}