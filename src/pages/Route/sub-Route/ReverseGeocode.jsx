import React, { useState } from "react";
import axios from "axios";
import { getWayPoint } from "../../../services/apiRequest.js";


const apiKey = "jlBGGMAGg54YwZpieijupQwJpNMeGd9uwXDfRbjf-ag";

const ReverseGeocode = () => {
    const [id, setId] = useState("");
    const [waypoints, setWaypoints] = useState([]);
    const [error, setError] = useState("");


    const convertGeocode = async (lat, lng) => {
        try {
            const response = await axios.get(
                "https://revgeocode.search.hereapi.com/v1/revgeocode",
                {
                    params: {
                        at: `${lat},${lng}`,
                        lang: 'en-US',
                        apiKey: apiKey,
                    },
                }
            );

            if (response.data && response.data.items && response.data.items.length > 0) {
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


    const fetchWayPoint = async () => {
        if (!id) {
            setError("Please enter a valid ID.");
            return;
        }

        try {
            const res = await getWayPoint(id); // Get waypoint data from API
            if (res && Array.isArray(res) && res.length > 0) {
                const validWaypoints = res.filter(waypoint => !isNaN(waypoint.lat) && !isNaN(waypoint.lng));

                const waypointAddresses = [];
                for (const waypoint of validWaypoints) {
                    const { lat, lng } = waypoint;
                    const address = await convertGeocode(lat, lng);
                    waypointAddresses.push({ ...waypoint, address });
                }

                setWaypoints(waypointAddresses);
                setError("");
            } else {
                setError("No waypoints found for the given ID.");
                setWaypoints([]);
            }
        } catch (err) {
            setError("Error fetching waypoint data.");
            console.error(err);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Reverse Geocoding</h1>

            <div className="mb-4">
                <label htmlFor="id" className="block mb-2">Enter ID:</label>
                <input
                    type="text"
                    id="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Enter ID"
                    className="w-full p-2 border rounded"
                />
            </div>

            <button
                onClick={fetchWayPoint}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Get Address
            </button>

            {error && <div className="text-red-500 mt-4">{error}</div>}

            {waypoints.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Waypoints and Addresses:</h3>
                    {waypoints.map((waypoint, index) => (
                        <div key={waypoint.waypointId} className="bg-gray-100 p-4 rounded mb-4">
                            <h4 className="text-lg font-semibold">Waypoint {index + 1}</h4>
                            <p><strong>Latitude:</strong> {waypoint.lat}</p>
                            <p><strong>Longitude:</strong> {waypoint.lng}</p>
                            {waypoint.address ? (
                                <div>
                                    <p>
                                        <p>
                                            <strong>Địa
                                                chỉ:</strong> {waypoint.address.houseNumber} {waypoint.address.street},
                                            {waypoint.address.district}, {waypoint.address.city}, {waypoint.address.state}
                                            {waypoint.address.country.toUpperCase()} - ({waypoint.address.label})
                                        </p>

                                    </p>


                                </div>
                            ) : (
                                <p>No address found for this waypoint.</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReverseGeocode;
