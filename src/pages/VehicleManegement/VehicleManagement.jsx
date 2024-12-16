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
      <div className="mb-2 flex items-center justify-between px-2">
        <div className="">
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
          <p className="text-sm text-gray-600">Manage your fleet efficiently</p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="flex items-center rounded-md bg-black px-4 py-2 text-white hover:bg-slate-900"
        >
          + ADD NEW VEHICLE
        </button>
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddVehicle}
      />

      {/* <hr className=" border-gray-200 dark:border-gray-300 md:my-4" /> */}
      <div className="border-1 my-6 py-1 flex rounded-md border-b bg-white">
        <Link to="OverviewTab" className="px-2 py-2 hover:bg-slate-200">
          Overview
        </Link>
        <Link to="VehiclesTab" className="px-4 py-2 hover:bg-slate-200">
          Vehicles
        </Link>
        <Link to="MaintenanceTab" className="px-4 py-2 hover:bg-slate-200">
          Maintenance
        </Link>
        <Link to="IncidentTab" className="px-4 py-2 hover:bg-slate-200">
          IncidentTab
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default VehicleManagement;
