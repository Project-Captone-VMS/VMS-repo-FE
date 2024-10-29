import React, { useState } from "react";
import { updateDriver } from "../../services/apiRequest";
import Swal from "sweetalert2";

const UpdateDriverModal = ({ isOpen, onClose, driver, onUpdate }) => {
  const [updatedDriver, setUpdatedDriver] = useState({ ...driver });
  const [fieldErrors, setFieldErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDriver((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value); // Xác thực trường khi thay đổi
  };

  const validateField = (name, value) => {
    let errors = { ...fieldErrors };

    switch (name) {
      case "licenseNumber":
        if (!value) {
          errors.licenseNumber = "License number is required.";
        } else if (value.length > 20) {
          errors.licenseNumber = "License number cannot exceed 20 characters.";
        } else {
          delete errors.licenseNumber;
        }
        break;

      case "workSchedule":
        if (!value) {
          errors.workSchedule = "Work schedule is required.";
        } else {
          delete errors.workSchedule;
        }
        break;

      case "status":
        if (!value) {
          errors.status = "Status is required.";
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
    // Kiểm tra lỗi trước khi lưu
    if (Object.keys(fieldErrors).length > 0) {
      await Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fix the validation errors.",
      });
      return;
    }

    const { driverId, ...driverWithoutId } = updatedDriver;

    try {
      const updatedData = await updateDriver(driverId, driverWithoutId);

      if (updatedData) {
        onUpdate(updatedData);
        await Swal.fire({
          title: "Success!",
          text: "Driver updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });

        onClose();
      } else {
        await Swal.fire({
          title: "Error!",
          text: "Update failed. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error updating driver:", error);
      await Swal.fire({
        title: "Error!",
        text: "There was an error updating the driver. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
          <h2 className="text-xl font-bold mb-4">Update Driver</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={updatedDriver.firstName}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={updatedDriver.lastName}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                name="status"
                value={updatedDriver.status}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-500 ${
                  fieldErrors.status ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.status && (
                <div className="text-red-500">{fieldErrors.status}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                License Number
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={updatedDriver.licenseNumber}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-500 ${
                  fieldErrors.licenseNumber ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.licenseNumber && (
                <div className="text-red-500">{fieldErrors.licenseNumber}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Work Schedule
              </label>
              <input
                type="date"
                name="workSchedule"
                value={updatedDriver.workSchedule}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg focus:ring focus:ring-blue-500 ${
                  fieldErrors.workSchedule ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.workSchedule && (
                <div className="text-red-500">{fieldErrors.workSchedule}</div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateDriverModal;
