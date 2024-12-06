import React, { useState, useEffect } from "react";

import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { getUserByUsername, getNoti } from "../../services/apiRequest";
import { over } from "stompjs";
import {
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import User from "../../assets/images/user.png";
import SockJS from "sockjs-client";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (userRole === "USER") {
      const storedNotifications =
        JSON.parse(localStorage.getItem("notifications")) || [];
      setNotifications(storedNotifications);
      setNotificationCount(storedNotifications.length);
    }
  }, [userRole]);

  useEffect(() => {
    if (!username) return;

    const getNotice = async () => {
      const res = await getNoti(username);
      if (res) {
        setNotifications(res);
        setNotificationCount(res.length);
      }
    };

    getNotice();

    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);

    client.connect(
      {},
      () => {
        console.log(`Connected to WebSocket as ${username}`);
        toast.info("Logged in successfully");

        client.subscribe(`/user/${username}/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          console.log("notification:", notification);

          toast.success(
            `New notification: ${
              notification.title || "You have a new message!"
            }`
          );

          getNotice();
        });
      },
      (error) => {
        console.error("Error connecting to WebSocket:", error);
      }
    );

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, [username]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setNotificationCount(0);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    dispatch(logout());
    navigate("/login");
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotifications(false);
  };

  const handleClosePopUp = () => {
    setSelectedNotification(null);
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
              className="p-2 rounded-full hover:bg-gray-100 flex"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount.length > 0 && (
                <p className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-black bg-red-500 rounded-full">
                  {notificationCount.length}
                </p>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg  z-50 max-h-96 overflow-y-auto">
                <div className="px-2 py-2 border-b border-gray-100 bg-white">
                  <h2 className="text-xl  font-bold text-gray-900">
                    Notifications
                  </h2>
                </div>
                {notifications.length > 0 ? (
                  <ul className="px-3 py-1 mt-2 flex flex-col gap-1 ">
                    {notifications.slice(-5).map((notice) => (
                      <li
                        key={notice.id}
                        className="border-0 mb-2 px-2 rounded-lg  py-1 hover:bg-gray-200 shadow-md bg-slate-100 cursor-pointer"
                        onClick={() => handleNotificationClick(notice)}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          <strong>
                            {notice.notification?.title || "No Title"}
                          </strong>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notice.notification?.content || "No Content"}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    You have no new notifications.
                  </div>
                )}
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
                  <Link to="/profile">Profile Information</Link>
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

      {selectedNotification && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedNotification.notification.title}
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              {selectedNotification.notification.content}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClosePopUp}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
