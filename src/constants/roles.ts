import type { UserRole } from '@/services/users/types';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  user: 'Pengguna',
};

export const ROLE_VARIANTS: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
  super_admin: 'default',
  admin: 'secondary',
  user: 'outline',
};
