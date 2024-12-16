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
  Menu,
  Route,
  BellDot,
  ChartSpline,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen, role }) => {
  const location = useLocation();

  const sb_menuItems = [
    { path: "/vehicle", icon: Truck, label: "Vehicle Management" },
    { path: "/driver", icon: Users, label: "Driver Management" },
    { path: "/routeDetail", icon: Users, label: "routeDetail" },
    { path: "/warehouse", icon: Warehouse, label: "Warehouse Management" },
    { path: "/analytics", icon: BarChart2, label: "Analytics" },
    { path: "/indexNotification", icon: BellDot, label: "indexNotification" },
    { path: "/route", icon: Route, label: "Route Management" },
    { path: "/chat", icon: MessageSquare, label: "Chat" },
    { path: "/reports", icon: FileText, label: "Reports" },
    { path: "/RealtimeTrackingUser", icon: Map, label: "RealtimeTrackingUser" },
    { path: "/showTrackingUser", icon: ChartSpline, label: "ShowTracking" },
  ];

  const filteredMenuItems =
    role === "USER"
      ? sb_menuItems.filter(
          (item) =>
            item.path === "/UserReceiver" ||
            item.path === "/RealtimeTrackingUser" ||
            item.path === "/showTrackingUser" ||
            item.path === "/routeDetail",
        )
      : role === "ADMIN"
        ? sb_menuItems.filter(
            (item) =>
              item.path === "/vehicle" ||
              item.path === "/driver" ||
              item.path === "/warehouse" ||
              item.path === "/analytics" ||
              item.path === "/indexNotification" ||
              item.path === "/route" ||
              item.path === "/chat" ||
              item.path === "/reports",
          )
        : sb_menuItems;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <aside
      className={`dark:bg-box-dark my-3 mx-2 rounded-md bg-black transition-all duration-300 ease-linear ${
        isOpen ? "w-60" : "w-16"
      } sticky left-0 top-0`}
    >
      <div className="flex flex-col items-center p-1">
        <NavLink
          to="/dashboard"
          className={`flex items-center ${
            isOpen ? "px-4" : "justify-center"
          } py-4`}
        >
          <img
            src={Logo}
            alt="Logo"
            className={`transition-all duration-300 ${
              isOpen ? "h-9 w-12" : "h-6 w-8"
            }`}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isOpen ? "ml-2 w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            <p className="whitespace-nowrap text-xl font-bold text-white">
              VMS
            </p>
          </div>
        </NavLink>
      </div>
      {/* Menu Toggle Button */}

      <div className="p-1">
        <button
          onClick={toggleSidebar}
          className={`flex items-center ${
            isOpen ? "px-2" : "justify-center"
          } w-full border-b border-gray-800 py-1 text-sm text-gray-300 transition-all duration-200 ease-in-out hover:bg-gray-800 hover:text-white`}
        >
          <Menu className={`h-6 w-6 ${isOpen ? "mr-2" : ""} text-gray-400`} />
          <span
            className={`overflow-hidden font-medium transition-all duration-300 ${
              isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            Menu
          </span>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-grow overflow-y-auto">
        <ul className="py-2 text-white">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center ${isOpen ? "px-4 py-2" : "justify-center py-1"} text-sm transition-all duration-200 ease-out ${
                  isActive
                    ? "bg-blue-800 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                } `}
                title={!isOpen ? item.label : ""}
              >
                <Icon
                  className={`h-5 w-5 ${isOpen ? "mr-3 mt-1" : "mt-3"} ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span
                  className={`overflow-hidden font-medium transition-all duration-300 ${
                    isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                  }`}
                >
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
          className={`flex w-full items-center ${
            isOpen ? "px-4" : "justify-center"
          } py-3 text-sm text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-white`}
          title={!isOpen ? "Settings" : ""}
        >
          <Settings
            className={`h-5 w-5 ${isOpen ? "mr-3" : ""} text-gray-400`}
          />
          <span
            className={`overflow-hidden font-medium transition-all duration-300 ${
              isOpen ? "w-auto opacity-100" : "w-0 opacity-0"
            }`}
          >
            Settings
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
