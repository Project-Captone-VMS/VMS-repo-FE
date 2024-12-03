import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button, Input, Modal } from "antd";
import Map from "../../../components/Map/map";
import { getAllDriver, getAllVehicle } from "../../../services/apiRequest";

const Route = () => {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      route: "Route 1",
      start: "Đà Nẵng",
      end: "Huế",
      time: "7:00:00",
      estimateTime: "10",
    },
    {
      id: 2,
      route: "Route 2",
      start: "Quảng Nam",
      end: "Huế",
      time: "8:00:00",
      estimateTime: "10",
    },
  ]);

  const [formData, setFormData] = useState({
    route: "",
    start: "",
    end: "",
    estimateTime: "",
    location: "",
  });

  const [editData, setEditData] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formDriver, setFormDriver] = useState([]);
  const [formVehicle, setFormVehicle] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const driverResult = await getAllDriver();
        setFormDriver(driverResult);

        const vehicleResult = await getAllVehicle();
        console.log("formVehicle heheheh", formVehicle);
        setFormVehicle(vehicleResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getAllDriver, getAllVehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newRoute = {
  //     id: routes.length + 1,
  //     route: formData.route,
  //     start: formData.start,
  //     end: formData.end,
  //     estimateTime: formData.estimateTime,
  //     time: new Date(formData.date).toLocaleTimeString(),
  //   };
  //   setRoutes([...routes, newRoute]);
  //   setFormData({
  //     route: "",
  //     start: "",
  //     end: "",
  //     estimateTime: "",
  //     location: "",
  //   });
  // };

  const handleEdit = (route) => {
    setEditData(route);
    setIsModalVisible(true);
  };

  const handleSave = () => {
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.id === editData.id ? { ...editData } : route
      )
    );
    setIsModalVisible(false);
  };

  //?
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
      }
    );

    const behavior = new H.mapevents.Behavior(
      new H.mapevents.MapEvents(mapInstance)
    );
    H.ui.UI.createDefault(mapInstance, defaultLayers);
    setMap(mapInstance);

    const setUpClickListener = (map) => {
      map.addEventListener("tap", function (evt) {
        const coord = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        const clickedMarker = new H.map.Marker({
          lat: coord.lat,
          lng: coord.lng,
        });
        map.addObject(clickedMarker);
        markers.current.push(clickedMarker);

        const coordinatesText = `${coord.lat.toFixed(4)}, ${coord.lng.toFixed(
          4
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
        /([-+]?[0-9]*\.?[0-9]+),\s*([-+]?[0-9]*\.?[0-9]+)/
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
        }
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

      const response = await axios.get("http://localhost:8080/route", {
        params: {
          originLat: originCoords.lat,
          originLng: originCoords.lng,
          destinationLat: destinationCoords.lat,
          destinationLng: destinationCoords.lng,
        },
      });

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
        "http://localhost:8080/search-suggestions",
        {
          params: {
            query,
            lat: 52.5308,
            lng: 13.3847,
          },
        }
      );
      setSuggestions(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const findSequence = async () => {
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
      const params = {
        startLat: originCoords.lat,
        startLng: originCoords.lng,
        destinations: destinations,
        endLat: destinationCoords.lat,
        endLng: destinationCoords.lng,
        driverId: selectedDriver,
        vehicleId: selectedVehicle,
      };

      const headers = {
        Authorization: `Bearer  eyJhbGciOiJSUzUxMiIsImN0eSI6IkpXVCIsImlzcyI6IkhFUkUiLCJhaWQiOiJZcDgxNk96UkI4M1BWTHM5UzZYZiIsImlhdCI6MTczMDk5MjM1MSwiZXhwIjoxNzMxMDc4NzUxLCJraWQiOiJqMSJ9.ZXlKaGJHY2lPaUprYVhJaUxDSmxibU1pT2lKQk1qVTJRMEpETFVoVE5URXlJbjAuLjcyeFN6anVVem42TDBiMThvOHRNM0EuTHNsRzNRU2dtZUJiM2VYdHZXRWRaT1pYa19xTDhkTG9BT2R4WWJmRXFLbXE5QlBJRjloSzN5ZGx3THU5ZU1xMVgyeTRXOXE3SUQ1R2VKZl9fSFB5OUVaNnZyYTAwZktORnNQd2w1QXVNZFdidXhPOWZTU2gtVjNzWWhHekV2cXB3bklYMnBtQUg3YV91NGQ2S2J1LURlSk0yeDlveVNsYks1Y1h2aVJZZUhFLmkyQ0w2RkRGUkk0c2hLZW9FODVCSHZPLVlReGY2VFJwejJPclZmbWZ1ZEk.SoG2xAly9ZnCDODbE-eaSTn7CxmpGZi83qrqMiZWQ0I4r1IvpMB74P0m9H9Jbu7ilm5kfwglSL87UbdJIIt9LtioCbZsEQECmNSGfxDG5Tm0k7CZTWJ1ZxEdyEUA8y5GW8sntTW86QaGeRpfLtDH2LAPp-MiLjkJzua9dzZzakFlsTkOm8U_cKTwQAuog7xdFD-ikTiJQp9NqlEPF1eYiXISKNCGim8n6SKxPDpexgGD9fqxv5lc1gmAJSko74D494DjQyXAX3rpgd1d8bV6_NXUZLb6w11DJxPXbihi91ch0ffU7Tx6hFLg5u_wemQZlzEIAebXcB6TWFqmvaXUfA`,
      };

      const response = await axios.get("http://localhost:8080/find-sequence", {
        params,
        headers,
      });

      const results = response.data;
    } catch (error) {
      console.error("Failed to fetch sequence:", error);
      setError("Failed to fetch sequence. Please try again later.");
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
        <div
          className="map-container"
          style={{ width: "70%", height: "500px" }}
          ref={mapRef}
        ></div>
        <div className="gap-3" style={{ width: "28%" }}>
          <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">Route on HERE Map</h2>
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-4">
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
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  End:
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
                  />
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Route:
                  <input
                    type="text"
                    value={Route}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Driver:
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
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

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Select Vehicle:
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-500"
                  >
                    <option value="" disabled>
                      Select a vehicle
                    </option>
                    {formVehicle && formVehicle.length > 0 ? (
                      formVehicle.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.vehicleId}
                        </option>
                      ))
                    ) : (
                      <option disabled>Loading drivers...</option>
                    )}
                  </select>
                </label>
              </div>

              <div
                className=" w-full"
                style={{ width: "100%", padding: "10px" }}
              >
                <h3 className="text-lg">Coordinate Information</h3>
                <textarea
                  value={textareaValue}
                  onChange={handleTextareaChange}
                  rows={10}
                  className="mt-4 w-full border border-gray-300 rounded-md "
                />
              </div>
              <div className="flex w-full  items-center gap-5">
                <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 h-10 "
                >
                  Get Route
                </button>
                <button
                  type="button"
                  onClick={findSequence}
                  className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 h-10"
                >
                  Find Sequence
                </button>
              </div>
            </form>

            {loading && <p>Loading route...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {routeInfo.distance && (
              <div className="route-info mt-4 p-4 border border-gray-200 rounded-md">
                <h3 className="text-lg font-semibold">Route Information</h3>
                <p>Distance: {routeInfo.distance} meters</p>
                <p>Duration: {routeInfo.duration} seconds</p>
              </div>
            )}
          </div>
          <hr className="mt-4" />
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-2 p-4 bg-gray-100">
        <h2 className="text-slate-950 text-lg">Total Route</h2>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Route
              </th>
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
                Estimate Time
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr
                key={route.id}
                className="bg-white border-b dark:bg-white dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black "
                >
                  {route.route}
                </th>
                <td className="px-6 py-4">{route.start}</td>
                <td className="px-6 py-4">{route.end}</td>
                <td className="px-6 py-4">{route.time}</td>
                <td className="px-6 py-4 ">{route.estimateTime}</td>
                <td className="px-6 py-4 text-right">
                  <Button type="link" onClick={() => handleEdit(route)}>
                    Edit
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
        <div className="flex flex-col mb-4">
          <label htmlFor="editRoute" className="font-medium text-sm">
            Route
          </label>
          <Input
            id="editRoute"
            name="route"
            value={editData?.route || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editStart" className="font-medium text-sm">
            Start
          </label>
          <Input
            id="editStart"
            name="start"
            value={editData?.start || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editEnd" className="font-medium text-sm">
            End
          </label>
          <Input
            id="editEnd"
            name="end"
            value={editData?.end || ""}
            onChange={handleEditChange}
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="editEstimateTime" className="font-medium text-sm">
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
    </div>
  );
};

export default Route;
