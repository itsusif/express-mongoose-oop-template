# 🚀 Express.js + Mongoose OOP Template

> **A production-ready Express.js REST API template built with 3 years of real-world experience**  
> Crafted with best practices, scalability, and developer experience in mind.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 👨‍💻 About This Template

This template represents **3 years of hands-on experience** building and scaling Express.js applications. It consolidates the best practices, architectural patterns, and production-ready features I've learned while working on numerous projects.

**What makes this different?**
- ✨ **Battle-tested architecture** - Used in real production applications
- 🏗️ **True OOP principles** - Clean, maintainable, and scalable code structure
- 🚀 **Production-ready** - Not just a starter, but a complete foundation
- 📚 **Full documentation** - Including Swagger API docs out of the box
- 🔒 **Security-first** - Rate limiting, JWT auth, input validation, and more
- 🛠️ **Developer experience** - TypeScript, hot reload, logging, error handling

---

## ✨ Key Features

### 🏛️ **Architecture & Design**
- **Clean OOP Architecture** - Repository → Service → Controller pattern
- **TypeScript** - Full type safety across the entire codebase
- **Modular Structure** - Easy to extend with new modules
- **Base Classes** - Reduce boilerplate with `BaseRepository` and `BaseService`
- **Dependency Injection** - Loosely coupled, testable code

### 🔐 **Security & Authentication**
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt with salt rounds
- **Role-Based Access Control (RBAC)** - Admin, User, and custom roles
- **Rate Limiting** - Prevent API abuse with configurable limits
- **Security Headers** - Helmet.js for HTTP security
- **CORS Configuration** - Cross-origin resource sharing control
- **Input Validation** - Express-validator for request validation

### 📊 **Database & Data Layer**
- **Mongoose ODM** - Elegant MongoDB object modeling
- **Base Repository** - Generic CRUD operations with pagination
- **Soft Delete Support** - Mark as deleted without removing data
- **Query Builder** - Fluent interface for complex queries
- **Pagination** - Built-in pagination support
- **Indexing** - Optimized database queries

### 🎯 **API Features**
- **RESTful Design** - Industry-standard REST API principles
- **Swagger Documentation** - Auto-generated interactive API docs
- **Custom Response Methods** - `res.sendSuccess()`, `res.sendError()`, `res.sendCreated()`
- **Request Correlation ID** - Track requests across logs
- **File Upload** - Multer integration for file handling
- **Search & Filter** - Advanced query capabilities

### 📈 **Monitoring & Logging**
- **Winston Logger** - Production-grade logging with daily rotation
- **Health Checks** - `/health`, `/health/live`, `/health/ready`
- **Request Logging** - Morgan HTTP request logger
- **Error Tracking** - Centralized error handling with stack traces
- **Performance Monitoring** - CPU, memory, and database health

### 🛠️ **Developer Experience**
- **TypeScript** - IntelliSense, type checking, and refactoring support
- **Hot Reload** - Nodemon for automatic server restart
- **Environment Variables** - Dotenv for configuration management
- **Code Organization** - Clear folder structure and naming conventions
- **Example Modules** - Auth, User, and Product modules included

---

## 📁 Project Structure

```
├── src/
│   ├── modules/                    # Feature modules
│   │   ├── auth/                   # Authentication (register, login, JWT)
│   │   │   ├── auth.types.ts      # TypeScript interfaces
│   │   │   ├── auth.repository.ts # Data access layer
│   │   │   ├── auth.service.ts    # Business logic
│   │   │   ├── auth.controller.ts # HTTP handlers
│   │   │   └── auth.routes.ts     # Route definitions
│   │   ├── user/                   # User management
│   │   │   ├── user.types.ts
│   │   │   ├── user.repository.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.controller.ts
│   │   │   └── user.routes.ts
│   │   └── product/                # Product CRUD (example)
│   │       ├── product.types.ts
│   │       ├── product.repository.ts
│   │       ├── product.service.ts
│   │       ├── product.controller.ts
│   │       └── product.routes.ts
│   │
│   ├── shared/                     # Shared utilities
│   │   ├── config/                 # Configuration
│   │   │   ├── index.ts           # Environment config
│   │   │   └── swagger.ts         # Swagger/OpenAPI config
│   │   ├── database/              # Database layer
│   │   │   ├── BaseRepository.ts  # Generic CRUD repository
│   │   │   ├── BaseService.ts     # Generic service layer
│   │   │   └── models/            # Mongoose models
│   │   │       ├── User.model.ts
│   │   │       └── Product.model.ts
│   │   ├── middlewares/           # Express middlewares
│   │   │   ├── auth.middleware.ts          # JWT & RBAC
│   │   │   ├── validation.middleware.ts    # Input validation
│   │   │   ├── errorHandler.middleware.ts  # Error handling
│   │   │   ├── responseHandler.middleware.ts # Response methods
│   │   │   ├── correlationId.middleware.ts # Request tracking
│   │   │   └── rateLimiter.middleware.ts   # Rate limiting
│   │   └── utils/                 # Utility functions
│   │       ├── logger.ts          # Winston logger
│   │       ├── response.helper.ts # Response formatting
│   │       ├── healthCheck.ts     # Health monitoring
│   │       ├── queryBuilder.ts    # Query builder
│   │       └── fileUpload.ts      # File upload utility
│   │
│   ├── types/                     # TypeScript definitions
│   │   ├── index.ts              # Common types
│   │   └── express.d.ts          # Express augmentation
│   │
│   ├── app.ts                     # Express app setup
│   └── index.ts                   # Server entry point
│
├── uploads/                       # Uploaded files
├── logs/                          # Log files
├── dist/                          # Compiled JavaScript
├── .env.example                   # Environment template
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
├── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** >= 6.x
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/itsusif/express-mongoose-oop-template.git
cd express-mongoose-oop-template
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

4. **Configure your `.env` file**
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

5. **Start the development server**
```bash
npm run dev
```

6. **Visit the API documentation**
```
http://localhost:3000/api-docs
```

---

## 📚 API Documentation

This template includes **Swagger/OpenAPI** documentation out of the box.

**Access the interactive API docs:**
```
http://localhost:3000/api-docs
```

### Main Endpoints

#### 🔐 Authentication
```http
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login and get JWT token
```

#### 👤 Users
```http
GET    /api/users/profile    # Get current user profile (Auth required)
PUT    /api/users/profile    # Update profile (Auth required)
GET    /api/users            # Get all users with pagination (Admin only)
DELETE /api/users/:id        # Delete user (Admin only)
```

#### 📦 Products
```http
POST   /api/products                    # Create product (Auth required)
GET    /api/products                    # Get all products (paginated)
GET    /api/products/:id                # Get product by ID
PUT    /api/products/:id                # Update product (Owner only)
DELETE /api/products/:id                # Delete product (Owner only)
GET    /api/products/category/:category # Filter by category
GET    /api/products/search?q=keyword   # Search products
```

#### 💚 Health Checks
```http
GET    /health              # Detailed system health
GET    /health/live         # Liveness probe
GET    /health/ready        # Readiness probe
```

---

## 🏗️ Architecture Explained

### 🎯 Layered Architecture

```
┌─────────────────────────────────────┐
│         HTTP Request                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Middlewares                    │
│  (Auth, Validation, CORS, etc.)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Controller                  │
│  (Handle HTTP, call service)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│          Service                    │
│   (Business logic, validation)      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        Repository                   │
│   (Database operations)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       MongoDB Database              │
└─────────────────────────────────────┘
```

### 📝 Code Example

**1. Repository Layer** (Data Access)
```typescript
export class ProductRepository extends BaseRepository<IProduct> {
  constructor() {
    super(ProductModel);
  }
  
  async findByCategory(category: string): Promise<IProduct[]> {
    return await this.model.find({ category, isActive: true }).exec();
  }
}
```

**2. Service Layer** (Business Logic)
```typescript
export class ProductService {
  private repository: ProductRepository;
  
  async createProduct(userId: string, data: CreateProductDTO): Promise<ProductResponseDTO> {
    // Validate business rules
    if (data.price < 0) {
      throw new AppError('Price cannot be negative', 400);
    }
    
    const product = await this.repository.create({
      ...data,
      createdBy: userId
    });
    
    return this.mapToDTO(product);
  }
}
```

**3. Controller Layer** (HTTP Handling)
```typescript
export class ProductController {
  private service: ProductService;
  
  createProduct = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const result = await this.service.createProduct(userId, req.body);
      
      // Clean response with custom method
      res.sendCreated(result, 'Product created successfully');
    } catch (error) {
      next(error);
    }
  }
}
```

**4. Routes** (Endpoint Definition)
```typescript
export class ProductRoutes {
  initializeRoutes() {
    this.router.post(
      '/',
      AuthMiddleware.authenticate,
      ValidationMiddleware.validate(createValidation),
      RateLimiterMiddleware.moderate,
      this.controller.createProduct
    );
  }
}
```

---

## 🎯 Usage Examples

### Example 1: Creating a New Module

Let's create a **Category** module:

1. **Create the structure:**
```bash
mkdir -p src/modules/category
```

2. **Define types** (`category.types.ts`):
```typescript
export interface CreateCategoryDTO {
  name: string;
  slug: string;
  description?: string;
}

export interface CategoryResponseDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
}
```

3. **Create repository** (`category.repository.ts`):
```typescript
import { BaseRepository } from '../../shared/database/BaseRepository';
import { CategoryModel, ICategory } from '../../shared/database/models/Category.model';

export class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }
}
```

4. **Create service using BaseService** (`category.service.ts`):
```typescript
import { BaseService } from '../../shared/database/BaseService';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDTO, CategoryResponseDTO } from './category.types';

export class CategoryService extends BaseService<
  ICategory,
  CreateCategoryDTO,
  any,
  CategoryResponseDTO
> {
  constructor() {
    super(new CategoryRepository());
  }
  
  protected mapToDTO(item: ICategory): CategoryResponseDTO {
    return {
      id: item._id.toString(),
      name: item.name,
      slug: item.slug,
      description: item.description,
      createdAt: item.createdAt
    };
  }
}
```

### Example 2: Using Query Builder

```typescript
import { QueryBuilder } from '../shared/utils/queryBuilder';

// Complex query made simple
const activeUsers = await new QueryBuilder(UserModel)
  .where('isActive', true)
  .where('role', 'user')
  .greaterThan('createdAt', new Date('2024-01-01'))
  .search('john')
  .sort('createdAt', 'desc')
  .paginate(1, 10)
  .populate('profile', 'name email')
  .select('name email role createdAt')
  .execute();
```

### Example 3: File Upload

```typescript
import { FileUploadUtil } from '../shared/utils/fileUpload';

// In routes
router.post(
  '/upload-avatar',
  AuthMiddleware.authenticate,
  FileUploadUtil.uploadImage.single('avatar'),
  userController.uploadAvatar
);

// In controller
uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.sendError('No file uploaded', 400);
    }
    
    const fileUrl = FileUploadUtil.getFileUrl(
      req.file.filename,
      `${req.protocol}://${req.get('host')}`
    );
    
    await this.userService.updateAvatar(req.user!.id, fileUrl);
    
    res.sendSuccess({ url: fileUrl }, 'Avatar uploaded successfully');
  } catch (error) {
    next(error);
  }
};
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm test                 # Run tests (if configured)
```

---

## 🔧 Configuration

### Environment Variables

All configuration is done through environment variables. See `.env.example` for all available options.

**Key configurations:**

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | Token expiration | `7d` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

---

## 📖 Learn More

- 🌐 **[API Documentation](http://localhost:3000/api-docs)** - Interactive Swagger docs

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Youssef Naguib**

This template is the result of **3 years of building and scaling Express.js applications** in production. It consolidates patterns, practices, and solutions that have proven effective across multiple real-world projects.

### 🌐 Connect with me:

- **Website:** [usif.me](https://usif.me)
- **GitHub:** [github.com/itsusif](https://github.com/itsusif)
- **LinkedIn:** [linkedin.com/in/itsusif](https://linkedin.com/in/itsusif)
- **Discord:** [u.si](https://discord.com/users/833340407130882068)

---

## ⭐ Show Your Support

If this template helped you build better Express.js applications, please give it a ⭐️ on GitHub!

---

## 🙏 Acknowledgments

This template incorporates best practices from:
- Express.js official documentation
- Node.js design patterns
- Clean Architecture principles
- Real-world production experience

---

<div align="center">

**Built with ❤️ by [Youssef Naguib](https://usif.me)**

*Making Express.js development easier, one template at a time*

[![GitHub](https://img.shields.io/badge/GitHub-itsusif-black?logo=github)](https://github.com/itsusif)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-itsusif-blue?logo=linkedin)](https://linkedin.com/in/itsusif)
[![Website](https://img.shields.io/badge/Website-usif.me-green)](https://usif.me)

</div>
