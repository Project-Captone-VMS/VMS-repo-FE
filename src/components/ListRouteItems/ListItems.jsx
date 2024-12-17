import React, { useState, useEffect } from "react";
import { getInterConnections } from "../../services/apiRequest";
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

const ListItems = ({
  routeId,
  totalTime,
  totalDistance,
  startLng,
  startLat,
  licensePlate,
  status,
  endLat,
  endLng,
  first_name,
}) => {
  const [timeByInterconnection, setTimeByInterconnection] = useState({});
  const [interconnect, setInterconnect] = useState([]);

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

  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await getInterConnections(id);
        setInterconnect(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(routeId);
  }, [getInterConnections]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="cursor-pointer rounded-lg border-2 bg-white px-2 no-underline hover:border-blue-400 hover:bg-slate-100"
      >
        <AccordionTrigger className="no-underline">
          <div className="flex w-full flex-col">
            <p className="mb-2 rounded-lg border bg-white text-black">
              {first_name}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-[0.8vw]">
                  Start :{startLat}, {startLng}
                </p>
                <p className="text-[0.8vw]">
                  End :{endLat}, {endLng}
                </p>
              </div>
              <p className="text-[0.8vw] font-extrabold text-blue-600">
                {status === "false" ? "INACTIVE" : "ACTIVE"}
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-start text-[0.8vw] text-gray-500">
                <p className=" "> Distance : {totalDistance} (m)</p>
                <p className=""> Time : {totalTime} (s)</p>
                <p className=""> License Plate : {licensePlate}</p>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <Timeline>
            {interconnect.map((route) => (
              <TimelineItem
                key={route.interconnectionId}
                className="text-start"
              >
                <TimelineHeader>
                  <TimelineTitle>
                    {route.fromWaypoint} - {route.toWaypoint}
                  </TimelineTitle>
                </TimelineHeader>
                <TimelineDescription>
                  distance : {route.distance}
                </TimelineDescription>
                <TimelineDescription>
                  timeWaypoint: {route.timeWaypoint}
                </TimelineDescription>
                <TimelineDescription>
                  timeEstimate: {route.timeEstimate}
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
