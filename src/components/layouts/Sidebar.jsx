// Sidebar.jsx
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
    { path: '/route', icon: Map, label: 'Route Planning' },
    { path: '/warehouse', icon: Warehouse, label: 'Warehouse Management' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/chat', icon: MessageSquare, label: 'Internal Chat' },
    { path: '/reports', icon: FileText, label: 'Reports' },
  ];

  return (
    <aside className="w-[200px] bg-[#1a1a1a] min-h-screen text-white">
      <div className="p-4">
        <div className="h-8 w-8 bg-red-600"></div>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-800 ${
                isActive ? 'bg-gray-800' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4">
        <button className="flex items-center gap-2 text-sm">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;