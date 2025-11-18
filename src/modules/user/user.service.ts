import { AppError } from '../../shared/middlewares/errorHandler.middleware';
import { PaginationParams } from '../../types';
import { UserRepository } from './user.repository';
import { UpdateUserDTO, UserResponseDTO } from './user.types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getProfile(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.mapToDTO(user);
  }

  async getAllUsers(params: PaginationParams) {
    const result = await this.userRepository.findWithPagination({ isActive: true }, params);
    return {
      ...result,
      data: result.data.map(user => this.mapToDTO(user)),
    };
  }

  async updateProfile(userId: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    // Check if email is being changed
    if (data.email) {
      const existingUser = await this.userRepository.findOne({ 
        email: data.email,
        _id: { $ne: userId }
      });
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }
    }

    const user = await this.userRepository.update(userId, data);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.mapToDTO(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const success = await this.userRepository.delete(userId);
    if (!success) {
      throw new AppError('User not found', 404);
    }
  }

  private mapToDTO(user: any): UserResponseDTO {
    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
