import { useState, useRef, useCallback, useEffect } from 'react';
import { Bell, LogOut, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/stores/layoutStore';
import PageBreadcrumb from '@/components/layouts/PageBreadcrumb';
import type { CurrentUser } from '@/stores/authStore';
import { generalMenus, adminMenus, type MenuItem } from '@/lib/menus';

interface TopNavProps {
  userData: CurrentUser | null;
  getUserInitials: () => string;
  getUserFullName: () => string;
  handleLogout: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isMobile: boolean;
}

const allMenus: MenuItem[] = [
  ...generalMenus,
  ...adminMenus,
  ...generalMenus.flatMap((m) => m.subMenus ?? []),
  ...adminMenus.flatMap((m) => m.subMenus ?? []),
];

const TopNav: React.FC<TopNavProps> = ({
  userData,
  getUserInitials,
  getUserFullName,
  handleLogout,
  setIsSidebarOpen,
  isMobile,
}) => {
  const { header } = useLayoutStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredMenus = searchQuery.trim()
    ? allMenus.filter((m) => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : allMenus;

  const handleSelectMenu = useCallback(
    (path: string) => {
      navigate(path);
      setSearchQuery('');
      setIsSearchOpen(false);
      inputRef.current?.blur();
    },
    [navigate]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav
      className={cn(
        'flex w-full items-center justify-between px-4 md:px-6 z-40 bg-background border-b border-border py-3 md:py-4',
        isMobile ? 'sticky top-0 shadow-sm min-h-[60px]' : 'relative min-h-[72px]'
      )}
    >
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="h-10 w-10 text-muted-foreground hover:bg-accent shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Search bar with suggestion dropdown */}
        <div ref={containerRef} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            ref={inputRef}
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:bg-background transition-colors"
          />
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-popover border border-border rounded-md shadow-md py-1 overflow-hidden">
              {filteredMenus.length === 0 ? (
                <p className="text-sm text-muted-foreground px-3 py-2">Menu tidak ditemukan.</p>
              ) : (
                filteredMenus.map((menu) => (
                  <button
                    key={menu.path}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectMenu(menu.path);
                    }}
                  >
                    {menu.icon && <menu.icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span>{menu.title}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {isMobile && header?.breadcrumb && header.breadcrumb.length > 0 && (
          <div className="hidden sm:block shrink-0">
            <PageBreadcrumb items={header.breadcrumb} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        {header?.actions && (
          <div className="hidden sm:flex items-center gap-2 mr-1">{header.actions}</div>
        )}

        {/* Notifikasi */}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:bg-accent relative"
          title="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {/* Ganti dengan logika notif nyata */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>

        {/* User menu */}
        {userData && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 ml-1 focus-visible:ring-0 hover:bg-accent rounded-full">
                <Avatar className="h-9 w-9 border border-border shrink-0">
                  <AvatarImage src={userData.avatar_path || undefined} alt={getUserFullName()} />
                  <AvatarFallback className="text-sm font-medium bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1">
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
        )}
      </div>
    </nav>
  );
};

export default TopNav;
