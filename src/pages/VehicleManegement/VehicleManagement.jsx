import React, { useState } from "react";
import OverviewTab from "./sub-pages/OverviewTab";
import VehiclesTab from "./sub-pages/VehiclesTab";
import MaintenanceTab from "./sub-pages/MaintenanceTab";
import AddVehicleModal from "../../components/Modals/AddVehicleModal";

const VehicleManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

  const tabs = [
    { name: "Overview", value: "overview" },
    { name: "Vehicles", value: "vehicles" },
    { name: "Maintenance", value: "maintenance" },
  ];

  const handleAddVehicle = (newVehicle) => {
    setVehicles((prev) => [...prev, newVehicle]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2 ">
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

      <hr className="my-6 md:my-4 border-gray-200 dark:border-gray-300 " />

      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`px-4 py-2 ${
              activeTab === tab.value ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.name}
          </button>
        ))}
      </div>

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
