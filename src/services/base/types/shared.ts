export interface ApiResponse<T = any> {
  error: boolean;
  message: string;
  timestamp: string;
  data: T;
}

export interface PaginatedApiResponse<T = any> {
  error: boolean;
  message: string;
  timestamp: string;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
  has_prev_page: boolean;
  has_next_page: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  error: true;
  message: string;
  timestamp: string;
  data?: any;
  detail?: string;
}
