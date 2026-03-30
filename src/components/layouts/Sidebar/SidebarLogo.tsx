import Logo from '@/assets/logo/logo.png';

interface SidebarLogoProps {
  isSidebarOpen: boolean;
  isMobile: boolean;
}

const SidebarLogo: React.FC<SidebarLogoProps> = ({
  isSidebarOpen,
  isMobile,
}) => {
  return (
    <div className="flex h-16 items-center px-4">
      <div className="items-center  py-2 w-full gap-2">
        {!isSidebarOpen && (
          <img
            src={Logo}
            alt="Company Logo"
            className="h-9"
          />
        )}

        {(isSidebarOpen || isMobile) && (
          <div className="flex items-center">
          <img
            src={Logo}
            alt="Company Logo"
            className="h-[65px]"
          />
          <span className="text-xl font-bold hidden lg:flex">TernakKlip</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarLogo;
