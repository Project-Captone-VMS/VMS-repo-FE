import React, { useState, useEffect } from "react";
import { getInterConnections, getWayPoint } from "../../services/apiRequest";
import axios from "axios";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "../ui/timeline";

const apiKey = "YjV4ToT_bdS4WUgLrz6UZ6tRgbWLhmmB11uDjWasARo";

const ListItems = ({
  routeId,
  totalTime,
  totalDistance,
  start,
  end,
  licensePlate,
  status,
  fullname,
}) => {
  const [timeByInterconnection, setTimeByInterconnection] = useState({});
  const [interconnect, setInterconnect] = useState([]);
  const [wayPoints, setWaypoints] = useState([]);
  const [error, setError] = useState("");

  const convertGeocode = async (lat, lng) => {
    try {
      const response = await axios.get(
        "https://revgeocode.search.hereapi.com/v1/revgeocode",
        {
          params: {
            at: `${lat},${lng}`,
            lang: "en-US",
            apiKey: apiKey,
          },
        },
      );

      if (response.data && response.data.items.length > 0) {
        const addr = response.data.items[0].address;

        return {
          street: addr.street || "",
          houseNumber: addr.houseNumber || "",
          district: addr.district || "",
          city: addr.city || "",
          state: addr.state || "",
          country: addr.countryName || "",
          postalCode: addr.postalCode || "",
          label: response.data.items[0].title || "",
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };

  const handleChange = (e, interconnectionId) => {
    const { name, value } = e.target;

    setTimeByInterconnection((prevTime) => {
      const updatedTime = {
        ...(prevTime[interconnectionId] || { hours: 0, minutes: 0 }),
        [name]: value,
      };
      return {
        ...prevTime,
        [interconnectionId]: { ...updatedTime },
      };
    });
  };

  function convertM(distance) {
    return `${(distance / 1000).toFixed(1)} km`;
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `About ${hours}h ${minutes}m`;
  }

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await getInterConnections(id);
        setInterconnect(response);

        const res = await getWayPoint(routeId);
        if (res && Array.isArray(res) && res.length > 0) {
          const validWaypoints = res.filter(
            (waypoint) => !isNaN(waypoint.lat) && !isNaN(waypoint.lng),
          );

          const waypointAddresses = await Promise.all(
            validWaypoints.map(async (waypoint) => {
              const { lat, lng } = waypoint;
              const address = await convertGeocode(lat, lng);
              return { ...waypoint, address };
            }),
          );
          console.log(waypointAddresses);
          setWaypoints(waypointAddresses);
          setError("");
        } else {
          setError("No waypoints found for the given ID.");
          setWaypoints([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(routeId);
  }, [routeId]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="cursor-pointer rounded-lg border-2 bg-white px-2 no-underline hover:border-blue-400 hover:bg-slate-100"
      >
        <AccordionTrigger className="no-underline">
          <div className="flex w-full flex-col">
            <p className="mb-2 rounded-lg border bg-white text-black">
              {fullname}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-start text-[0.8vw]">Start: {start}</p>
                <p className="text-start text-[0.8vw]">End: {end}</p>
              </div>
              <p
                className={`text-[0.8vw] font-extrabold text-white ${status === true ? "rounded-full border-2 border-green-700 bg-green-500" : "rounded-full border-2 border-yellow-700 bg-yellow-500"} p-2`}
              >
                {status === true ? "Complete" : "No Complete"}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-start text-[0.8vw] text-gray-500">
                <p>Distance: {convertM(totalDistance)}</p>
                <p>Time: {formatTime(totalTime)}</p>
                <p>License Plate: {licensePlate}</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Timeline>
            {wayPoints.slice(0, wayPoints.length - 1).map((wayPoint, index) => (
              <TimelineItem key={wayPoint.waypointId} className="text-start">
                <TimelineHeader>
                  <TimelineTitle>
                    {wayPoint.address?.label} -{" "}
                    {wayPoints[index + 1]?.address?.label}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineDescription>
                  Distance:{" "}
                  {interconnect[index]
                    ? convertM(interconnect[index].distance)
                    : ""}
                </TimelineDescription>
                <TimelineDescription>
                  Time Waypoint:{" "}
                  {interconnect[index]
                    ? formatTime(interconnect[index].timeWaypoint)
                    : ""}
                </TimelineDescription>
                <TimelineDescription>
                  Time Estimate:{" "}
                  {interconnect[index]
                    ? formatTime(interconnect[index].timeEstimate)
                    : ""}
                </TimelineDescription>
                <TimelineDescription>
                  Time Actual:{" "}
                  {interconnect[index]
                    ? formatTime(interconnect[index].timeActual)
                    : ""}
                </TimelineDescription>
              </TimelineItem>
            ))}
          </Timeline>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ListItems;
