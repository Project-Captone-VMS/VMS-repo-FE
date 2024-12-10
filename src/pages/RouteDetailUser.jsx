import React from "react";
import CardRouteUser from "../components/RouteDetail/CardRouteUser";

const RouteDetailUser = () => {
  return (
    <div className="w-1/2">
      <div className="text-xl font-bold">List Route User</div>

      <div className="flex flex-col gap-2">
        <CardRouteUser />
        <CardRouteUser />
      </div>
    </div>
  );
};

export default RouteDetailUser;
