import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, UserCircle, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  // Handle theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setIsDropdownOpen(false);
  };

  // Mock notifications - replace with your actual notification data
  const mockNotifications = [
    { id: 1, message: "New update available", time: "5m ago" },
    { id: 2, message: "Welcome to the dashboard", time: "1h ago" },
    { id: 3, message: "Your profile was updated", time: "2h ago" },
  ];

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('token'); // Remove auth token
    navigate('/login'); // Redirect to login page
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };

  return (
    <header className={`h-16 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} 
      border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} 
      flex items-center justify-between px-6 relative transition-colors duration-200`}>
      
      <div className="flex items-center">
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} 
            transition-colors`}
        >
          {isDarkMode ? 
            <Sun className="w-5 h-5 text-gray-300 hover:text-white" /> :
            <Moon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          }
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notification Button with Dropdown */}
        <div className="relative">
          <button 
            onClick={toggleNotifications}
            className={`p-2 relative ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} 
              rounded-full transition-colors`}
          >
            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            {mockNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              </div>
              {mockNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <p className="text-sm text-gray-700">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Admin Profile Section */}
        <div className="relative">
          <button 
            onClick={toggleDropdown}
            className={`flex items-center gap-2 p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} 
              rounded-lg transition-colors`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-600">
              <img 
                className="w-full h-full object-cover"
                src="/src/assets/image/Avatar.jpg"
                alt="Admin Avatar"
              />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-50' : 'text-gray-900'}`}>
                Jasmine Rose
              </p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
              <button 
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                Profile Information
              </button>
              <button 
                onClick={handleSettingsClick}
                className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
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
    </header>
  );
};

export default Header;