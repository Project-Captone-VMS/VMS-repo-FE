import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Car,
  UserRoundPen,
  ChevronRight,
  Bolt,
  SquareChartGantt,
  MapPinHouse,
} from "lucide-react";
import Logo from "../assets/images/logo.png";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col bg-black transition-transform duration-300 ease-linear dark:bg-boxdark ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:static lg:translate-x-0`}
    >
      <div className="flex items-center gap-3 px-5 py-3 lg:py-6">
        <NavLink to="/">
          <img src={Logo} alt="Logo" className="w-16 h-12" />
        </NavLink>
        <p className="text-white text-3xl font-bold">VMS</p>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto">
        {/* <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <h3 className="mb-1 ml-4 text-sm font-semibold text-white">MENU</h3>
        </nav> */}
        <ul className="text-white">
          {/* <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(1)}
          >
            <LayoutGrid className="mr-2" />
            Dashboard
            <ChevronRight
              className={`ml-auto transition-transform ${
                open === 1 ? "rotate-90" : ""
              }`}
            />
          </li>
          {open === 1 && (
            <ul className="ml-8">
              <li className="flex items-center p-2">Analytics</li>
              <li className="flex items-center p-2">Reporting</li>
              <li className="flex items-center p-2">Projects</li>
            </ul>
          )} */}

          <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(1)}
          >
            <UserRoundPen className="mr-2" />
            Driver
            <ChevronRight
              className={`ml-auto transition-transform ${
                open === 1 ? "rotate-90" : ""
              }`}
            />
          </li>
          {open === 1 && (
            <ul className="ml-8">
              <li className="flex items-center p-2">Orders</li>
              <li className="flex items-center p-2">Products</li>
            </ul>
          )}

          <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(2)}
          >
            <Car className="mr-2" />
            Vehicle
            <ChevronRight
              className={`ml-auto transition-transform ${
                open === 2 ? "rotate-90" : ""
              }`}
            />
          </li>
          {open === 2 && (
            <ul className="ml-8">
              <li className="flex items-center p-2">Models</li>
              <li className="flex items-center p-2">Maintenance</li>
            </ul>
          )}

          <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(3)}
          >
            <MapPinHouse className="mr-2" />
            Real-time tracking
          </li>
          <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(3)}
          >
            <SquareChartGantt className="mr-2" />
            Manager
          </li>
          <li
            className="flex items-center p-3 cursor-pointer hover:bg-slate-800"
            onClick={() => handleOpen(3)}
          >
            <Bolt className="mr-2" />
            Update
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
