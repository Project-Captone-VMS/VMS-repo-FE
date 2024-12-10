import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Modal } from "antd";
import { CardTitle } from "../../components/ui/card";
import { MapPin } from "lucide-react";
import {
  getWayPoint,
  getInterConnections,
  getRouteByUserName,
} from "../../services/apiRequest";
import axios from "axios";

export default function RealtimeTrackingDashboard() {
  const [position, setPosition] = useState({ lat: 10.8231, lng: 106.6297 });
  const [routes, setRoutes] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);
  const [interconnect, setInterconnect] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [mapWayPoints, setMapWayPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const routePolylines = useRef([]);
  const markers = useRef([]);
  const mapRef = useRef(null);
  const usernameLocal = localStorage.getItem("username");
  const token = localStorage.getItem("jwtToken");

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
        }
      );

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapInstance));
      window.H.ui.UI.createDefault(mapInstance, defaultLayers);
      mapRef.current = mapInstance;

      mapInstance.addEventListener("resize", () =>
        mapInstance.getViewPort().resize()
      );
    }
  }, []);

  const handleViewDetails = async (id) => {
    try {
      const res = await getWayPoint(id);
      setWayPoints(res);
      const response = await getInterConnections(id);
      setInterconnect(response);
      setIsDetailModalVisible(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleViewDetailsInMap = async (id) => {
    try {
      const res = await getWayPoint(id);
      setMapWayPoints(res);

      setLoading(true);
      clearMap();
      res.forEach((wayPoint, index) => {
        const marker = new window.H.map.Marker({ lat: wayPoint.lat, lng: wayPoint.lng });
        
        let label = `Waypoint ${index}: (${wayPoint.lat.toFixed(4)}, ${wayPoint.lng.toFixed(4)})`;
        if (index === 0) {
          label = `Start: (${wayPoint.lat.toFixed(4)}, ${wayPoint.lng.toFixed(4)})`;
        } else if (index === res.length - 1) {
          label = `End: (${wayPoint.lat.toFixed(4)}, ${wayPoint.lng.toFixed(4)})`;
        }
        
        marker.setData(label);
        mapRef.current.addObject(marker);
        markers.current.push(marker);
        
        marker.addEventListener('tap', function (e) {
          const content = marker.getData();
          alert(content);
        });
      });
      
      
      

      const response = await axios.get("http://localhost:8080/api/route/findRoute", {
        params: {
          originLat: res[0].lat,
          originLng: res[0].lng,
          destinationLat: res[res.length - 1].lat,
          destinationLng: res[res.length - 1].lng,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    const routeLine = window.H.geo.LineString.fromFlexiblePolyline(polylineData);

    const outlinePolyline = new window.H.map.Polyline(routeLine, {
      style: { strokeColor: "gray", lineWidth: 8 },
    });
    const routePolyline = new window.H.map.Polyline(routeLine, {
      style: { strokeColor: "rgba(173, 216, 230, 0.8)", lineWidth: 5 },
    });

    mapRef.current.addObject(outlinePolyline);
    mapRef.current.addObject(routePolyline);
    routePolylines.current.push(outlinePolyline, routePolyline);

    mapRef.current.getViewModel().setLookAtData({ bounds: routePolyline.getBoundingBox() });

    const originMarker = new window.H.map.Marker({ lat: routeWayPoints[0].lat, lng: routeWayPoints[0].lng });
    const destinationMarker = new window.H.map.Marker({ lat: routeWayPoints[routeWayPoints.length - 1].lat, lng: routeWayPoints[routeWayPoints.length - 1].lng });

    mapRef.current.addObject(originMarker);
    mapRef.current.addObject(destinationMarker);
    markers.current.push(originMarker, destinationMarker);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listRouteTracking = await getRouteByUserName(usernameLocal);
        setRoutes(listRouteTracking);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [usernameLocal]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `About ${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Real-time Vehicle Tracking</h1>
      </div>

      <div className="flex flex-col space-y-4">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Live Map
        </CardTitle>
        <div id="mapContainer" style={{ width: "100%", height: "500px" }} className="rounded-lg shadow-lg"></div>

        <table className="w-full text-sm text-left rtl:text-right text-black dark:text-black font-normal rounded-lg">
          <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              {["Start", "End", "Time", "Distance", "Fullname Driver", "License Plate", "Action"].map((header) => (
                <th key={header} scope="col" className="px-6 py-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route.routeId} className="bg-white border-b dark:bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-200">
                <td className="px-6 py-4">{route.startLat}, {route.startLng}</td>
                <td className="px-6 py-4">{route.endLat}, {route.endLng}</td>
                <td className="px-6 py-4">{route.totalTime} s</td>
                <td className="px-6 py-4">{route.totalDistance} m</td>
                <td className="px-6 py-4">{`${route.driver.firstName} ${route.driver.lastName}`}</td>
                <td className="px-6 py-4">{route.vehicle.licensePlate}</td>
                <td className="px-2 py-4">
                  <Button type="link" onClick={() => handleViewDetails(route.routeId)}>Detail</Button>
                  <Button type="link" onClick={() => handleViewDetailsInMap(route.routeId)}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        title="Route Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>Close</Button>,
        ]}
        width={700}
      >
        <div className="space-y-6">
          <div className="bg-gray-200 p-4 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["From", "To", "Distance (m)", "Time Waypoint (s)", "Coordinates"].map((header) => (
                      <th key={header} className="px-4 py-2 text-xs font-medium text-gray-500">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {wayPoints.map((wayPoint, index) => (
                    index < wayPoints.length - 1 && (
                      <tr key={wayPoint.waypointId} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm text-gray-900">{interconnect[index]?.fromWaypoint || ""}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{interconnect[index]?.toWaypoint || ""}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{interconnect[index]?.distance || ""}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{interconnect[index] ? formatTime(interconnect[index].timeWaypoint) : ""}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          From {wayPoint.lat.toFixed(4)}, {wayPoint.lng.toFixed(4)} To {wayPoints[index + 1].lat.toFixed(4)}, {wayPoints[index + 1].lng.toFixed(4)}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
