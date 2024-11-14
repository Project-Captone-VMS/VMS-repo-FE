import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Check, X, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { createWarehouse } from "../../services/apiRequest";


export const AddWarehouse = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    warehouseName: '',
    location: '',
    capacity: '',
    currentStock: ''
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.warehouseName?.trim()) {
      newErrors.warehouseName = "Warehouse name is required";
    }

    if (!formData.location?.trim()) {
      newErrors.location = "Location is required";
    }

    if (formData.capacity === '') {
      newErrors.capacity = "Capacity is required";
    } else if (formData.capacity < 0) {
      newErrors.capacity = "Capacity must be greater than or equal to 0";
    }

    if (formData.currentStock === '') {
      newErrors.currentStock = "Current stock is required";
    } else if (formData.currentStock < 0) {
      newErrors.currentStock = "Current stock must be greater than or equal to 0";
    }

    if (Number(formData.currentStock) > Number(formData.capacity)) {
      newErrors.currentStock = "Current stock cannot exceed warehouse capacity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouchedFields(allTouched);
    
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      const warehouseData = {
        ...formData,
        capacity: Number(formData.capacity),
        currentStock: Number(formData.currentStock),
        utilizationRate: Math.round((Number(formData.currentStock) / Number(formData.capacity)) * 100)
      };
      
      await createWarehouse(warehouseData);
      toast.success("Warehouse created successfully!");
      navigate("/warehouse");
    } catch (error) {
      toast.error("Failed to create warehouse");
    }
  };

  const handleCancel = () => {
    setFormData({
      warehouseName: '',
      location: '',
      capacity: '',
      currentStock: ''
    });
    setErrors({});
    setTouchedFields({});
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const getInputStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return "default";
    return errors[fieldName] ? "error" : "success";
  };

  return (
    <>
      <Toaster position="top-right" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-50 border border-gray-200">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseName">Warehouse Name</Label>
              <div className="relative">
                <Input
                  id="warehouseName"
                  value={formData.warehouseName}
                  onChange={(e) => handleInputChange('warehouseName', e.target.value)}
                  required
                  className={`pr-10 ${errors.warehouseName && touchedFields.warehouseName ? 'border-red-500' : ''}`}
                />
                {touchedFields.warehouseName && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getInputStatus("warehouseName") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.warehouseName && touchedFields.warehouseName && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.warehouseName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                  className={`pr-10 ${errors.location && touchedFields.location ? 'border-red-500' : ''}`}
                />
                {touchedFields.location && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getInputStatus("location") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.location && touchedFields.location && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.location}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <div className="relative">
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                    required
                    min="0"
                    className={`pr-10 ${errors.capacity && touchedFields.capacity ? 'border-red-500' : ''}`}
                  />
                  {touchedFields.capacity && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {getInputStatus("capacity") === "error" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.capacity && touchedFields.capacity && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.capacity}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <div className="relative">
                  <Input
                    id="currentStock"
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => handleInputChange('currentStock', e.target.value)}
                    required
                    min="0"
                    className={`pr-10 ${errors.currentStock && touchedFields.currentStock ? 'border-red-500' : ''}`}
                  />
                  {touchedFields.currentStock && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {getInputStatus("currentStock") === "error" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {errors.currentStock && touchedFields.currentStock && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.currentStock}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                Add Warehouse
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
  
  export default AddWarehouse;