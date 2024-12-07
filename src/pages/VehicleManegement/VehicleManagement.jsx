import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AddVehicleModal from "../../components/Modals/AddVehicleModal";

const VehicleManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vehicles, setVehicles] = useState([]);

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
        <Link to="OverviewTab" className="px-4 py-2">
          Overview
        </Link>
        <Link to="VehiclesTab" className="px-4 py-2">
          Vehicles
        </Link>
        <Link to="MaintenanceTab" className="px-4 py-2">
          Maintenance
        </Link>
        <Link to="IncidentTab" className="px-4 py-2">
          IncidentTab
        </Link>
      </div>

      <Outlet />
  
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
      />
    </div>
  );
};

export default VehicleManagement;
