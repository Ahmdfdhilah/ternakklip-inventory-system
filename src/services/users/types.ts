import type { PaginationParams } from '@/services/base/types';

export type UserRole = 'super_admin' | 'admin' | 'user';
export type SortDir = 'asc' | 'desc';
export type SortField = 'name' | 'role' | 'is_active' | 'created_at';

export interface UserResponse {
  id: string;
  name: string;
  email: string | null;
  avatar_path: string | null;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface ListUsersParams extends PaginationParams {
  search?: string;
  role?: string;
  is_active?: boolean;
  sort_by?: SortField;
  sort_dir?: SortDir;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  role?: UserRole;
}

export interface UpdateUserRoleRequest {
  role: UserRole;
}
