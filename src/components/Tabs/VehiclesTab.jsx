import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Edit, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableRow } from "../Vehicle/Table";
import Pagination from "../Layouts/Pagination";
import EditVehicleModal from "../Modals/EditVehicleModal";
import {
  getAllVehicle,
  updateVehicle,
  getVehicleById,
  deleteVehicle
} from "../../services/api";
import Swal from "sweetalert2";

import {formatDate} from "../../lib/formatDate"

// Utility functions
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// Sub-components
const VehiclesTable = ({ vehicles, currentPage, itemsPerPage, onEdit, onDelete }) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedVehicles = vehicles.slice(startIndex, endIndex);

  const renderTableRow = (vehicle, index) => (
    <TableRow key={vehicle.vehicleId}>
      <div className="font-medium">{startIndex + index + 1}</div>
      <div className="font-medium">{vehicle.vehicleId}</div>
      <div className="font-medium">{vehicle.licensePlate}</div>
      <div className="font-medium">{vehicle.type}</div>
      <div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            vehicle.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {vehicle.status}
        </span>
      </div>
      <div className="font-medium">{vehicle.capacity}</div>
      <div className="font-medium">{formatDate(vehicle.maintenanceSchedule)}</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(vehicle.vehicleId)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={() => onDelete(vehicle.vehicleId)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </TableRow>
  );

  return (
    <Table
      headers={[
        "STT",
        "ID",
        "Plate Number",
        "Type",
        "Status",
        "Capacity",
        "Maintenance Schedule",
        "Actions",
      ]}
    >
      {displayedVehicles.map(renderTableRow)}
    </Table>
  );
};

const VehiclesTab = () => {
  // State declarations
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);

  // Data fetching
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const data = await getAllVehicle();
        setVehicles(data);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setError("Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Event handlers
  const handleEdit = async (vehicleId) => {
    try {
      const vehicleToEdit = await getVehicleById(vehicleId);
      setEditingVehicle(vehicleToEdit);
    } catch (error) {
      console.error(`Error fetching vehicle with ID: ${vehicleId}`, error);
    }
  };

  const handleSaveVehicle = async (updatedVehicle) => {
    const { vehicleId, ...vehicleWithoutId } = updatedVehicle;

    try {
      await updateVehicle(vehicleId, vehicleWithoutId);
      setVehicles((prevVehicles) => 
        prevVehicles.map(vehicle => 
          vehicle.vehicleId === vehicleId ? { ...vehicle, ...vehicleWithoutId } : vehicle
        )
      );

      Swal.fire({
        title: 'Success!',
        text: 'Vehicle updated successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred while updating the vehicle.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteVehicle(vehicleId);
        setVehicles((prevVehicles) => 
          prevVehicles.filter(vehicle => vehicle.vehicleId !== vehicleId)
        );
        
        Swal.fire('Deleted!', 'Your vehicle has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        Swal.fire('Error!', 'An error occurred while deleting the vehicle.', 'error');
      }
    }
  };

  const handleCloseModal = () => {
    setEditingVehicle(null);
  };

  // Loading and error states
  if (loading) {
    return <div>Loading vehicles...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Main render
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Vehicle List</CardTitle>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search vehicles..." className="pl-10" />
            </div>
            <Button variant="outline">
              <ChevronDown className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <VehiclesTable
          vehicles={vehicles}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onEdit={handleEdit}
          onDelete={handleDeleteVehicle}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
        />
      </CardContent>

      {editingVehicle && (
        <EditVehicleModal
          vehicle={editingVehicle}
          onClose={handleCloseModal}
          onSave={handleSaveVehicle}
        />
      )}
    </Card>
  );
};

export default VehiclesTab;