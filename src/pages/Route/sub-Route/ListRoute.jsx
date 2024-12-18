import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Map from "../../../components/Map/map";
import CardItem from "../../../components/Route/Sub_DetailRoute/CardItem";
import DriverSuggestion from "../../../components/Route/Sub_DetailRoute/DriverSuggestion";
import {
  listRouteNoActive,
  getWayPoint,
  getInterConnections,
} from "../../../services/apiRequest";
import ListItems from "@/components/ListRouteItems/ListItems";
import { Search, ChevronDown, Edit, Trash2, Filter } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import Swal from "sweetalert2";
import axios from "axios";
const token = localStorage.getItem("jwtToken");

const DetailRoute = () => {
  const navigate = useNavigate();

  //Thêm
  const [position, setPosition] = useState({ lat: 10.8231, lng: 106.6297 });
  const [routes, setRoutes] = useState([]);
  const usernameLocal = localStorage.getItem("username");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [mapWayPoints, setMapWayPoints] = useState([]);
  const [mapInter, setMapInters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredRoutes, setFilteredRoutes] = useState([]); // Added state for filtered routes
  const markers = useRef([]);
  const mapRef = useRef(null);
  const routePolylines = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listRoute = await listRouteNoActive();
        setRoutes(listRoute);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Add this new useEffect hook for filtering routes
  useEffect(() => {
    const filteredRoutes = routes.filter(
      (route) =>
        route.driver?.firstName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        route.driver?.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredRoutes(filteredRoutes);
  }, [routes, searchTerm]);

  useEffect(() => {
    if (window.H && !mapRef.current) {
      const platform = new window.H.service.Platform({
        apikey: "z4fTmSQepmcgYJASTEaHBjS9zsw4TccWd2oKbT5ubcQ",
      });
      const defaultLayers = platform.createDefaultLayers();
      const mapInstance = new window.H.Map(
        document.getElementById("mapContainer"),
        defaultLayers.vector.normal.map,
        {
          center: position,
          zoom: 13,
        },
      );

      new window.H.mapevents.Behavior(
        new window.H.mapevents.MapEvents(mapInstance),
      );
      window.H.ui.UI.createDefault(mapInstance, defaultLayers);
      mapRef.current = mapInstance;

      mapInstance.addEventListener("resize", () =>
        mapInstance.getViewPort().resize(),
      );
    }
  }, []);

  const handleViewDetailsInMap = async (id) => {
    try {
      const res = await getWayPoint(id);
      setMapWayPoints(res);

      const resInter = await getInterConnections(id);
      setMapInters(resInter);
      setLoading(true);
      clearMap();

      res.forEach((wayPoint, index) => {
        const marker = new window.H.map.Marker({
          lat: wayPoint.lat,
          lng: wayPoint.lng,
        });

        let label = `Waypoint ${index}: (${wayPoint.lat.toFixed(
          4,
        )}, ${wayPoint.lng.toFixed(4)})`;
        if (index === 0) {
          label = `Start: (${wayPoint.lat.toFixed(4)}, ${wayPoint.lng.toFixed(
            4,
          )})`;
        } else if (index === res.length - 1) {
          label = `End: (${wayPoint.lat.toFixed(4)}, ${wayPoint.lng.toFixed(
            4,
          )})`;
        }

        marker.setData(label);
        mapRef.current.addObject(marker);
        markers.current.push(marker);

        marker.addEventListener("tap", function (e) {
          const content = marker.getData();
          Swal.fire({
            title: content,
            timer: 5000,
            showConfirmButton: false,
            showCloseButton: true,
            timerProgressBar: true,
          });
        });
      });

      const response = await axios.get(
        "http://localhost:8080/api/route/findRoute",
        {
          params: {
            originLat: res[0].lat,
            originLng: res[0].lng,
            destinationLat: res[res.length - 1].lat,
            destinationLng: res[res.length - 1].lng,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.routes?.length > 0) {
        const route = response.data.routes[0];
        renderRoute(route);
      } else {
        setError("No routes found.");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearMap = () => {
    routePolylines.current.forEach((polyline) => {
      mapRef.current.removeObject(polyline);
    });
    routePolylines.current = [];
    markers.current.forEach((marker) => {
      mapRef.current.removeObject(marker);
    });
    markers.current = [];
  };

  const renderRoute = (route) => {
    const section = route.sections[0];
    const polylineData = section.polyline;
    const routeLine =
      window.H.geo.LineString.fromFlexiblePolyline(polylineData);

    const outlinePolyline = new window.H.map.Polyline(routeLine, {
      style: { strokeColor: "gray", lineWidth: 8 },
    });
    const routePolyline = new window.H.map.Polyline(routeLine, {
      style: { strokeColor: "rgba(173, 216, 230, 0.8)", lineWidth: 5 },
    });

    mapRef.current.addObject(outlinePolyline);
    mapRef.current.addObject(routePolyline);
    routePolylines.current.push(outlinePolyline, routePolyline);

    mapRef.current
      .getViewModel()
      .setLookAtData({ bounds: routePolyline.getBoundingBox() });

    const originMarker = new window.H.map.Marker({
      lat: routeWayPoints[0].lat,
      lng: routeWayPoints[0].lng,
    });
    const destinationMarker = new window.H.map.Marker({
      lat: routeWayPoints[routeWayPoints.length - 1].lat,
      lng: routeWayPoints[routeWayPoints.length - 1].lng,
    });

    mapRef.current.addObject(originMarker);
    mapRef.current.addObject(destinationMarker);
    markers.current.push(originMarker, destinationMarker);
  };

  const fetchRoute = async (start, end) => {
    setLoading(true);
    try {
      routePolylines.current.forEach((polyline) => {
        mapRef.current.removeObject(polyline);
      });
      routePolylines.current = [];
      markers.current.forEach((marker) => {
        mapRef.current.removeObject(marker);
      });
      markers.current = [];

      const response = await axios.get(
        "http://localhost:8080/api/route/findRoute",
        {
          params: {
            originLat: start.lat,
            originLng: start.lng,
            destinationLat: end.lat,
            destinationLng: end.lng,
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
        const routeLine =
          window.H.geo.LineString.fromFlexiblePolyline(polylineData);

        const outlinePolyline = new window.H.map.Polyline(routeLine, {
          style: {
            strokeColor: "gray",
            lineWidth: 8,
          },
        });

        const routePolyline = new window.H.map.Polyline(routeLine, {
          style: {
            strokeColor: "rgba(173, 216, 230, 0.8)",
            lineWidth: 5,
          },
        });

        mapRef.current.addObject(outlinePolyline);
        mapRef.current.addObject(routePolyline);
        routePolylines.current.push(outlinePolyline, routePolyline);

        if (mapRef.current) {
          mapRef.current
            .getViewModel()
            .setLookAtData({ bounds: routePolyline.getBoundingBox() });
        }

        // console.log(`${(distance / 1000).toFixed(2)} km`)

        const originMarker = new window.H.map.Marker({
          lat: start.lat,
          lng: start.lng,
        });
        mapRef.current.addObject(originMarker);
        markers.current.push(originMarker);

        const destinationMarker = new window.H.map.Marker({
          lat: end.lat,
          lng: end.lng,
        });
        mapRef.current.addObject(destinationMarker);
        markers.current.push(destinationMarker);

        setPath(routeLine.getLatLngAltArray());
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

  //thêm

  // mock api
  const [listRoute, setListRoute] = useState([
    {
      route_id: 1,
      license_plate: "ID ER281412",
      start_location: "DaNang",
      end_location: "Hue",
      estimated_time: "10",
      status: "Done",
      distance: "500km",
      locations: [
        { location_id: 1, locationsName: "A", status: "Done" },
        { location_id: 2, locationsName: "B", status: "Done" },
        { location_id: 3, locationsName: "C", status: "Done" },
        { location_id: 4, locationsName: "D", status: "Done" },
      ],
      notifications: [
        {
          notification_id: 1,
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 2,
          content: "Lorem Ipsum is simply dummy text of the printing.",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 3,
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
      notifications: [
        {
          notification_id: 1,
          content:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 2,
          content: "lanh",
          title: "alo",
          type: "notification",
        },
        {
          notification_id: 3,
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

  console.log("routes", routes);
  return (
    <div>
      {/* <div className="space-y-2">
        <label className="block text-sm">Route</label>
        <input
          type="text"
          placeholder="Route"
          className="w-full rounded-md border p-1"
        />
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <label className="mt-2 block text-sm">Start</label>
            <input
              type="text"
              placeholder="Start"
              className="w-full rounded-md border p-1"
            />
          </div>
          <div className="w-full">
            <label className="mt-2 block text-sm">End</label>
            <input
              type="text"
              placeholder="End"
              className="w-full rounded-md border p-1"
            />
          </div>
        </div>
        <button className="bg-custom-teal w-full rounded-md bg-black p-2 text-white">
          Find
        </button>
      </div> */}

      <div className="mb-3 flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search by driver name..." // Updated placeholder text
            className="border-0 bg-white pl-10 ring-1 ring-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          className="flex h-10 items-center gap-2 border-0 bg-white px-4 ring-1 ring-gray-200"
          onClick={() =>
            setStatusFilter(statusFilter === "active" ? "busy" : "active")
          }
        >
          <Filter className="h-4 w-4" />
          {statusFilter === "active" ? "Show Busy" : "Show Active"}
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="w-2/5 rounded-lg border bg-white px-3 py-4">
          <h2 className="mb-4 text-lg font-semibold">Total Routes</h2>

          <div className="flex flex-col gap-3 text-black">
            {filteredRoutes.map(
              (
                route, // Updated to use filteredRoutes
              ) => (
                <button
                  key={route.routeId}
                  type="button" // Changed to button type
                  onClick={() => handleViewDetailsInMap(route.routeId)}
                >
                  <ListItems
                    routeId={route.routeId}
                    totalTime={route.totalTime}
                    first_name={route.driver?.firstName}
                    totalDistance={route.totalDistance}
                    startLng={route.startLng}
                    endLat={route.endLat}
                    endLng={route.endLng}
                    startLat={route.startLat}
                    licensePlate={route.vehicle.licensePlate}
                    interconnect={route.interconnections}
                    status={route.status}
                  />
                </button>
              ),
            )}
          </div>
        </div>

        {/* Thay thế */}
        {/* <div>
          {listRoute.map((route) => (
            <CardRoute
              key={route.route_id}
              name={`${route.start_location} - ${route.end_location}`}
              isOpen={openRoute === route}
              onClick={() => handleRouteClick(route)}
              locations={route.locations}
              notifications={route.notifications}
            />
          ))}
        </div> */}

        <div className="w-3/5 text-white">
          {/* Chứa map chỗ này */}
          {/* <Map /> */}
          <div
            id="mapContainer"
            style={{ width: "100%", height: "500px" }}
            className="rounded-lg border bg-white p-3 shadow-lg"
          ></div>

          {/* {openRoute && (
            <div className="flex gap-2">
              <CardItem
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
          )} */}
        </div>
      </div>
    </div>
  );
};

export default DetailRoute;
