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
import { over } from "stompjs";
import SockJS from "sockjs-client";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0); // Số đếm thông báo chưa đọc
  const [selectedNotification, setSelectedNotification] = useState(null); // Thông báo được chọn

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

    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);

    client.connect(
      {},
      () => {
        console.log(`Connected to WebSocket as ${username}`);
        client.subscribe(`/user/${username}/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          console.log("notification:", notification);
          alert(`Bạn có tin nhắn mới: ${notification.title}`);

          // setNotifications((prev) => {
          //   const updatedNotifications = [...prev, notification];
          //   localStorage.setItem(
          //     "notifications",
          //     JSON.stringify(updatedNotifications)
          //   ); // Lưu thông báo vào localStorage
          //   setNotificationCount(updatedNotifications.length); // Cập nhật số lượng thông báo mới
          //   return updatedNotifications;
          // });

          // // Hiển thị thông báo ngay lập tức
          // alert(`Bạn có tin nhắn mới: ${notification.title}`);

          // setNotifications((prevNotifications) => {
          //   const isDuplicate = prevNotifications.some(
          //     (notif) => notif.id === notification.id
          //   );
          //   if (isDuplicate) {
          //     return prevNotifications;
          //   }

          //   const updatedNotifications = [...prevNotifications, notification];
          //   localStorage.setItem(
          //     "notifications",
          //     JSON.stringify(updatedNotifications)
          //   );
          //   setNotificationCount(updatedNotifications.length);

          //   return updatedNotifications;
          // });

          setNotifications((prevNotifications) => {
            const updatedNotifications = [
              ...prevNotifications.filter(
                (notif) => notif.id !== notification.id
              ),
              notification,
            ];

            localStorage.setItem(
              "notifications",
              JSON.stringify(updatedNotifications)
            );
            setNotificationCount(updatedNotifications.length);

            return updatedNotifications;
          });
          alert(`Bạn có tin nhắn mới: ${notification.title}`);
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
    setNotificationCount(0); // Reset số đếm khi mở danh sách thông báo
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowNotifications(false);
  };

  const handleLogout = () => {
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
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notifications
                  </h3>
                </div>
                {notifications.length > 0 ? (
                  <ul className="px-4 py-2">
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="border-b last:border-0 py-3 hover:bg-gray-50"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <p className="text-sm font-medium text-gray-700">
                          <strong>{notif.title}</strong>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {notif.content}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Type: <em>{notif.type}</em>
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

      {selectedNotification && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedNotification.title}
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              {selectedNotification.content}
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
