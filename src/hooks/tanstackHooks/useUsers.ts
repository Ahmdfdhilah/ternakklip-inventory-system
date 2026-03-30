import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '@/services/users';
import { handleApiError } from '@/utils/errorHandler';
import type { ApiResponse, PaginatedApiResponse } from '@/services/base/types';
import type {
  UserResponse,
  ListUsersParams,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserRoleRequest,
} from '@/services/users/types';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params?: ListUsersParams) => [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};

export const useUsers = (
  params?: ListUsersParams,
  options?: Omit<
    UseQueryOptions<PaginatedApiResponse<UserResponse>, Error, PaginatedApiResponse<UserResponse>, ReturnType<typeof usersKeys.list>>,
    'queryKey' | 'queryFn'
  >,
) => {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.listManageUsers(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCreateUser = (
  options?: Omit<UseMutationOptions<ApiResponse<UserResponse>, Error, CreateUserRequest>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: (data) => usersService.createUser(data),
    onSuccess: (res, vars, ctx, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success('Pengguna berhasil dibuat');
      onSuccess?.(res, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      toast.error(handleApiError(err).message);
      onError?.(err, vars, ctx, mutation);
    },
  });
};

export const useUpdateUser = (
  options?: Omit<UseMutationOptions<ApiResponse<UserResponse>, Error, { userId: string; data: UpdateUserRequest }>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: ({ userId, data }) => usersService.updateUser(userId, data),
    onSuccess: (res, vars, ctx, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(vars.userId) });
      toast.success('Pengguna berhasil diupdate');
      onSuccess?.(res, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      toast.error(handleApiError(err).message);
      onError?.(err, vars, ctx, mutation);
    },
  });
};

export const useUpdateUserRole = (
  options?: Omit<UseMutationOptions<ApiResponse<UserResponse>, Error, { userId: string; data: UpdateUserRoleRequest }>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: ({ userId, data }) => usersService.updateUserRole(userId, data),
    onSuccess: (res, vars, ctx, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success('Role pengguna berhasil diupdate');
      onSuccess?.(res, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      toast.error(handleApiError(err).message);
      onError?.(err, vars, ctx, mutation);
    },
  });
};

export const useSetUserActive = (
  options?: Omit<UseMutationOptions<ApiResponse<void>, Error, { userId: string; is_active: boolean }>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: ({ userId, is_active }) => usersService.setUserActive(userId, is_active),
    onSuccess: (res, vars, ctx, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success(vars.is_active ? 'Pengguna berhasil diaktifkan' : 'Pengguna berhasil dinonaktifkan');
      onSuccess?.(res, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      toast.error(handleApiError(err).message);
      onError?.(err, vars, ctx, mutation);
    },
  });
};

export const useDeleteUser = (
  options?: Omit<UseMutationOptions<ApiResponse<void>, Error, string>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const { onSuccess, onError, ...rest } = options || {};

  return useMutation({
    ...rest,
    mutationFn: (userId) => usersService.deleteUser(userId),
    onSuccess: (res, vars, ctx, mutation) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success('Pengguna berhasil dihapus');
      onSuccess?.(res, vars, ctx, mutation);
    },
    onError: (err, vars, ctx, mutation) => {
      toast.error(handleApiError(err).message);
      onError?.(err, vars, ctx, mutation);
    },
  });
};
