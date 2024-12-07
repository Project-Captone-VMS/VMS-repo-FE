import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";

const validateMaintenanceData = (data) => {
  const errors = {};

  if (!data.vehicleId) {
    errors.vehicleId = "Vehicle ID is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.type?.trim()) {
    errors.type = "Type is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  const cost = Number(data.cost);
  if (!data.cost) {
    errors.cost = "Cost is required";
  } else if (isNaN(cost) || cost < 0) {
    errors.cost = "Cost must be a valid positive number";
  }

  return errors;
};

const EditMaintenanceModal = ({ isOpen, onClose, maintenance, onSubmit }) => {
  const [formData, setFormData] = useState({
    vehicleId: "",
    date: "",
    type: "",
    description: "",
    cost: "",
    status: "In Progress",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (maintenance) {
      setFormData({
        vehicleId: maintenance.vehicle?.vehicleId || "",
        date: maintenance.date || "",
        type: maintenance.type || "",
        description: maintenance.description || "",
        cost: maintenance.cost || "",
        status: maintenance.status || "In Progress",
      });
    }
  }, [maintenance]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateMaintenanceData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
      onClose();
    } else {
      toast.error("Please fix all errors before submitting");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Edit Maintenance Record</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Vehicle ID</label>
            <Input
              value={formData.vehicleId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, vehicleId: e.target.value }))
              }
              className={`w-full ${errors.vehicleId ? 'border-red-500' : ''}`}
            />
            {errors.vehicleId && (
              <p className="text-red-500 text-sm">{errors.vehicleId}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className={`w-full ${errors.date ? 'border-red-500' : ''}`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <Input
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              className={`w-full ${errors.type ? 'border-red-500' : ''}`}
            />
            {errors.type && (
              <p className="text-red-500 text-sm">{errors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`w-full ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Cost</label>
            <Input
              type="number"
              value={formData.cost}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cost: e.target.value }))
              }
              className={`w-full ${errors.cost ? 'border-red-500' : ''}`}
            />
            {errors.cost && (
              <p className="text-red-500 text-sm">{errors.cost}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Update
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenanceModal; 