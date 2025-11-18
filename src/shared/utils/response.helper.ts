import { Response } from 'express';
import { ApiResponse } from '../../types';

export class ResponseHelper {
  public static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    } as ApiResponse<T>);
  }

  public static error(
    res: Response,
    message: string,
    statusCode: number = 400,
    errors?: any[]
  ): void {
    res.status(statusCode).json({
      success: false,
      message,
      error: message,
      errors,
    } as ApiResponse);
  }

  public static created<T>(res: Response, data: T, message: string = 'Created'): void {
    this.success(res, data, message, 201);
  }

  public static noContent(res: Response): void {
    res.status(204).send();
  }
}