import React, { useState } from "react";
import OverviewTab from "../components/Tabs/OverviewTab";
import VehiclesTab from "../components/Tabs/VehiclesTab";
import MaintenanceTab from "../components/Tabs/MaintenanceTab";
import AddVehicleModal from "../components/Modals/AddVehicleModal";

const VehicleManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };
  

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
          <p className="text-gray-600">Manage your fleet efficiently</p>
        </div>
        <button
          onClick={() => {
            setIsModalOpen(true); 
          }}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center"
        >
          + ADD NEW VEHICLE
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${
            activeTab === "overview" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "vehicles" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("vehicles")}
        >
          Vehicles
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "maintenance" ? "border-b-2 border-blue-500" : ""
          }`}
          onClick={() => setActiveTab("maintenance")}
        >
          Maintenance
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "vehicles" && <VehiclesTab vehicles={vehicles} />}
        {activeTab === "maintenance" && <MaintenanceTab />}
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
      />
      
    </div>
  );
};

export default VehicleManagement;
