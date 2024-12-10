import React from "react";
import CardUser from "../components/RouteDetail/CardUser";
import { X } from "lucide-react";
import RouteItem from "@/components/RouteDetail/RouteItem";
import TruckItem from "@/components/RouteDetail/TruckItem";
import DriveItem from "@/components/RouteDetail/DriveItem";

const RouteDetailUser = () => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-2 w-1/3 border-2 rounded-lg bg-white ">
          <div className="flex justify-between py-2 px-4 border-b-2 bg-gray-100 rounded-t-lg">
            <p>List Route </p>
          </div>

          <div className="flex flex-col px-2 gap-1 ">
            <RouteItem />
          </div>
        </div>

        <div className="bg-white rounded-lg border-2 w-2/3">
          <div className="flex justify-between py-2 px-4 border-b-2 bg-gray-100 rounded-t-lg">
            <p>Detail Route</p>
          </div>
          <p className=" px-4 text-xl py-2 font-medium">Route Đà Nẵng - Huê</p>
          <div className=" flex gap-2 px-4 text-sm font-bold">
            <div className="flex flex-col gap-1 w-2/3 ">
              <p className="">MAP OVERVIEW</p>
              <img
                className="w-full rounded-lg "
                src="https://i.pinimg.com/236x/5b/6b/bf/5b6bbf21c1f8b8c9fb4aa260273f5f16.jpg"
                alt=""
              />
            </div>

            <div className="flex flex-col gap-1 w-1/3 ">
              <p className="">SUMARY</p>
              <div className="flex  flex-col gap-4 mb-2 justify-between border-2 border-gray-400 rounded-lg px-4 py-4">
                <CardUser />
                <CardUser />
                <CardUser />
              </div>
            </div>
          </div>
          <div className="flex px-4 py-4 gap-4">
            <TruckItem />
            <DriveItem />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteDetailUser;
