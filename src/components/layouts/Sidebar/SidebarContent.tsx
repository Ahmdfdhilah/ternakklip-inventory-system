import { MenuItem } from '@/lib/menus';
import type { CurrentUser } from '@/stores/authStore';
import SidebarLogo from './SidebarLogo';
import SidebarMenu from './SidebarMenu';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarContentProps {
  accessibleGeneralMenus: MenuItem[];
  accessibleAdminMenus: MenuItem[];
  expandedMenus: string[];
  toggleAccordion: (path: string) => void;
  isMenuActive: (menu: MenuItem) => boolean;
  isSubmenuActive: (path: string) => boolean;
  handleNavigate: (path: string) => void;
  handleLogout: () => void;
  handleMenuClick: (menu: MenuItem) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  userData: CurrentUser;
  getUserInitials: () => string;
  getUserFullName: () => string;
}

const SidebarContent: React.FC<SidebarContentProps> = ({
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
  isMobile,
  userData,
  getUserInitials,
  getUserFullName,
}) => {
  const showLabels = isSidebarOpen || isMobile;

  return (
    <div className="flex h-screen flex-col">
      <SidebarLogo isSidebarOpen={isSidebarOpen} isMobile={isMobile} />

      <SidebarMenu
        accessibleGeneralMenus={accessibleGeneralMenus}
        accessibleAdminMenus={accessibleAdminMenus}
        expandedMenus={expandedMenus}
        toggleAccordion={toggleAccordion}
        isMenuActive={isMenuActive}
        isSubmenuActive={isSubmenuActive}
        handleNavigate={handleNavigate}
        handleMenuClick={handleMenuClick}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        userData={userData}
      />

      <div className={cn('p-4 border-t mt-auto', !isSidebarOpen && !isMobile && 'flex justify-center p-2')}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="hover:bg-gray-100 hover:text-gray-900">
            <Button
              variant="ghost"
              className={cn(
                'w-full p-0 focus-visible:ring-0 hover:bg-gray-100 rounded-full',
                isSidebarOpen || isMobile
                  ? 'flex items-center justify-start gap-2.5 px-2 py-1.5 rounded-lg h-auto'
                  : 'h-10 w-10 flex justify-center items-center'
              )}
            >
              <Avatar className="h-9 w-9 border border-border shrink-0">
                <AvatarImage src={userData.avatar_path || undefined} alt={getUserFullName()} />
                <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              {showLabels && (
                <div className="flex flex-col items-start text-left min-w-0 flex-1">
                  <span className="text-sm font-semibold leading-none truncate w-full">{getUserFullName()}</span>
                  <span className="text-xs text-muted-foreground truncate w-full mt-1">{userData.email}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={showLabels ? 'end' : 'center'}
            side={showLabels ? 'top' : 'right'}
            className="w-56"
            sideOffset={8}
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium leading-none truncate">{getUserFullName()}</p>
              <p className="text-xs text-muted-foreground truncate mt-1.5">{userData.email}</p>
            </div>
            <Separator className="my-1" />
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SidebarContent;
