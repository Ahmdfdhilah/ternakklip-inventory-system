import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '../base/types';

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface Product {
  id: number;
  category_id?: number | null;
  name: string;
  sku?: string | null;
  stock_count: number;
  min_stock_level: number;
  price: number;
  image_url?: string | null;
  created_at: string;
  last_updated: string;
  category?: Category;
}

export interface ProductFilters extends PaginationParams {
  category_id?: number;
  search?: string;
  sort_by?: keyof Product;
  sort_dir?: 'asc' | 'desc';
  [key: string]: any;
}

export type ProductResponse = ApiResponse<Product>;
export type ProductsResponse = PaginatedApiResponse<Product>;
export type CategoriesResponse = ApiResponse<Category[]>;
