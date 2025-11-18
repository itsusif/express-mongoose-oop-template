// Extend Express Request type to include our custom user property
declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
    };
    correlationId?: string;
  }

  export interface Response {
    sendSuccess<T = any>(data: T, message?: string, statusCode?: number): Response;
    sendError(message: string, statusCode?: number, errors?: any[]): Response;
    sendCreated<T = any>(data: T, message?: string): Response;
    sendNoContent(): Response;
  }
}
