import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";

const RouteDetail = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return <p>No locations available.</p>;
  }

  return (
    <div className="w-full bg-white rounded-[10px]">
      <h2 className="text-lg font-semibold mb-2">Location Name</h2>
      <hr className="mb-2" />
      {locations.map((location) => (
        <div
          key={location.location_id}
          className="flex items-center w-full mb-2"
        >
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
