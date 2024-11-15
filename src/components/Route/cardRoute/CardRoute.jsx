import React from "react";
import { Link, Outlet } from "react-router-dom";

const CardRoute = ({ name, route, isOpen, onClick }) => {

  
  return (
    <div className="cursor-pointer">
      <div
        onClick={onClick}
        className="flex h-10 bg-white mt-3 p-2 rounded-md hover:bg-gray-400"
      >
        <p>{name}</p>
      </div>

      {isOpen && (
        <div className="mt-2 bg-gray-100 p-2 rounded-md w-full">
          <div className="flex justify-between">
            <Link
              to="detailRoute"
              className="px-4 py-2 hover:bg-custom-teal active:bg-custom-teal"
              state={{ route }}
            >
              Route Detail
            </Link>
            <Link
              to="notification"
              className="px-4 py-2 hover:bg-custom-teal active:bg-custom-teal"
            >
              Notification
            </Link>
            <Link
              to="error"
              className="px-4 py-2 hover:bg-custom-teal active:bg-custom-teal"
            >
              Error
            </Link>
          </div>

          {/* <RouteDetail route={route} /> */}

          <Outlet />
        </div>
      )}
    </div>
  );
};

export default CardRoute;
