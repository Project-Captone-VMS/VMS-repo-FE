import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CardRoute from "../../../components/Route/cardRoute/CardRoute";
import Map from "../../../components/Map/map";
import Carditem from "../../../components/Route/Sub_DetailRoute/Carditem";
import DriverSuggestion from "../../../components/Route/Sub_DetailRoute/DriverSuggestion";

const DetailRoute = () => {
  const navigate = useNavigate();

  const [listRoute, setListRoute] = useState([
    {
      route_id: 1,
      license_plate: "ID ER281412",
      start_location: "A",
      end_location: "A1",
      estimated_time: "10",
      status: "Done",
      distance: "500km",
      locations: [
        { location_id: 1, locationsName: "A", status: "Done" },
        { location_id: 2, locationsName: "B", status: "Done" },
        { location_id: 3, locationsName: "C", status: "Done" },
        { location_id: 4, locationsName: "D", status: "Done" },
      ],
      notification: [
        {
          notification_id: 1,
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 2,
          content: "Lỗi hệ thống",
          title: "Lỗi",
          type: "error",
        },
      ],
      first_name: "le",
      last_name: "Lanh",
      phone_number: "0961055444",
      capacity: "20",
    },
    {
      route_id: 2,
      license_plate: "ID ER281412",
      start_location: "B",
      end_location: "B1",
      estimated_time: "7",
      status: "Done",
      distance: "400km",
      locations: [
        { location_id: 1, locationsName: "1", status: "Pending" },
        { location_id: 2, locationsName: "2", status: "Pending" },
        { location_id: 3, locationsName: "3", status: "Done" },
        { location_id: 4, locationsName: "4", status: "Done" },
      ],
      notification: [
        {
          notification_id: 1,
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 2,
          content: "Lỗi hệ thống",
          title: "Lỗi",
          type: "error",
        },
      ],
      first_name: "Kim",
      last_name: "Tuyen",
      phone_number: "0237434912",
      capacity: "10",
    },
  ]);

  const [openRoute, setOpenRoute] = useState(null);

  const handleRouteClick = (route) => {
    setOpenRoute((prevOpenRoute) => (prevOpenRoute === route ? null : route));
  };

  const getRouteStatus = (route) => {
    return route.locations.every((location) => location.status === "Done")
      ? "Done"
      : "Pending";
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col w-2/5 bg-[#0C1F1F] bg-opacity-4 p-4">
        <h2 className="text-lg font-semibold mb-4">Total Routes</h2>
        <div className="p-2 bg-white">
          <div className="space-y-2">
            <label className="block text-sm">Time</label>
            <input
              type="text"
              placeholder="day"
              className="w-full p-1 border rounded-md"
            />
            <div className="flex gap-2">
              <div>
                <label className="block text-sm mt-2">Start</label>
                <input
                  type="text"
                  placeholder="Start"
                  className="w-full p-1 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm mt-2">End</label>
                <input
                  type="text"
                  placeholder="End"
                  className="w-full p-1 border rounded-md"
                />
              </div>
            </div>
            <button className="w-full mt-4 p-2 bg-custom-teal text-white rounded-md">
              Find
            </button>
          </div>
        </div>

        <div>
          {listRoute.map((route) => (
            <CardRoute
              key={route.route_id}
              name={`${route.start_location} - ${route.end_location}`}
              route={route}
              isOpen={openRoute === route}
              onClick={() => handleRouteClick(route)}
            />
          ))}
        </div>
      </div>

      <div className="w-3/5 text-white">
        <Map />
        {openRoute && (
          <div className="flex gap-2">
            <Carditem
              name={`${openRoute.start_location} - ${openRoute.end_location}`}
              total_hour={openRoute.estimated_time}
              distance={openRoute.distance}
              status={getRouteStatus(openRoute)}
            />
            <DriverSuggestion
              license_plate={openRoute.license_plate}
              first_name={openRoute.first_name}
              last_name={openRoute.last_name}
              phone_number={openRoute.phone_number}
              capacity={openRoute.capacity}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailRoute;
