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
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f5f7fa]">
            <div className="mx-auto max-w-screen p-2 md:p-4 2xl:p-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
