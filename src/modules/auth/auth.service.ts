import jwt from 'jsonwebtoken';
import { Config } from '../../shared/config';
import { AppError } from '../../shared/middlewares/errorHandler.middleware';
import { AuthRepository } from './auth.repository';
import { RegisterDTO, LoginDTO, AuthResponse } from './auth.types';

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Check if user already exists
    const emailExists = await this.authRepository.emailExists(data.email);
    if (emailExists) {
      throw new AppError('Email already registered', 409);
    }

    // Create user
    const user = await this.authRepository.create(data);

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user with password
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if account is active
    if (!user.isActive) {
      throw new AppError('Account is disabled', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = this.generateToken(user._id.toString(), user.email, user.role);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  private generateToken(id: string, email: string, role: string): string {
    return jwt.sign(
      { id, email, role },
      Config.JWT_SECRET as string,
      { expiresIn: Config.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }
}
