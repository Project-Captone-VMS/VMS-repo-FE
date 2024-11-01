import React, { useState } from "react";
import { trucks } from "../components/tracking/constants/truck";
import {MapSection} from "../components/tracking/map/MapSection.jsx";
import { AlertsSection } from "../components/tracking/Alerts/AlertsSection";
import { VehicleList } from "../components/ui/VehicleList";
import { TimelineSection } from "../components/tracking/Timeline/TimelineSection";
import Map from "../components/Map.jsx";

export default function RealtimeTrackingDashboard() {
  // const [selectedTruck, setSelectedTruck] = useState(null);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Real-time Vehicle Tracking</h1>
      </div>

      <div className="flex flex-col space-y-4">
          <Map />
        {/*<AlertsSection trucks={trucks} />*/}

        {/*<VehicleList*/}
        {/*  trucks={trucks}*/}
        {/*  selectedTruck={selectedTruck}*/}
        {/*  onSelectTruck={setSelectedTruck}*/}
        {/*/>*/}
        {/*<TimelineSection selectedTruck={selectedTruck} />*/}
      </div>
    </div>
  );
}
