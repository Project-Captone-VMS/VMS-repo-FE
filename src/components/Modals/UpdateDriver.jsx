import React, { useState } from 'react';

const UpdateDriverModal = ({ isOpen, onClose, driver, onUpdate }) => {
  const [updatedDriver, setUpdatedDriver] = useState({ ...driver });
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDriver((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Logging to check if the save is working
    console.log("Save button clicked");
    console.log("Updated driver:", updatedDriver);
    
    // Simulate saving
    onUpdate(updatedDriver);
    
    // Set success message
    setSuccessMessage('Update driver thành công');
    
    // Auto close the modal after a delay
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 2000);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50" onClick={onClose}></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
          <h2 className="text-xl font-bold mb-4">Update Driver</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={updatedDriver.firstName}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={updatedDriver.lastName}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <input
                type="text"
                name="status"
                value={updatedDriver.status}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">LicenseNumber</label>
              <input
                type="text"
                name="licensenumber"
                value={updatedDriver.licenseNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                name="phone"
                value={updatedDriver.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={updatedDriver.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Schedule</label>
              <input
                type="text"
                name="workSchedule"
                value={updatedDriver.workSchedule}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Success message */}
          {successMessage && (
            <p className="text-green-600 mt-4 text-center">{successMessage}</p>
          )}

          {/* Modal Footer */}
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
