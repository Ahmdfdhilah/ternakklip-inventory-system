import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { MenuItem } from '@/lib/menus';
import type { CurrentUser } from '@/stores/authStore';

interface SidebarMenuProps {
  accessibleGeneralMenus: MenuItem[];
  accessibleAdminMenus: MenuItem[];
  expandedMenus: string[];
  toggleAccordion: (path: string) => void;
  isMenuActive: (menu: MenuItem) => boolean;
  isSubmenuActive: (path: string) => boolean;
  handleNavigate: (path: string) => void;
  handleMenuClick: (menu: MenuItem) => void;
  isSidebarOpen: boolean;
  isMobile: boolean;
  userData: CurrentUser;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  accessibleGeneralMenus,
  accessibleAdminMenus,
  expandedMenus,
  toggleAccordion,
  isMenuActive,
  isSubmenuActive,
  handleNavigate,
  handleMenuClick,
  isSidebarOpen,
  isMobile,
}) => {
  const showLabels = isSidebarOpen || isMobile;

  const renderMenuItem = (menu: MenuItem, index: number) =>
    menu.subMenus && showLabels ? (
      <Accordion
        key={index}
        type="multiple"
        value={expandedMenus}
        onValueChange={(value) => {
          if (value.includes(menu.path) && !expandedMenus.includes(menu.path)) {
            toggleAccordion(menu.path);
          } else if (!value.includes(menu.path) && expandedMenus.includes(menu.path)) {
            toggleAccordion(menu.path);
          }
        }}
        className="border-none"
      >
        <AccordionItem value={menu.path} className="border-none">
          <AccordionTrigger
            className={cn(
              'flex items-center gap-2 px-3 py-2 my-2 text-sm rounded-md no-underline hover:no-underline',
              isMenuActive(menu)
                ? 'bg-accent text-accent-foreground font-medium'
                : 'hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              {menu.icon && <menu.icon className="h-4 w-4" />}
              <span>{menu.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1 mt-1 ml-6">
              {menu.subMenus.map((submenu, subIndex) => (
                <Link
                  key={subIndex}
                  to={submenu.path}
                  className={cn(
                    'flex items-center justify-start h-8 px-3 py-2 text-xs font-normal rounded-md transition-colors',
                    isSubmenuActive(submenu.path)
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey) {
                      handleNavigate(submenu.path);
                      e.preventDefault();
                    }
                  }}
                >
                  {submenu.title}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : menu.subMenus && !showLabels ? (
      <div
        key={index}
        className={cn(
          'flex items-center justify-center w-10 h-10 mx-auto rounded-md mb-1 cursor-pointer transition-colors',
          isMenuActive(menu)
            ? 'bg-accent text-accent-foreground font-medium'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
        onClick={() => handleMenuClick(menu)}
        title={menu.title}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') handleMenuClick(menu);
        }}
      >
        {menu.icon && <menu.icon className="h-4 w-4" />}
      </div>
    ) : (
      <Link
        key={index}
        to={menu.path}
        className={cn(
          'flex items-center rounded-md h-10 w-full transition-colors',
          isMenuActive(menu)
            ? 'bg-accent text-accent-foreground font-medium'
            : 'hover:bg-accent hover:text-accent-foreground',
          showLabels ? 'justify-start gap-2 px-3 py-2 text-sm' : 'justify-center w-10 mx-auto'
        )}
        onClick={(e) => {
          if (!e.ctrlKey && !e.metaKey) {
            handleNavigate(menu.path);
            e.preventDefault();
          }
        }}
        title={menu.title}
      >
        {menu.icon && <menu.icon className="h-4 w-4" />}
        {showLabels && <span>{menu.title}</span>}
      </Link>
    );

  return (
    <ScrollArea className={cn('flex-1 py-2 overflow-y-auto', showLabels ? 'px-2' : 'px-1')}>
      <nav className="flex flex-col gap-1">
        {accessibleGeneralMenus.map((menu, index) => renderMenuItem(menu, index))}

        {accessibleAdminMenus.length > 0 && (
          <div className="mt-4">
            {showLabels && (
              <div className="px-3 mb-2">
                <span className="text-xs font-semibold text-muted-foreground tracking-tight">
                  Pengaturan
                </span>
              </div>
            )}
            {!showLabels && <Separator className="w-8 mx-auto my-2" />}
            {accessibleAdminMenus.map((menu, index) => renderMenuItem(menu, index + 100))}
          </div>
        )}
      </nav>
    </ScrollArea>
  );
};

export default SidebarMenu;
