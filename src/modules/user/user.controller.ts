import { Response, NextFunction } from 'express';
import { AuthRequest, PaginationParams } from '../../types';
import { UserService } from './user.service';
import { UpdateUserDTO } from './user.types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.userService.getProfile(userId);
      res.sendSuccess(result, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sort: req.query.sort as string,
        order: req.query.order as 'asc' | 'desc',
      };
      const result = await this.userService.getAllUsers(params);
      res.sendSuccess(result, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: UpdateUserDTO = req.body;
      const result = await this.userService.updateProfile(userId, data);
      res.sendSuccess(result, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      await this.userService.deleteUser(userId);
      res.sendNoContent();
    } catch (error) {
      next(error);
    }
  };
}
