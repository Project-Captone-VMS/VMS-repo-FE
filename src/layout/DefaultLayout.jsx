import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header/Header";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark h-screen">
      <div className="flex h-full overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} role={role} />

        <div className={`flex flex-col flex-1`}>
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            className="sticky top-0 z-50 bg-white dark:bg-boxdark"
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-screen p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
