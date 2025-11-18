import dotenv from 'dotenv';

dotenv.config();

export class Config {
  // Server Configuration
  public static readonly PORT = process.env.PORT || 3000;
  public static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  
  // Database Configuration
  public static readonly MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/base-express';
  
  // JWT Configuration
  public static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  public static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  
  // CORS Configuration
  public static readonly CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
  
  // Rate Limiting
  public static readonly RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
  public static readonly RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');
  
  // Pagination
  public static readonly DEFAULT_PAGE_SIZE = 10;
  public static readonly MAX_PAGE_SIZE = 100;
  
  // Validate required environment variables
  public static validate(): void {
    const required = ['MONGODB_URI', 'JWT_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0 && this.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}