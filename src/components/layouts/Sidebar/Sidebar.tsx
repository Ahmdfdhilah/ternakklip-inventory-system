import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { MenuItem, generalMenus, adminMenus } from '@/lib/menus';
import SidebarToggle from './SidebarToggle';
import SidebarContent from './SidebarContent';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  handleLogout: () => void;
}

const canAccessMenu = (user: any, menu: MenuItem): boolean => {
  if (!user) return false;
  if (menu.visibilityCheck && !menu.visibilityCheck(user)) return false;
  if (menu.roles && menu.roles.length > 0) {
    if (menu.requireAllRoles) {
      return menu.roles.every((r) => user.role === r);
    }
    return menu.roles.includes(user.role) || menu.roles.length === 0;
  }
  return true;
};

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { userData, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const currentPath = location.pathname;
    const newExpandedMenus: string[] = [];
    [...generalMenus, ...adminMenus].forEach((menu) => {
      if (menu.subMenus) {
        const hasActiveSubmenu = menu.subMenus.some(
          (submenu) => currentPath === submenu.path || currentPath.startsWith(submenu.path + '/')
        );
        if (hasActiveSubmenu) newExpandedMenus.push(menu.path);
      }
    });
    setExpandedMenus(newExpandedMenus);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleMenuClick = (menu: MenuItem) => {
    if (!isSidebarOpen && menu.subMenus) {
      setIsSidebarOpen(true);
      if (!expandedMenus.includes(menu.path)) {
        setExpandedMenus((prev) => [...prev, menu.path]);
      }
    } else {
      handleNavigate(menu.path);
    }
  };

  const filterAccessible = (menus: MenuItem[]) =>
    menus.filter((menu) => {
      if (!canAccessMenu(userData, menu)) return false;
      if (menu.subMenus && menu.subMenus.length > 0) {
        const hasVisibleSubmenu = menu.subMenus.some((submenu) => canAccessMenu(userData, submenu));
        if (!hasVisibleSubmenu) return false;
      }
      return true;
    });

  const accessibleGeneralMenus = filterAccessible(generalMenus);
  const accessibleAdminMenus = filterAccessible(adminMenus);

  const isMenuActive = (menu: MenuItem): boolean => {
    if (location.pathname === menu.path) return true;
    if (menu.subMenus) {
      return menu.subMenus.some((sub) => location.pathname === sub.path);
    }
    return false;
  };

  const isSubmenuActive = (path: string): boolean => location.pathname === path;

  const toggleAccordion = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((item) => item !== path) : [...prev, path]
    );
  };

  const getUserFullName = () => userData?.name || '';
  const getPrimaryRole = () => userData?.role || 'Member';
  const getUserInitials = () => {
    const name = userData?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (!isAuthenticated || !userData) {
    return (
      <>
        {!isMobile && (
          <aside
            className={cn(
              'fixed h-screen bg-background border-r transition-all duration-300 ease-in-out z-50',
              isSidebarOpen ? 'w-52' : 'w-16'
            )}
          />
        )}
        {!isMobile && (
          <div
            className={cn(
              'transition-all duration-300 ease-in-out shrink-0',
              isSidebarOpen ? 'w-52' : 'w-16'
            )}
          />
        )}
      </>
    );
  }

  const contentProps = {
    accessibleGeneralMenus,
    accessibleAdminMenus,
    expandedMenus,
    toggleAccordion,
    isMenuActive,
    isSubmenuActive,
    handleNavigate,
    handleMenuClick,
    handleLogout,
    isSidebarOpen,
    setIsSidebarOpen,
    isMobile,
    userData,
    getUserInitials,
    getUserFullName,
    getPrimaryRole,
  };

  return (
    <>
      {isMobile && (
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-52 sm:max-w-sm border-r">
            <SidebarContent {...contentProps} />
          </SheetContent>
        </Sheet>
      )}

      {!isMobile && (
        <aside
          className={cn(
            'fixed h-screen bg-background border-r transition-all duration-300 ease-in-out z-50',
            isSidebarOpen ? 'w-52 translate-x-0' : 'w-16 translate-x-0'
          )}
        >
          <SidebarContent {...contentProps} />
          <SidebarToggle isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </aside>
      )}

      {!isMobile && (
        <div
          className={cn('transition-all duration-300 ease-in-out shrink-0', isSidebarOpen ? 'w-52' : 'w-16')}
        />
      )}
    </>
  );
};

export default Sidebar;
