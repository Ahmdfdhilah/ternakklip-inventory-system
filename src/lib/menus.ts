import { LayoutDashboard, Users, Package } from 'lucide-react';
import type { CurrentUser } from '@/services/auth/types';

export interface MenuItem {
  title: string;
  path: string;
  icon?: any;
  roles?: string[];
  requireAllRoles?: boolean;
  subMenus?: MenuItem[];
  visibilityCheck?: (user: CurrentUser | null) => boolean;
}

const isAdmin = (user: CurrentUser | null) =>
  user?.role === 'admin' || user?.role === 'super_admin' || user?.role === 'superadmin';

export const generalMenus: MenuItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    roles: [],
  },
  {
    title: 'Inventory',
    path: '/inventory',
    icon: Package,
    roles: [],
  },
];

export const adminMenus: MenuItem[] = [
  {
    title: 'Pengguna',
    path: '/settings/users',
    icon: Users,
    roles: ['admin', 'super_admin', 'superadmin'],
    visibilityCheck: isAdmin,
  },
];
