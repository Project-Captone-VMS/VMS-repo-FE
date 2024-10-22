import React from 'react';
import { Button } from "@/components/ui/button";

const EditDriverModal = ({ vehicle, onClose, onSave }) => {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Driver</h2>
        <form>
          <label className="block mb-2">
            Vehicle ID
            <input 
              type="text" 
              value={vehicle.id} 
              readOnly 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Plate number
            <input 
              type="text" 
              value={vehicle.plateNumber} 
              readOnly 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Vehicle details
            <input 
              type="text" 
              defaultValue={`${vehicle.model} • ${vehicle.year}`} 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Status
            <input 
              type="text" 
              defaultValue={vehicle.status} 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Location
            <input 
              type="text" 
              defaultValue={vehicle.location} 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block mb-2">
            Next maintenance
            <input 
              type="text" 
              defaultValue={vehicle.nextMaintenance} 
              className="border border-gray-300 rounded p-2 w-full"
            />
          </label>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button variant="primary" onClick={onSave}>
              Save Vehicle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDriverModal;
