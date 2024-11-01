import React, { useState,useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { updateDriver } from "../../services/apiRequest";
import { AlertCircle } from "lucide-react";
import Swal from "sweetalert2";

const STATUS_OPTIONS = ["On duty", "On Leave", "Available"];
const SCHEDULE_OPTIONS = ["Monday-Friday", "Weekend", "Night Shift"];

const UpdateDriver = ({ isOpen, onClose, driver, onDriverUpdated }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [updatedDriver, setUpdatedDriver] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber:"",
    status: "",
    licenseNumber: "",
    workSchedule: "",
  });

  useEffect(() => {
    if (driver) {
      setUpdatedDriver(driver);
    }
  }, [driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDriver((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    switch (name) {
      case "licenseNumber":
        if (!value) {
          errors.licenseNumber = "License number is required.";
        } else if (value.length > 20) {
          errors.licenseNumber = "License number cannot exceed 20 characters.";
        } else if (!/^[A-Za-z0-9-]+$/.test(value)) {
          errors.licenseNumber = "License number can only contain letters, numbers, and hyphens.";
        } else {
          delete errors.licenseNumber;
        }
        break;

      case "workSchedule":
        if (!value) {
          errors.workSchedule = "Work schedule is required.";
        } else if (!SCHEDULE_OPTIONS.includes(value)) {
          errors.workSchedule = "Please select a valid work schedule.";
        } else {
          delete errors.workSchedule;
        }
        break;

      case "status":
        if (!value) {
          errors.status = "Status is required.";
        } else if (!STATUS_OPTIONS.includes(value)) {
          errors.status = "Please select a valid status.";
        } else {
          delete errors.status;
        }
        break;

      default:
        break;
    }

    setFieldErrors(errors);
  };

  const handleSave = async () => {
    // Validate all fields before saving
    let hasErrors = false;
    const fieldsToValidate = ["status", "licenseNumber", "workSchedule"];
    
    fieldsToValidate.forEach(field => {
      validateField(field, updatedDriver[field]);
      if (fieldErrors[field]) {
        hasErrors = true;
      }
    });

    if (hasErrors || Object.keys(fieldErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fix all validation errors before saving.',
      });
      return;
    }

    const { driverId, ...driverWithoutId } = updatedDriver;

    try {
      const updatedData = await updateDriver(driverId, driverWithoutId);
      if (updatedData) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Driver information updated successfully.',
        });
        onDriverUpdated();
        onClose();
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'There was an error updating the driver. Please try again.',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-50 border border-gray-200">
        <DialogHeader className="bg-gray-50 p-4 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-gray-800">Update Driver</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={updatedDriver.firstName}
              className="w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={updatedDriver.lastName}
              className="w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              name="email"
              value={updatedDriver.email}
              onChange={handleChange}
              className={`w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500 ${
                fieldErrors.email ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.email && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.email}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              phoneNumber
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={updatedDriver.phoneNumber}
              onChange={handleChange}
              className={`w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500 ${
                fieldErrors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.phoneNumber && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.phoneNumber}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={updatedDriver.status}
              onChange={handleChange}
              className={`w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500 ${
                fieldErrors.status ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {fieldErrors.status && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.status}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              value={updatedDriver.licenseNumber}
              onChange={handleChange}
              className={`w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500 ${
                fieldErrors.licenseNumber ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.licenseNumber && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.licenseNumber}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Schedule
            </label>
            <select
              name="workSchedule"
              value={updatedDriver.workSchedule}
              onChange={handleChange}
              className={`w-full p-2 border bg-gray-100 rounded-lg focus:ring focus:ring-blue-500 ${
                fieldErrors.workSchedule ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Schedule</option>
              {SCHEDULE_OPTIONS.map((schedule) => (
                <option key={schedule} value={schedule}>
                  {schedule}
                </option>
              ))}
            </select>
            {fieldErrors.workSchedule && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {fieldErrors.workSchedule}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2 p-4 bg-gray-50 rounded-b-lg">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDriver;
