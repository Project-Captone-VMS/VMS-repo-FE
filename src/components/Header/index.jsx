import React from "react";
import { Menu } from "lucide-react";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-md">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6 text-black dark:text-white" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold">Welcome Hoang Lanh</h1>
            <p>Track, manage and forecast your customers and orders.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <DropdownNotification />
          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
