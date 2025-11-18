import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Config } from '../config';
import { AuthRequest, ApiResponse } from '../../types';

export class AuthMiddleware {
  public static authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Authentication token is required',
        } as ApiResponse);
        return;
      }

      const decoded = jwt.verify(token, Config.JWT_SECRET) as {
        id: string;
        email: string;
        role: string;
      };

      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      } as ApiResponse);
    }
  }

  public static authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        } as ApiResponse);
        return;
      }

      if (roles.length && !roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Insufficient permissions',
        } as ApiResponse);
        return;
      }

      next();
    };
  }
}