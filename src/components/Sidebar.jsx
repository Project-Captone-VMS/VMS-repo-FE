import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Truck,
  Users,
  Map,
  Warehouse,
  BarChart2,
  MessageSquare,
  FileText,
  Settings,
  Route,
} from "lucide-react";
import Logo from "../assets/images/logo.png";

const Sidebar = ({ isOpen, role }) => {
  const location = useLocation();

  const sb_menuItems = [
    { path: "/vehicle", icon: Truck, label: "Vehicle Management" },
    { path: "/driver", icon: Users, label: "Driver Management" },
    { path: "/realtime", icon: Map, label: "Realtime Tracking" },
    { path: "/warehouse", icon: Warehouse, label: "Warehouse Management" },
    { path: "/route", icon: Route, label: "route" },
    { path: "/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/chat", icon: MessageSquare, label: "Internal Chat" },
    { path: "/reports", icon: FileText, label: "Reports" },
  ];

  const filteredMenuItems =
    role === "USER"
      ? sb_menuItems.filter((item) => item.path === "/realtime")
      : sb_menuItems;

  return (
    <div
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col bg-black transition-transform duration-300 ease-linear dark:bg-boxdark ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static lg:translate-x-0`}
    >
      <div>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-5 py-3 lg:py-6"
        >
          <img src={Logo} alt="Logo" className="w-16 h-12" />
          <p className="text-white text-3xl font-bold">VMS</p>
        </NavLink>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto">
        <ul className="text-white">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 text-sm rounded-sm
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800">
        <button className="w-full flex items-center py-3 text-sm text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200">
          <Settings className="w-5 h-5 mr-3 text-gray-400" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
