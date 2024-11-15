import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

const RouteDetail = () => {
  // const RouteDetail = ({ route }) => {
  // if (!route) {
  //   return <p></p>;
  // }

  const location = useLocation();
  const { route } = location.state || {};

  if (!route) {
    return <p>No route selected.</p>;
  }
  return (
    <div className="w-full bg-white p-2 rounded-[10px] mt-4">
      <h2 className="text-lg font-semibold mb-4">{route.name}</h2>
      {route.locations.map((location) => (
        <div key={location.id} className="flex items-center w-full mb-2">
          <div className="flex items-center w-full">
            <MapPin className="mr-2 text-[#139C9C]" />
            <span className="mr-2">{location.locationsName}</span>
            <div className="ml-auto p-2 bg-[#6EE6BA] text-xs rounded-2xl">
              {location.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteDetail;
