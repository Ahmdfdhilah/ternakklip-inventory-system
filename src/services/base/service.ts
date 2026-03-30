import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from './types';

export class BaseService {
  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected get db() {
    return supabase.from(this.tableName);
  }

  protected wrapSingle<T>(
    data: T | null,
    error: PostgrestError | null,
    message = 'Berhasil',
  ): ApiResponse<T> {
    if (error) throw error;
    return {
      error: false,
      message,
      timestamp: new Date().toISOString(),
      data: data as T,
    };
  }

  protected wrapPaginated<T>(
    data: T[] | null,
    error: PostgrestError | null,
    count: number | null,
    params: PaginationParams,
    message = 'Berhasil',
  ): PaginatedApiResponse<T> {
    if (error) throw error;
    const page       = params.page  ?? 1;
    const limit      = params.limit ?? 10;
    const totalItems = count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    return {
      error: false,
      message,
      timestamp: new Date().toISOString(),
      data: data ?? [],
      meta: {
        page,
        limit,
        total_items:  totalItems,
        total_pages:  totalPages,
        has_prev_page: page > 1,
        has_next_page: page < totalPages,
      },
    };
  }
}
