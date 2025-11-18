import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

/**
 * File upload utility using multer
 */
export class FileUploadUtil {
  /**
   * Configure multer storage
   */
  private static storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });

  /**
   * File filter for images only
   */
  private static imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  };

  /**
   * File filter for documents
   */
  private static documentFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedTypes = /pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only document files are allowed (pdf, doc, docx, xls, xlsx, txt)'));
    }
  };

  /**
   * Upload single image
   */
  public static uploadImage = multer({
    storage: this.storage,
    fileFilter: this.imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  /**
   * Upload multiple images
   */
  public static uploadImages = multer({
    storage: this.storage,
    fileFilter: this.imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB per file
      files: 10, // Max 10 files
    },
  });

  /**
   * Upload document
   */
  public static uploadDocument = multer({
    storage: this.storage,
    fileFilter: this.documentFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  /**
   * Upload any file type
   */
  public static uploadAny = multer({
    storage: this.storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  /**
   * Delete uploaded file
   */
  public static deleteFile(filename: string): void {
    const filePath = path.join(process.cwd(), 'uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Get file URL
   */
  public static getFileUrl(filename: string, baseUrl: string): string {
    return `${baseUrl}/uploads/${filename}`;
  }
}
