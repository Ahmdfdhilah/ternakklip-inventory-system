import { ReactNode, useState, useEffect } from 'react';
import { getUserInitials, getUserFullName } from '@/utils/userUtils';
import Sidebar from './Sidebar/Sidebar';
import { cn } from '@/lib/utils';
import TopNav from './TopNav';
import { useAuthStore } from '@/stores/authStore';
import PageHeader from './PageHeader';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { userData, logout } = useAuthStore();

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="flex flex-col flex-1 overflow-y-auto min-w-0">
        <TopNav
          userData={userData}
          getUserInitials={() => getUserInitials(userData?.name)}
          getUserFullName={() => getUserFullName(userData?.name)}
          handleLogout={handleLogout}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isMobile={isMobile}
        />
        <PageHeader />
        <main className={cn('flex-1', 'transition-all duration-300')}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
