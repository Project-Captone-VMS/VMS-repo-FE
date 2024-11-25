import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import {
  Truck,
  Users,
  Map,
  Warehouse,
  BarChart2,
  MessageSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Route,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen, role }) => {
  const location = useLocation();

  const sb_menuItems = [
    { path: "/vehicle", icon: Truck, label: "Vehicle Management" },
    { path: "/driver", icon: Users, label: "Driver Management" },
    { path: "/realtime", icon: Map, label: "Realtime Tracking" },
    { path: "/warehouse", icon: Warehouse, label: "Warehouse Management" },
    { path: "/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/route", icon: Route, label: "Route Management" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/reports", icon: FileText, label: "Reports" },
  ];

  const filteredMenuItems =
    role === "USER"
      ? sb_menuItems.filter((item) => item.path === "/realtime")
      : sb_menuItems;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside className={`h-screen bg-black transition-all duration-300 ease-linear dark:bg-boxdark ${isOpen ? "w-60" : "w-16"} sticky top-0 left-0`}>
      {/* Logo Section */}
      <div className="flex flex-col">
        <NavLink
          to="/dashboard"
          className={`flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-4`}
        >
          <img 
            src={Logo} 
            alt="Logo" 
            className={`transition-all duration-300 ${isOpen ? "w-12 h-9" : "w-10 h-8"}`} 
          />
          <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "ml-2 w-auto opacity-100" : "w-0 opacity-0"}`}>
            <p className="text-white text-2xl font-bold whitespace-nowrap">VMS</p>
          </div>
        </NavLink>
        
        {/* Menu Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200 ease-in-out border-b border-gray-800`}
        >
          <Menu className={`w-5 h-5 ${isOpen ? "mr-3" : ""} text-gray-400`} />
          <span className={`font-medium transition-all duration-300 overflow-hidden ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Menu
          </span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="text-white py-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-2
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
                title={!isOpen ? item.label : ""}
              >
                <Icon
                  className={`w-5 h-5 ${isOpen ? "mr-3" : ""} ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className={`font-medium transition-all duration-300 overflow-hidden ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="border-t border-gray-800">
        <button 
          className={`w-full flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-3 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200`}
          title={!isOpen ? "Settings" : ""}
        >
          <Settings className={`w-5 h-5 ${isOpen ? "mr-3" : ""} text-gray-400`} />
          <span className={`font-medium transition-all duration-300 overflow-hidden ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
            Settings
          </span>
        </button>
      </div>

 
    </aside>
  );
};

export default Sidebar;