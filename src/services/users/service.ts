import { createClient } from '@supabase/supabase-js';
import { BaseService } from '@/services/base';
import type { ApiResponse, PaginatedApiResponse } from '@/services/base/types';
import type {
  UserResponse,
  ListUsersParams,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
} from './types';

const SELECT_COLS = 'id, name, email, avatar_path, role, is_active, created_at';

class UsersService extends BaseService {
  constructor() {
    super('users');
  }

  async listManageUsers(params?: ListUsersParams): Promise<PaginatedApiResponse<UserResponse>> {
    const page      = params?.page  ?? 1;
    const limit     = params?.limit ?? 100;
    const from      = (page - 1) * limit;
    const to        = from + limit - 1;
    const sortField = params?.sort_by  ?? 'created_at';
    const ascending = params?.sort_dir === 'asc';

    let query = this.db
      .select(SELECT_COLS, { count: 'exact' })
      .order(sortField, { ascending })
      .range(from, to);

    if (params?.search)                  query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    if (params?.role)                    query = query.eq('role', params.role);
    if (params?.is_active !== undefined) query = query.eq('is_active', params.is_active);

    const { data, error, count } = await query;
    return this.wrapPaginated<UserResponse>(data as UserResponse[], error, count, { page, limit });
  }

  async createUser(payload: CreateUserRequest): Promise<ApiResponse<UserResponse>> {
    const tempClient = createClient(
      import.meta.env.VITE_SUPABASE_URL as string,
      import.meta.env.VITE_SUPABASE_ANON_KEY as string,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: authData, error: authError } = await tempClient.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: { data: { name: payload.name } },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Gagal membuat akun pengguna');

    const { data, error } = await this.db
      .update({ name: payload.name, role: payload.role })
      .eq('id', authData.user.id)
      .select(SELECT_COLS)
      .single();

    return this.wrapSingle<UserResponse>(data as UserResponse, error, 'Pengguna berhasil dibuat');
  }

  async updateUser(userId: string, payload: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    const { data, error } = await this.db
      .update(payload)
      .eq('id', userId)
      .select(SELECT_COLS)
      .single();

    return this.wrapSingle<UserResponse>(data as UserResponse, error, 'Pengguna berhasil diupdate');
  }

  async updateUserRole(userId: string, payload: UpdateUserRoleRequest): Promise<ApiResponse<UserResponse>> {
    return this.updateUser(userId, { role: payload.role });
  }

  async setUserActive(userId: string, is_active: boolean): Promise<ApiResponse<void>> {
    const { error } = await this.db.update({ is_active }).eq('id', userId);
    return this.wrapSingle<void>(
      undefined,
      error,
      is_active ? 'Pengguna berhasil diaktifkan' : 'Pengguna berhasil dinonaktifkan',
    );
  }

  async deactivateUser(userId: string): Promise<ApiResponse<void>> {
    return this.setUserActive(userId, false);
  }

  async activateUser(userId: string): Promise<ApiResponse<void>> {
    return this.setUserActive(userId, true);
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const { error } = await this.db.delete().eq('id', userId);
    return this.wrapSingle<void>(undefined, error, 'Pengguna berhasil dihapus');
  }
}

export const usersService = new UsersService();
