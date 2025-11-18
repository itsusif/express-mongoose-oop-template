import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { RegisterDTO, LoginDTO } from './auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.authService.register(data);
      res.sendCreated(result, 'User registered successfully');
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.authService.login(data);
      res.sendSuccess(result, 'Login successful');
    } catch (error) {
      next(error);
    }
  };
}