import React from "react";
import { Link, Outlet } from "react-router-dom";

const OverviewRoute = () => {
  return (
    <>
      <div className="flex border-b mb-4 bg-gray-100">
        <Link to="overviewRoute" className="px-4 py-2">
          OverviewRoute
        </Link>
        <Link to="listRoute" className="px-4 py-2">
          List Route
        </Link>
      </div>

      <Outlet />
    </>
  );
};

export default OverviewRoute;
