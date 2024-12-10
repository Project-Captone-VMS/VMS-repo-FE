import React from "react";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DriveItem = () => {
  return (
    <div className="w-1/2">
      {" "}
      <div>
        <p>Truck</p>
        <div>
          <div className="flex gap-2 px-4 py-2 border rounded-md">
            <div class="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-lg shadow-inner lg:h-12 lg:w-12">
              <svg
                className="w-6 h-6 text-blue-500 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <FontAwesomeIcon
                  icon={faTruck}
                  className="w-6 h-6 text-blue-500 "
                ></FontAwesomeIcon>
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold">Volvo FMX 460</p>
              <p className="text-sm text-gray-400">truck</p>
            </div>
          </div>
        </div>
      </div>{" "}
    </div>
  );
};

export default DriveItem;
