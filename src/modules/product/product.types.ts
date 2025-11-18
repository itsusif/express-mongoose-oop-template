export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  category: 'electronics' | 'clothing' | 'food' | 'books' | 'other';
  stock: number;
  images?: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  category?: 'electronics' | 'clothing' | 'food' | 'books' | 'other';
  stock?: number;
  images?: string[];
  isActive?: boolean;
}

export interface ProductResponseDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
