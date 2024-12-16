import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { createVehicle } from "../../services/apiRequest";

// Modal thêm xe
const AddVehicleModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    type: "",
    capacity: "",
    status: "false",
    maintenanceSchedule: "",
  });

  // Reset the state (refresh the modal)
  const resetState = () => {
    setVehicleData({
      licensePlate: "",
      type: "",
      capacity: "",
      status: "false",
      maintenanceSchedule: "",
    });
    setFieldErrors({});
    setTouchedFields({});
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });

    setTouchedFields({
      ...touchedFields,
      [name]: true,
    });

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    switch (name) {
      case "licensePlate":
        if (!value) {
          errors.licensePlate = "License plate is required";
        } else if (value.length > 15) {
          errors.licensePlate = "License plate cannot exceed 15 characters";
        } else if (!/^[0-9]{2}[A-Z]{1}-\d{4,5}$/.test(value)) {
          errors.licensePlate =
            "License plate must be in the format XXA-1234 or XX-12345 (2 digits, 1 letter, 4-5 digits)";
        } else {
          delete errors.licensePlate;
        }
        break;

      case "type":
        if (!value) {
          errors.type = "Vehicle type is required";
        } else if (value.length > 30) {
          errors.type = "Vehicle type cannot exceed 30 characters";
        } else {
          delete errors.type;
        }
        break;

      case "capacity":
        if (!value || value <= 0) {
          errors.capacity = "Capacity must be a positive number";
        } else {
          delete errors.capacity;
        }
        break;

      case "status":
        if (!value) {
          errors.status = "Status is required";
        } else {
          delete errors.status;
        }
        break;

      case "maintenanceSchedule":
        if (!value) {
          errors.maintenanceSchedule = "Maintenance schedule is required";
        } else {
          const date = new Date(value);
          const today = new Date();
          if (date < today) {
            errors.maintenanceSchedule = "Schedule must be today or later";
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

  const handleSave = async (event) => {
    event.preventDefault();

    const allTouched = Object.keys(vehicleData).reduce(
      (acc, key) => ({
        ...acc,
        [key]: true,
      }),
      {},
    );
    setTouchedFields(allTouched);

    Object.keys(vehicleData).forEach((key) => {
      validateField(key, vehicleData[key]);
    });

    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    // Convert status to boolean before sending to backend
    const vehicleDataToSend = {
      ...vehicleData,
      status: vehicleData.status === "true",
    };

    try {
      await createVehicle(vehicleDataToSend);
      toast.success("Vehicle created successfully!");
      resetState(); // Reset state after successful save
      onClose(); // Close modal after saving

      // Refresh the page by using window.location.reload()
      window.location.reload();
    } catch (error) {
      toast.error("Failed to create vehicle");
    }
  };

  const getInputStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return "default";
    return fieldErrors[fieldName] ? "error" : "success";
  };

  return (
    <>
      <Toaster position="top-right" />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"></div>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Add New Vehicle
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6 space-y-6 bg-white">
            {/* License Plate Field */}
            <div className="relative">
              <Label
                htmlFor="licensePlate"
                className="block text-sm font-medium text-gray-700"
              >
                License Plate
              </Label>
              <div className="relative mt-1">
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  value={vehicleData.licensePlate}
                  onChange={handleInputChange}
                  className={`block w-full bg-white pr-10 ${
                    getInputStatus("licensePlate") === "error"
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : getInputStatus("licensePlate") === "success"
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter license plate"
                />
                {touchedFields.licensePlate && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("licensePlate") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : getInputStatus("licensePlate") === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {fieldErrors.licensePlate && touchedFields.licensePlate && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.licensePlate}
                </p>
              )}
            </div>

            {/* Vehicle Type Field */}
            <div className="relative">
              <Label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Type
              </Label>
              <div className="relative mt-1">
                <Input
                  id="type"
                  name="type"
                  value={vehicleData.type}
                  onChange={handleInputChange}
                  className={`block w-full bg-white pr-10 ${
                    getInputStatus("type") === "error"
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : getInputStatus("type") === "success"
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter vehicle type"
                />
                {touchedFields.type && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("type") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : getInputStatus("type") === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {fieldErrors.type && touchedFields.type && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.type}
                </p>
              )}
            </div>

            {/* Capacity Field */}
            <div className="relative">
              <Label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </Label>
              <div className="relative mt-1">
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={vehicleData.capacity}
                  onChange={handleInputChange}
                  className={`block w-full bg-white pr-10 ${
                    getInputStatus("capacity") === "error"
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : getInputStatus("capacity") === "success"
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="Enter capacity"
                />
                {touchedFields.capacity && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("capacity") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : getInputStatus("capacity") === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {fieldErrors.capacity && touchedFields.capacity && (
                <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.capacity}
                </p>
              )}
            </div>

            {/* Status Field */}
            <div className="relative">
              <Label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </Label>
              <div className="relative mt-1">
                <Input
                  id="status"
                  name="status"
                  value="Active (Available)"
                  readOnly
                  className="block w-full cursor-not-allowed bg-gray-100"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

            {/* Maintenance Schedule Field */}
            <div className="relative">
              <Label
                htmlFor="maintenanceSchedule"
                className="block text-sm font-medium text-gray-700"
              >
                Maintenance Schedule
              </Label>
              <div className="relative mt-1">
                <Input
                  id="maintenanceSchedule"
                  name="maintenanceSchedule"
                  type="date"
                  value={vehicleData.maintenanceSchedule}
                  onChange={handleInputChange}
                  className={`block w-full bg-white pr-10 ${
                    getInputStatus("maintenanceSchedule") === "error"
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : getInputStatus("maintenanceSchedule") === "success"
                        ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {touchedFields.maintenanceSchedule && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("maintenanceSchedule") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : getInputStatus("maintenanceSchedule") === "success" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {fieldErrors.maintenanceSchedule &&
                touchedFields.maintenanceSchedule && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {fieldErrors.maintenanceSchedule}
                  </p>
                )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="bg-white px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Vehicle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddVehicleModal;
