import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast, { Toaster } from "react-hot-toast"; // Import toast

const AddVehicleModal = ({ isOpen, onClose }) => {
  const [vehicleID, setVehicleID] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [vehicleType, setVehicleType] = useState(""); // Manual input for Vehicle Type
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [status, setStatus] = useState("");
  const [value, setValue] = useState({
    id:"",
    plateNumber:"",
    vehicleType:"",
    vehicleDetails:"",
    status:"",
  });

  const handleSave = () =>{
    setValue([value]);
  }
  

  // const handleSave = () => {
  //   if (!vehicleID || !plateNumber || !vehicleType || !vehicleDetails || !status) {
  //     toast.error("Please fill all fields."); // Show error toast if validation fails
  //     return;
  //   }

  //   // Success toast when vehicle is created
  //   toast.success("Successfully created a new vehicle");

  //   // Clear inputs after saving
  //   setVehicleID("");
  //   setPlateNumber("");
  //   setVehicleType("");
  //   setVehicleDetails("");
  //   setStatus("");
  //   onClose(); // Close the modal after saving
  // };



  return (
    <>
      {/* Toaster Component for Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40"></div>
        <DialogContent className="w-full max-w-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-h-[90vh] overflow-y-auto bg-white shadow-lg p-6 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold mb-4">Add New Vehicle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Vehicle ID</Label>
              <Input value={vehicleID} onChange={(e) => setVehicleID(e.target.value)} placeholder="Enter vehicle ID" />
            </div>
            <div>
              <Label>Plate number</Label>
              <Input value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} placeholder="Enter plate number" />
            </div>
            <div>
              <Label>Vehicle Type</Label>
              <Input value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} placeholder="Enter vehicle type" /> {/* Manual input */}
            </div>
            <div>
              <Label>Vehicle Details</Label>
              <Input value={vehicleDetails} onChange={(e) => setVehicleDetails(e.target.value)} placeholder="Enter vehicle details" />
            </div>
            <div>
              <Label>Status</Label>
              <Input value={status} onChange={(e) => setStatus(e.target.value)} placeholder="Enter status" />
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Vehicle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddVehicleModal;
