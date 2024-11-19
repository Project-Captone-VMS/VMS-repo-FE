import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import User from "../../assets/images/user.png";
import { logout } from "../../redux/authSlice";
import { getUserByUsername } from "../../services/apiRequest";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("");

  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mockNotifications = [
    { id: 1, message: "New update available", time: "5m ago" },
    { id: 2, message: "Welcome to the dashboard", time: "1h ago" },
    { id: 3, message: "Your profile was updated", time: "2h ago" },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserByUsername(username);
        const userData = response.result;
        if (username === "admin") {
          setFullName("");
        } else {
          const { firstName, lastName } = userData;
          setFullName(`${firstName} ${lastName}`);
        }
        setFullName(`${firstName} ${lastName}`);
        console.log(setFullName);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white shadow-md">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-black" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold">
              Welcome <span className="text-fuchsia-400">{fullName}</span>
            </h1>
            <p>Track, manage, and forecast your customers and orders.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {mockNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="px-4 py-3 hover:bg-gray-50 border-b last:border-0"
                  >
                    <p className="text-sm text-gray-700">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={User}
                  alt="Admin Avatar"
                />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-sm font-medium text-gray-900">
                  {fullName || ""}
                </p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <UserCircle className="w-4 h-4" />
                  Profile Information
                </button>
                <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
