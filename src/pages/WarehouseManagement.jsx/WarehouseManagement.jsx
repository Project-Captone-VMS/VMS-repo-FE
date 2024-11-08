import React, { useState,useEffect } from 'react';
import { Plus, Package, MapPin, User, BarChart2, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { WarehouseCard } from '../../components/Warehouse/WarehouseCard';
import { AddWarehouse } from '../../components/Modals/AddWarehouse';
import EditWarehouse from '../../components/Modals/EditWarehouse';
import { getAllWarehouses, deleteWarehouse } from "../../services/apiRequest";
import Swal from "sweetalert2";

const WarehouseManagement = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [warehouses, setWarehouses] = useState([]);

  const fetchWarehouses = async () => {
    try {
      const data = await getAllWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to fetch warehouses. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleAddWarehouse = (warehouse) => {
    setWarehouses([...warehouses, warehouse]);
    setIsAddModalOpen(false);
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Warehouse added successfully.',
    });
  };

  const handleEditWarehouse = (warehouse) => {
    setEditingWarehouse(warehouse);
    setIsEditModalOpen(true);
  };

  const handleUpdateWarehouse = (updatedWarehouse) => {
    setWarehouses(warehouses.map(w => 
      w.id === updatedWarehouse.id ? updatedWarehouse : w
    ));
    setIsEditModalOpen(false);
    setEditingWarehouse(null);
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Warehouse information updated successfully.',
    });
  };

  const handleDeleteWarehouse = async (warehouseId) => {
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete warehouse ${warehouseId}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteWarehouse(warehouseId);
        setWarehouses(warehouses.filter(w => w.id !== warehouseId));
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Warehouse deleted successfully.',
        });
      } catch (error) {
        console.error("Error deleting warehouse:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete the warehouse. Please try again.',
        });
      }
    }
  };

  // Rest of the component code remains the same...
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="h-8 w-8 text-blue-600" />
                Warehouse Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your warehouses and inventory efficiently</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Warehouse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input 
              className="pl-10 bg-white" 
              placeholder="Search warehouses..." 
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Utilization</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Locations</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
          </div>
        </div>

        {/* Warehouse Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map(warehouse => (
            <WarehouseCard
              key={warehouse.warehouseId}
              warehouse={warehouse}
              onSelect={() => navigate(`/warehouse/${warehouse.warehouseId}`)}
              onEdit={handleEditWarehouse}
              onDelete={() => handleDeleteWarehouse(warehouse.warehouseId)}
            />
          ))}
        </div>
      </div>

      {/* Add Warehouse Modal */}
      <AddWarehouse
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWarehouse}
      />

      {/* Edit Warehouse Modal */}
      {editingWarehouse && (
        <EditWarehouse
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingWarehouse(null);
          }}
          onUpdate={handleUpdateWarehouse}
          warehouse={editingWarehouse}
        />
      )}
    </div>
  );
};

export default WarehouseManagement;