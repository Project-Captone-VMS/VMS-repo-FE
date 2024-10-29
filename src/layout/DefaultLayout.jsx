import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header/index";
import Dashboard from "../pages/Dashboard/Dashboard";
import { Outlet } from "react-router-dom";
// import Logo from "../../assets/images/Logo.png";

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden ">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex flex-1 flex-col">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            className="sticky top-0 z-50 bg-white dark:bg-boxdark"
          />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;
