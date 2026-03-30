import { BaseService } from '../base/service';
import type { 
  Product, 
  ProductFilters, 
  ProductsResponse, 
  ProductResponse,
  CategoriesResponse,
  Category,
} from './types';
import type { ApiResponse } from '../base/types';
import { supabase } from '@/lib/supabase';

export class ProductService extends BaseService {
  constructor() {
    super('products');
  }

  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    let query = this.db.select('*, category:categories(*)', { count: 'exact' });

    if (filters.category_id && (filters.category_id as any) !== 'all') {
      const catId = typeof filters.category_id === 'string' ? parseInt(filters.category_id) : filters.category_id;
      if (!isNaN(catId)) {
        query = query.eq('category_id', catId);
      }
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order(filters.sort_by || 'created_at', { ascending: filters.sort_dir === 'asc' })
      .range(from, to);

    return this.wrapPaginated<Product>(data, error, count, { ...filters, page, limit });
  }

  async getProduct(id: number): Promise<ProductResponse> {
    const { data, error } = await this.db
      .select('*, category:categories(*)')
      .eq('id', id)
      .single();
    return this.wrapSingle<Product>(data, error);
  }

  async createProduct(payload: Partial<Product>): Promise<ProductResponse> {
    const { data, error } = await this.db.insert(payload).select().single();
    return this.wrapSingle<Product>(data, error);
  }

  async updateProduct(id: number, payload: Partial<Product>): Promise<ProductResponse> {
    const { id: _, created_at, last_updated, ...updateData } = payload as any;
    const { data, error } = await this.db
      .update({ ...updateData, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return this.wrapSingle<Product>(data, error);
  }

  async createCategory(name: string): Promise<ApiResponse<Category>> {
    const { data, error } = await supabase.from('categories').insert({ name }).select().single();
    return this.wrapSingle<Category>(data, error);
  }

  async updateCategory(id: number, name: string): Promise<ApiResponse<Category>> {
    const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select().single();
    return this.wrapSingle<Category>(data, error);
  }

  async deleteCategory(id: number): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    const { error } = await this.db.delete().eq('id', id);
    if (error) throw error;
    return {
      error: false,
      message: 'Produk berhasil dihapus',
      timestamp: new Date().toISOString(),
      data: null,
    };
  }

  async getCategories(): Promise<CategoriesResponse> {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    return this.wrapSingle<Category[]>(data, error);
  }

  async getDashboardStats() {
    const { data: products, error: pError } = await this.db.select('stock_count, min_stock_level, category_id');
    if (pError) throw pError;

    const totalStock = products.reduce((acc, p) => acc + p.stock_count, 0);
    const lowStockCount = products.filter(p => p.stock_count <= p.min_stock_level).length;
    const totalProducts = products.length;

    return {
      totalStock,
      lowStockCount,
      totalProducts
    };
  }

  subscribeToStockChanges(callback: (payload: any) => void) {
    return supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        callback
      )
      .subscribe();
  }

  async getCategoriesPaginated(page = 1, limit = 10): Promise<CategoriesResponse & { meta: any }> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('name')
      .range(from, to);
    
    const paginated = this.wrapPaginated<Category>(data, error, count, { page, limit });
    return paginated as any;
  }
}

export const productService = new ProductService();
