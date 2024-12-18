import React, { useEffect, useRef, useState } from "react";
import { Button, Input, Modal } from "antd";
import { over } from "stompjs";
import {
  getInterConnections,
  getDriverNoActive,
  getVehicleNoActive,
  findSequence,
  listRouteNoActive,
  getUsernameByDriverId,
  getWayPoint,
} from "../../../services/apiRequest";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import SockJS from "sockjs-client";

const Route = () => {
  const [routes, setRoutes] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);
  const [interconnect, setInterconnect] = useState([]);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState(null);

  const [editData, setEditData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formDriver, setFormDriver] = useState([]);
  const [formVehicle, setFormVehicle] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const [formDataSendNotification, setFormDataSendNotification] = useState({
    title: "You have a new route",
    content: "Please check your route and estimate the time",
    type: "SYSTEM",
  });

  let socket = null;
  let stompClient = null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverResult = await getDriverNoActive();
        setFormDriver(driverResult);

        const vehicleResult = await getVehicleNoActive();
        setFormVehicle(vehicleResult);

        const listRoute = await listRouteNoActive();

        setRoutes(listRoute);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getDriverNoActive, getVehicleNoActive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleViewDetails = async (id) => {
    const res = await getWayPoint(id);
    setWayPoints(res);

    const response = await getInterConnections(id);
    setInterconnect(response);

    setIsDetailModalVisible(true);
  };

  const handleEdit = (route) => {
    setEditData(route);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === editData.id ? { ...editData } : route,
      ),
    );
    setIsModalVisible(false);
  };

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `About ${hours}h ${minutes}m`;
  }

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });
  const [suggestions, setSuggestions] = useState([]);
  const routePolylines = useRef([]);
  const markers = useRef([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [selectedCoordinates, setSelectedCoordinates] = useState([]);
  const token = localStorage.getItem("jwtToken");
  const apiKey = "jlBGGMAGg54YwZpieijupQwJpNMeGd9uwXDfRbjf-ag";

  useEffect(() => {
    const platformInstance = new H.service.Platform({ apikey: apiKey });
    const defaultLayers = platformInstance.createDefaultLayers();
    const mapInstance = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat: 52.5308, lng: 13.3847 },
        zoom: 14,
        pixelRatio: window.devicePixelRatio || 1,
      },
    );

    const behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(mapInstance),
    );
    H.ui.UI.createDefault(mapInstance, defaultLayers);
    setMap(mapInstance);

    const setUpClickListener = (map) => {
      map.addEventListener("tap", function (evt) {
        const coord = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY,
        );
        const clickedMarker = new H.map.Marker({
          lat: coord.lat,
          lng: coord.lng,
        });
        map.addObject(clickedMarker);
        markers.current.push(clickedMarker);

        const coordinatesText = `${coord.lat.toFixed(4)}, ${coord.lng.toFixed(
          4,
        )}`;
        setTextareaValue((prev) => prev + coordinatesText + "\n");
        setSelectedCoordinates((prev) => [
          ...prev,
          { lat: coord.lat, lng: coord.lng },
        ]);
      });
    };

    setUpClickListener(mapInstance);

    return () => {
      mapInstance.dispose();
    };
  }, [apiKey]);

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setTextareaValue(value);

    markers.current.forEach((marker) => {
      map.removeObject(marker);
    });
    markers.current = [];

    const lines = value.split("\n").filter((line) => line.trim() !== "");
    const newCoordinates = [];
    lines.forEach((line) => {
      const matches = line.match(
        /([-+]?[0-9]*\.?[0-9]+),\s*([-+]?[0-9]*\.?[0-9]+)/,
      );
      if (matches) {
        const lat = parseFloat(matches[1]);
        const lng = parseFloat(matches[2]);
        const newMarker = new H.map.Marker({ lat, lng });
        map.addObject(newMarker);
        markers.current.push(newMarker);
        newCoordinates.push({ lat, lng });
      }
    });
    setSelectedCoordinates(newCoordinates);
  };

  const geocode = async (address) => {
    try {
      const response = await axios.get(
        "https://geocode.search.hereapi.com/v1/geocode",
        {
          params: {
            q: address,
            apikey: apiKey,
          },
        },
      );
      if (response.data.items.length > 0) {
        return response.data.items[0].position;
      } else {
        throw new Error("No location found");
      }
    } catch (error) {
      console.error("Geocode error:", error.message);
      throw error;
    }
  };

  const fetchRoute = async (originCoords, destinationCoords) => {
    setLoading(true);
    try {
      routePolylines.current.forEach((polyline) => {
        map.removeObject(polyline);
      });
      routePolylines.current = [];
      markers.current.forEach((marker) => {
        map.removeObject(marker);
      });
      markers.current = [];
      const response = await axios.get(
        "http://localhost:8080/api/route/findRoute",
        {
          params: {
            originLat: originCoords.lat,
            originLng: originCoords.lng,
            destinationLat: destinationCoords.lat,
            destinationLng: destinationCoords.lng,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.routes && response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const section = route.sections[0];
        const polylineData = section.polyline;
        const routeLine = H.geo.LineString.fromFlexiblePolyline(polylineData);
        const outlinePolyline = new H.map.Polyline(routeLine, {
          style: { strokeColor: "gray", lineWidth: 8 },
        });
        const routePolyline = new H.map.Polyline(routeLine, {
          style: { strokeColor: "rgba(173, 216, 230, 0.8)", lineWidth: 5 },
        });

        map.addObject(outlinePolyline);
        map.addObject(routePolyline);
        routePolylines.current.push(outlinePolyline, routePolyline);

        if (map) {
          map
            .getViewModel()
            .setLookAtData({ bounds: routePolyline.getBoundingBox() });
        }

        const distance = section.summary.length;
        const duration = section.summary.duration;

        setRouteInfo({ distance, duration });

        const originMarker = new H.map.Marker({
          lat: originCoords.lat,
          lng: originCoords.lng,
        });
        map.addObject(originMarker);
        markers.current.push(originMarker);

        const destinationMarker = new H.map.Marker({
          lat: destinationCoords.lat,
          lng: destinationCoords.lng,
        });
        map.addObject(destinationMarker);
        markers.current.push(destinationMarker);
      } else {
        setError("No routes found.");
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setError("Failed to fetch route. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        "http://localhost:8080/api/route/search-suggestions",
        {
          params: {
            query,
            lat: 52.5308,
            lng: 13.3847,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuggestions(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleFindSequence = async () => {
    if (selectedCoordinates.length < 2) {
      setError("Please select at least two points.");
      return;
    }

    try {
      const originCoords = await geocode(origin);
      const destinationCoords = await geocode(destination);
      const intermediatePoints = selectedCoordinates;

      const destinations = intermediatePoints
        .map((coord) => `${coord.lat},${coord.lng}`)
        .join(",");

      const formData = {
        startLat: originCoords.lat,
        startLng: originCoords.lng,
        destinations: destinations,
        endLat: destinationCoords.lat,
        endLng: destinationCoords.lng,
        driverId: selectedDriver,
        vehicleId: selectedVehicle,
      };

      const headers = {
        Authorization: `Bearer eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJZcDgxNk96UkI4M1BWTHM5UzZYZiIsImlhdCI6MTczMzI0MjA0MSwiZXhwIjoxNzMzMzI4NDQxLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLnQ1MjRxRk1CNERiVTY3c21FRVYzYUEuaWMwQWlmcUtIUHQ0WFZucS05X1JvYWkzU0ozTWxDbHBNYWtOZXJvdHRzU3VxQk9xRWRFYTh5aWZVMEpoYzBWcVdOa2VSUXAwZzhjVkxUSzVwemRVWkFvaEdyWFFkd2NNcGVqNVdubGd5U0h6YmtmQzlicEVnOWM1TWdsSEg4TjJrQVUzTjRPLTJQOFpUVjAwMkdVMGI4MndlTld5Zk9LeTlDb2l4QVJFdXlRLmJHX2F5Nk5MWFZidGs0UVdfRE1RRC1tNllDSE1yekVxU2dfVG1mM051c0k.AR1Lb6fw2fvHSONXgsHAbo_SIZ5OsXv4rrpNq98okB30JH_tG9oDasU5vLXOz1fjJDA4tuUCGUupTODkOU_pbg9TndIqgILOQARIkHibp8vtyubSjZUoiEWPFhQmRUMepuoU_m11OxUTavcet4EBynYaAU8o2_SpA8oSDBVUg6szJMfeQq6FSFKax4YQ-IEQaS9FakhfgPtRhqMFYjv66gwIB767o17s_Z2rkhI-D7qvpOi9m3NojlRO4X4wF_u7gLvTaBLlInG-6oKi3IneFdCf_vmeZSnVBo0nVKgGV67oLA7Wk880SwXblLViYhRjLI8yCnLLiIMcqEpRaIl_rQ`,
      };

      const results = await findSequence({
        ...formData,
        headers,
      });
      console.log("results", results);

      const findUserNameByDriverId = await getUsernameByDriverId(
        formData.driverId,
      );

      if (stompClient !== null && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("Đã ngắt kết nối socket cũ!");
        });
      } else {
        socket = new SockJS("http://localhost:8080/ws");
        stompClient = over(socket);

        stompClient.connect({}, () => {
          stompClient.send(
            `/app/chat/${findUserNameByDriverId}`,
            {},
            JSON.stringify(formDataSendNotification),
            toast.success("Successfully created!"),
          );
          console.log("Notification Sent:", formDataSendNotification);
        });
      }

      console.log("Result:", results);
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        setError(`Error: ${error.response.data.message}`);
      } else {
        setError("Failed to fetch sequence. Please try again later.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const originCoords = await geocode(origin);
      const destinationCoords = await geocode(destination);
      await fetchRoute(originCoords, destinationCoords);
    } catch (error) {
      setError("Failed to geocode location. Please check the addresses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <Toaster />
        <div
          className="map-container rounded-lg border bg-white p-3"
          style={{ width: "71%", height: "700px" }}
          ref={mapRef}
        ></div>
        <div
          className="gap-3 rounded-lg border bg-white px-3 py-2"
          style={{ width: "28%" }}
        >
          <div className="form-container">
            <h2 className="mb-4 text-2xl font-bold">Route on HERE Map</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-4 px-1">
                <label className="block text-sm font-medium text-gray-700">
                  Start:
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                  />
                </label>
              </div>
              <div className="mb-4 px-1">
                <label className="block text-sm font-medium text-gray-700">
                  End:
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                  />
                </label>
              </div>

              <div className="mb-4 px-1">
                <label className="block text-sm font-medium text-gray-700">
                  Driver:
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Select a driver
                    </option>
                    {formDriver && formDriver.length > 0 ? (
                      formDriver.map((driver) => (
                        <option key={driver.id} value={driver.driverId}>
                          {driver.lastName} {driver.firstName}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading drivers...</option>
                    )}
                  </select>
                </label>
              </div>

              <div className="mb-4 px-1">
                <label className="block text-sm font-medium text-gray-700">
                  Select Vehicle:
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                  >
                    <option value="" disabled>
                      Select a vehicle
                    </option>
                    {formVehicle && formVehicle.length > 0 ? (
                      formVehicle.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.vehicleId}>
                          {vehicle.licensePlate}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading drivers...</option>
                    )}
                  </select>
                </label>
              </div>

              <div
                className="w-full"
                style={{ width: "100%", padding: "10px" }}
              >
                <h3 className="text-lg font-semibold">
                  Coordinate Information
                </h3>
                <textarea
                  value={textareaValue}
                  onChange={handleTextareaChange}
                  rows={4}
                  className="mt-4 w-full rounded-md border border-gray-300"
                />
              </div>
              <div className="flex w-full items-center justify-between gap-5 px-3 font-semibold text-10">
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700"
                >
                  Get Route
                </button>
                <button
                  type="button"
                  onClick={handleFindSequence}
                  className="w-full rounded-md bg-green-600 p-3 text-white hover:bg-green-700"
                >
                  Find Sequence
                </button>
              </div>
            </form>

            {loading && <p>Loading route...</p>}
            {error && <p className="text-red-600">{error}</p>}
          </div>
        </div>
      </div>

      <div className="relative mt-2 overflow-x-auto bg-white p-4 shadow-md sm:rounded-lg">
        <h2 className="mb-4 text-lg font-bold text-slate-950">
          Information List Route
        </h2>
        <table className="w-full rounded-lg text-left text-sm font-normal text-black dark:text-black rtl:text-right">
          <thead className="bg-gray-50 text-xs uppercase text-black dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Start
              </th>
              <th scope="col" className="px-6 py-3">
                End
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>{" "}
              <th scope="col" className="px-6 py-3">
                Distance
              </th>
              <th scope="col" className="px-6 py-3">
                Fullname Driver
              </th>
              <th scope="col" className="px-6 py-3">
                License Plate
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr
                key={route.routeId}
                className="border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-white dark:hover:bg-gray-200"
              >
                <td className="px-6 py-4">
                  {route.startLat},{route.startLng}
                </td>
                <td className="px-6 py-4">
                  {route.endLat},{route.endLng}
                </td>
                <td className="px-6 py-4">{route.totalTime} s</td>
                <td className="px-6 py-4">{route.totalDistance} m</td>
                <td className="px-6 py-4">
                  {route.driverId} {route.driver.firstName}{" "}
                  {route.driver.lastName}{" "}
                </td>
                <td className="px-6 py-4">{route.vehicle.licensePlate}</td>
                <td className="px-2 py-4">
                  <Button type="link" onClick={() => handleEdit(route)}>
                    Edit
                  </Button>
                  <Button
                    type="link"
                    onClick={() => handleViewDetails(route.routeId)}
                  >
                    Detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title="Edit Route"
        visible={isModalVisible}
        onOk={handleSave}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="mb-4 flex flex-col">
          <label htmlFor="editRoute" className="text-sm font-medium">
            Route
          </label>
          <Input
            id="editRoute"
            name="route"
            value={editData?.route || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="editStart" className="text-sm font-medium">
            Start
          </label>
          <Input
            id="editStart"
            name="start"
            value={editData?.start || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="editEnd" className="text-sm font-medium">
            End
          </label>
          <Input
            id="editEnd"
            name="end"
            value={editData?.end || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="mb-4 flex flex-col">
          <label htmlFor="editEstimateTime" className="text-sm font-medium">
            End
          </label>
          <Input
            id="editEstimateTime"
            name="estimateTime"
            value={editData?.estimateTime || ""}
            onChange={handleEditChange}
          />
        </div>
      </Modal>

      <Modal
        title="Route Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={700}
      >
        <div className="space-y-6">
          {selectedRouteDetails && (
            <div>
              <div className="rounded-lg bg-gray-200 p-4">
                <h3 className="mb-4 text-lg font-semibold">Route Overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Distance
                    </h4>
                    <p className="text-lg text-black">
                      {selectedRouteDetails.route?.routeId} meters
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Total Time
                    </h4>
                    <p className="text-lg">
                      {/* {selectedRouteDetails.totalTime.toLocaleString()} seconds */}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-gray-200 p-4">
                <h3 className="mb-4 text-lg font-semibold">
                  Assignment Details
                </h3>
                {/* <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">
                      Driver
                    </h4>
                    <p className="text-lg">
                      {selectedRouteDetails.driver?.firstName}{" "}
                      {selectedRouteDetails.driver?.lastName}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">
                      Vehicle
                    </h4>
                    <p className="text-lg">
                      {selectedRouteDetails.vehicle?.licensePlate}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-gray-200 p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">
                      From
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">
                      To
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">
                      Distance (m)
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">
                      Time Waypoint (s)
                    </th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500">
                      Coordinates
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {wayPoints.map(
                    (wayPoint, index) =>
                      index < wayPoints.length - 1 && (
                        <tr
                          key={wayPoint.waypointId}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {interconnect[index]
                              ? interconnect[index].fromWaypoint
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {interconnect[index]
                              ? interconnect[index].toWaypoint
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {interconnect[index]
                              ? interconnect[index].distance
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {interconnect[index]
                              ? formatTime(interconnect[index].timeWaypoint)
                              : ""}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            From {wayPoint.lat.toFixed(4)},{" "}
                            {wayPoint.lng.toFixed(4)}
                            <>
                              {" "}
                              To {wayPoints[index + 1].lat.toFixed(4)},{" "}
                              {wayPoints[index + 1].lng.toFixed(4)}
                            </>
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Route;
