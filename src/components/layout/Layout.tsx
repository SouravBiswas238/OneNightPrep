import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Button from '../ui/Button';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto close sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      } else if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar - full on desktop, off-canvas on mobile */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 ease-in-out transform bg-card border-r border-border lg:translate-x-0 lg:relative lg:flex-shrink-0`}
      >
        <Sidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Backdrop on mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-card border-b border-border lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="text-lg font-medium">One Night Preparation</div>
          <div className="w-6"></div> {/* Empty div for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;