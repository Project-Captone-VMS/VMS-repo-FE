import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AlertCircle } from 'lucide-react';

const EditVehicleModal = ({ vehicle, onClose, onSave }) => {
  const [vehicleData, setVehicleData] = useState({
    type: "",
    capacity: "",
    licensePlate: "",
    maintenanceSchedule: "",
    status: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setVehicleData({
        type: vehicle.type || "",
        capacity: vehicle.capacity || "",
        licensePlate: vehicle.licensePlate || "",
        maintenanceSchedule: vehicle.maintenanceSchedule || "",
        status: vehicle.status || false,
      });
    }
  }, [vehicle]);

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    switch (name) {
      case "licensePlate":
        if (!value) {
          errors.licensePlate = "License plate is required.";
        } else if (value.length > 15) {
          errors.licensePlate = "License plate cannot exceed 15 characters.";
        } else {
          delete errors.licensePlate;
        }
        break;

      case "type":
        if (!value) {
          errors.type = "Type is required.";
        } else if (value.length > 30) {
          errors.type = "Type cannot exceed 30 characters.";
        } else {
          delete errors.type;
        }
        break;

      case "capacity":
        if (!value || value <= 0) {
          errors.capacity = "Capacity must be a positive number.";
        } else {
          delete errors.capacity;
        }
        break;

      case "status":
        if (value === undefined || value === null) {
          errors.status = "Status is required.";
        } else {
          delete errors.status;
        }
        break;

      case "maintenanceSchedule":
        if (!value) {
          errors.maintenanceSchedule = "Maintenance schedule is required.";
        } else {
          const date = new Date(value);
          const today = new Date();
          if (date < today) {
            errors.maintenanceSchedule =
              "Maintenance schedule must be today or in the future.";
          } else {
            delete errors.maintenanceSchedule;
          }
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prevData) => ({
      ...prevData,
      [name]: name === 'status' ? value === 'true' : value,
    }));
    validateField(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = Object.keys(fieldErrors).length === 0;
    if (!isValid) return;

    onSave({ ...vehicleData, vehicleId: vehicle.vehicleId });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            Plate Number
            <Input
              type="text"
              name="licensePlate"
              value={vehicleData.licensePlate}
              onChange={handleChange}
              className={`w-full ${
                fieldErrors.licensePlate ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {fieldErrors.licensePlate && (
              <span className="text-red-500 text-sm">
                {fieldErrors.licensePlate}
              </span>
            )}
          </label>
          <label className="block mb-2">
            Type
            <Input
              type="text"
              name="type"
              value={vehicleData.type}
              onChange={handleChange}
              className={`w-full ${
                fieldErrors.type ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {fieldErrors.type && (
              <span className="text-red-500 text-sm">{fieldErrors.type}</span>
            )}
          </label>
          <label className="block mb-2">
            Status
            <Select
              name="status"
              value={vehicleData.status.toString()}
              onValueChange={(value) => handleChange({ target: { name: 'status', value } })}
            >
              <SelectTrigger className={`w-full ${
                fieldErrors.status ? "border-red-500" : "border-gray-300"
              }`}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Active (Available)</SelectItem>
                <SelectItem value="true">Busy (On Delivery)</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.status && (
              <span className="text-red-500 text-sm">{fieldErrors.status}</span>
            )}
          </label>
          <label className="block mb-2">
            Capacity
            <Input
              type="number"
              name="capacity"
              value={vehicleData.capacity}
              onChange={handleChange}
              className={`w-full ${
                fieldErrors.capacity ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {fieldErrors.capacity && (
              <span className="text-red-500 text-sm">
                {fieldErrors.capacity}
              </span>
            )}
          </label>
          <label className="block mb-2">
            Maintenance Schedule
            <Input
              type="date"
              name="maintenanceSchedule"
              value={vehicleData.maintenanceSchedule}
              onChange={handleChange}
              className={`w-full ${
                fieldErrors.maintenanceSchedule
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              required
            />
            {fieldErrors.maintenanceSchedule && (
              <span className="text-red-500 text-sm">
                {fieldErrors.maintenanceSchedule}
              </span>
            )}
          </label>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Vehicle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleModal;

