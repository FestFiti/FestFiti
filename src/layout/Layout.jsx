import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Close mobile sidebar when switching to desktop
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Desktop: Fixed, Mobile: Overlay */}
      <div className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ${
        isMobile 
          ? isSidebarOpen 
            ? 'translate-x-0 w-64' 
            : '-translate-x-full w-64'
          : 'translate-x-0 w-64'
      } lg:translate-x-0 lg:w-64`}>
        <Sidebar 
          isCollapsed={false} 
          isMobile={isMobile}
          toggleSidebar={toggleSidebar} 
          closeSidebar={closeSidebar}
        />
      </div>
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        isMobile 
          ? 'ml-0' 
          : 'ml-64'
      } lg:ml-64`}>
        {/* Topbar - Mobile Hamburger + Desktop Topbar */}
        <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isSidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              
              {/* Mobile Logo */}
              <div className="flex items-center space-x-2">
                <img
                  src="/src/assets/fest_fiti_name_logo_black.png"
                  alt="FestFiti"
                  className="h-8 object-contain"
                />
              </div>
            </div>
          </div>

          {/* Desktop Topbar - Hidden on Mobile */}
          <div className="hidden lg:block">
            <Topbar />
          </div>
        </div>
        
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
