import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Check, X, AlertCircle } from "lucide-react";

const validateWarehouseData = (data, existingWarehouses) => {
  const errors = {};

  // Check for duplicate name or location
  const isDuplicate = existingWarehouses?.some(
    (warehouse) =>
      warehouse.warehouseName.toLowerCase() === data.warehouseName.trim().toLowerCase() ||
      warehouse.location.toLowerCase() === data.location.trim().toLowerCase()
  );
  if (isDuplicate) {
    errors.duplicate = "A warehouse with the same name or location already exists";
  }

   // Warehouse Name validation
   if (!data.warehouseName?.trim()) {
    errors.warehouseName = "Warehouse name is required";
  } else if (data.warehouseName.length > 50) {
    errors.warehouseName = "Warehouse name cannot exceed 50 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(data.warehouseName)) {
    errors.warehouseName = "Warehouse name cannot contain special characters or numbers";
  }

  // Location validation
  if (!data.location?.trim()) {
    errors.location = "Location is required";
  } else if (data.location.length > 100) {
    errors.location = "Location cannot exceed 100 characters";
  } else if (!/^[a-zA-Z0-9\s]+$/.test(data.location)) {
    errors.location = "Location cannot contain special characters";
  }

  // Capacity validation
  const capacity = Number(data.capacity);
  if (!data.capacity) {
    errors.capacity = "Capacity is required";
  } else if (isNaN(capacity)) {
    errors.capacity = "Capacity must be a valid number";
  } else if (capacity <= 0) {
    errors.capacity = "Capacity must be greater than 0";
  } else if (capacity > 1000000) {
    errors.capacity = "Capacity cannot exceed 1,000,000";
  }

  // Current Stock validation
  const currentStock = Number(data.currentStock);
  if (data.currentStock === "") {
    errors.currentStock = "Current stock is required";
  } else if (isNaN(currentStock)) {
    errors.currentStock = "Current stock must be a valid number";
  } else if (currentStock < 0) {
    errors.currentStock = "Current stock cannot be negative";
  } else if (currentStock > capacity) {
    errors.currentStock = "Current stock cannot exceed warehouse capacity";
  }

  return errors;
};

const AddWarehouse = ({ isOpen, onClose, onAdd, existingWarehouses = [] }) => {
  const [formData, setFormData] = useState({
    warehouseName: "",
    location: "",
    capacity: "",
    currentStock: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateWarehouseData(formData, existingWarehouses);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.duplicate) {
        toast.error(errors.duplicate);
      } else {
        toast.error("Please fix all errors before submitting");
      }
      setIsSubmitting(false);
      return;
    }

    try {
      const warehouseData = {
        ...formData,
        capacity: Number(formData.capacity),
        currentStock: Number(formData.currentStock),
        utilizationRate: Math.round(
          (Number(formData.currentStock) / Number(formData.capacity)) * 100
        ),
      };

      await onAdd(warehouseData);
      toast.success("Warehouse added successfully!");
      handleCancel();
    } catch (error) {
      toast.error("Failed to create warehouse");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      warehouseName: "",
      location: "",
      capacity: "",
      currentStock: "",
    });
    setFieldErrors({});
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      <Toaster position="top-right" />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fieldErrors.duplicate && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.duplicate}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="warehouseName">Warehouse Name</Label>
              <Input
                id="warehouseName"
                value={formData.warehouseName}
                onChange={(e) => handleInputChange("warehouseName", e.target.value)}
                className={fieldErrors.warehouseName ? "border-red-500" : ""}
              />
              {fieldErrors.warehouseName && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.warehouseName}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={fieldErrors.location ? "border-red-500" : ""}
              />
              {fieldErrors.location && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.location}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  className={fieldErrors.capacity ? "border-red-500" : ""}
                />
                {fieldErrors.capacity && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fieldErrors.capacity}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={(e) => handleInputChange("currentStock", e.target.value)}
                  className={fieldErrors.currentStock ? "border-red-500" : ""}
                />
                {fieldErrors.currentStock && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fieldErrors.currentStock}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Warehouse"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddWarehouse;
