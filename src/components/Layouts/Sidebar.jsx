import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Truck,
  Users, 
  Map,
  Warehouse,
  BarChart2,
  MessageSquare,
  FileText,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/vehicle', icon: Truck, label: 'Vehicle Management' },
    { path: '/driver', icon: Users, label: 'Driver Management' },
    { path: '/realtime', icon: Map, label: 'Realtime Tracking' },
    { path: '/warehouse', icon: Warehouse, label: 'Warehouse Management' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/chat', icon: MessageSquare, label: 'Internal Chat' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen text-gray-100 shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-center">
          <img 
            className="h-12 w-auto rounded-md shadow-md transition-transform hover:scale-105" 
            src="/src/assets/image/Logo-Photoroom.png" 
            alt="Logo"
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4">
        <div className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm rounded-lg
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Settings Button */}
      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center px-4 py-3 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3 text-gray-400" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;