import React, { useState, useEffect, useRef } from "react";
import {
  getInterConnections,
  updateEstimateTime,
} from "../../services/apiRequest";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Swal from "sweetalert2";
import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTitle,
} from "../../components/ui/timeline";

const RouteItem = ({
  routeId,
  loading,
  totalTime,
  totalDistance,
  startLng,
  startLat,
  licensePlate,
  status,
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

  const handleUpdate = async (id) => {
    try {
      const time = timeByInterconnection[id] || {
        hours: 0,
        minutes: 0,
      };

      const payload = {
        routeId: id,
        hours: time.hours || 0,
        minutes: time.minutes || 0,
      };

      const timeE = payload.hours * 3600 + payload.minutes * 60;
      const formData = {
        timeEstimate: timeE,
      };

      const res = await updateEstimateTime(payload.routeId, formData);
      setInterconnect((prev) =>
        prev.map((item) =>
          item.interconnectionId === id
            ? { ...item, timeEstimate: timeE }
            : item,
        ),
      );

      if (res != null) {
        Swal.fire("Success!", "Time updated successfully.", "success");
      }

      setTimeByInterconnection((prevTime) => {
        return {
          ...prevTime,
          [id]: { hours: 0, minutes: 0 },
        };
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật thời gian:", error);
    }
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

  console.log("interconnect", interconnect);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="cursor-pointer rounded-lg border-2 bg-white px-2 no-underline hover:border-blue-400 hover:bg-slate-100"
      >
        <AccordionTrigger className="no-underline">
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-[0.8vw]">
                  Start :{startLat}, {startLng}
                </p>
                <p className="text-[0.8vw]">
                  End :{startLat}, {startLng}
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
                <TimelineDescription>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {" "}
                      <input
                        type="number"
                        name="hours"
                        value={
                          timeByInterconnection[route.interconnectionId]
                            ?.hours || ""
                        }
                        onChange={(e) =>
                          handleChange(e, route.interconnectionId)
                        }
                        placeholder="HH"
                        className="w-14 rounded border border-gray-300 px-2 py-2 text-center"
                        min="0"
                        max="23"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        name="minutes"
                        value={
                          timeByInterconnection[route.interconnectionId]
                            ?.minutes || ""
                        }
                        onChange={(e) =>
                          handleChange(e, route.interconnectionId)
                        }
                        placeholder="MM"
                        className="w-14 rounded border border-gray-300 px-2 py-2 text-center"
                        min="0"
                        max="59"
                      />
                    </div>
                    <button
                      onClick={() => handleUpdate(route.interconnectionId)}
                      className={`rounded px-2 py-2 text-white ${
                        loading
                          ? "cursor-not-allowed bg-gray-500"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                      disabled={loading}
                    >
                      {"Update"}
                    </button>
                  </div>
                </TimelineDescription>
              </TimelineItem>
            ))}
          </Timeline>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RouteItem;
