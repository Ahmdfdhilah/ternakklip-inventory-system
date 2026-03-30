export interface CurrentUser {
  id: string;
  name: string;
  email: string | null;
  avatar_path: string | null;
  role: string;
  is_active: boolean;
}

export const getDisplayName = (user: CurrentUser | null): string => {
  if (!user) return '';
  return user.name || user.email || 'User';
};

export const isAdmin = (user: CurrentUser | null): boolean => {
  return user?.role === 'admin';
};

export const isSuperAdmin = (user: CurrentUser | null): boolean => {
  return user?.role === 'super_admin' || user?.role === 'superadmin';
};

export const canManage = (user: CurrentUser | null): boolean => {
  return ['admin', 'super_admin', 'superadmin'].includes(user?.role ?? '');
};

export const isMember = (user: CurrentUser | null): boolean => {
  return user?.role === 'member';
};
