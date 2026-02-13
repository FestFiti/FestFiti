import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEvent } from '../context/eventHooks';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  Coins as DollarSign,
  Leaf,
  Bot,
  Menu,
  X
} from 'lucide-react';
import logo from '../assets/fest_fiti_black_logo.png';
import logoWithName from '../assets/fest_fiti_name_logo_black.png';

const Sidebar = ({ isCollapsed, isMobile, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useEvent();

  const navigationItems = useMemo(() => [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/app/dashboard',
      icon: LayoutDashboard,
      description: 'Event overview'
    },
    {
      id: 'events',
      name: 'Events',
      path: '/app/events',
      icon: Calendar,
      description: 'Event management'
    },
    {
      id: 'ticketguard',
      name: 'TicketGuard',
      path: '/app/ticketguard',
      icon: Ticket,
      description: 'Ticket validation'
    },
    {
      id: 'vendors',
      name: 'Vendors',
      path: '/app/vendors',
      icon: Users,
      description: 'Vendor management'
    },
    {
      id: 'budget',
      name: 'Budget',
      path: '/app/budget',
      icon: DollarSign,
      description: 'Budget tracking'
    },
    {
      id: 'sustainability',
      name: 'Sustainability',
      path: '/app/sustainability',
      icon: Leaf,
      description: 'Environmental impact'
    },
    {
      id: 'festbuddy',
      name: 'FestBuddy',
      path: '/app/festbuddy',
      icon: Bot,
      description: 'AI assistant'
    }
  ], []);

  const handleNavClick = (path) => {
    navigate(path);
    // Close mobile sidebar after navigation
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <div className="h-full bg-white shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(!isCollapsed && !isMobile) ? (
              <img
                src={logoWithName}
                alt="FestFiti"
                className="h-10 object-contain"
              />
            ) : (
              <img
                src={logo}
                alt="FestFiti"
                className="w-8 h-8 object-contain"
              />
            )}
          </div>

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={closeSidebar}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-none transition-colors ${
              location.pathname === item.path
                ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            title={isCollapsed || isMobile ? item.name : undefined}
          >
            <item.icon className="w-5 h-5" />
            {(!isCollapsed && !isMobile) && (
              <div className="flex-1 text-left">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Event Details - Only show when not collapsed and not mobile */}
      {(!isCollapsed && !isMobile) && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Event</h3>
            <div className="text-sm text-gray-600">
              <div className="font-medium text-gray-900">{state.eventDetails.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(state.eventDetails.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500">
                {state.eventDetails.venue}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile - Only show when not collapsed and not mobile */}
      {(!isCollapsed && !isMobile) && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm font-medium">EO</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                Event Organizer
              </div>
              <div className="text-xs text-gray-500">admin@festfiti.com</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
