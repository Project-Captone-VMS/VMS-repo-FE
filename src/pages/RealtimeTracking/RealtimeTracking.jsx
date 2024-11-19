import React, { useState } from "react";
import { trucks } from "../../components/tracking/truck";
import { AlertsSection } from "../../components/tracking/AlertsSection";
import { VehicleList } from "../../components/ui/VehicleList";
import { TimelineSection } from "../../components/tracking/TimelineSection";
import { CardTitle } from "../../components/ui/card";
import { MapPin } from "lucide-react";
import Map from "../../components/Map/map";

export default function RealtimeTrackingDashboard() {
  const [selectedTruck, setSelectedTruck] = useState(null);

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

        <Map />

        <AlertsSection trucks={trucks} />
        <VehicleList
          trucks={trucks}
          selectedTruck={selectedTruck}
          onSelectTruck={setSelectedTruck}
        />
        <TimelineSection selectedTruck={selectedTruck} />
      </div>
    </div>
  );
}
