import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, AlertCircle } from "lucide-react";
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

const validateWarehouseData = (data, isEdit = false) => {
  const errors = {};

  // Warehouse Name validation (not required for edit)
  if (!isEdit) {
    if (!data.warehouseName?.trim()) {
      errors.warehouseName = "Warehouse name is required";
    } else if (data.warehouseName.length > 50) {
      errors.warehouseName = "Warehouse name cannot exceed 50 characters";
    }
  }

  // Location validation
  if (!data.location?.trim()) {
    errors.location = "Location is required";
  } else if (data.location.length > 100) {
    errors.location = "Location cannot exceed 100 characters";
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

export const AddWarehouse = ({ isOpen, onClose, onAdd }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    warehouseName: "",
    location: "",
    capacity: "",
    currentStock: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate all fields whenever any form data changes
  useEffect(() => {
    const errors = validateWarehouseData(formData);
    setFieldErrors(errors);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouchedFields(allTouched);

    const errors = validateWarehouseData(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const warehouseData = {
        ...formData,
        capacity: Number(formData.capacity),
        currentStock: Number(formData.currentStock),
        utilizationRate: Math.round(
          (Number(formData.currentStock) / Number(formData.capacity)) * 100,
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
    setTouchedFields({});
    setIsSubmitting(false);
    onClose();
  };

  const getInputStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return "default";
    return fieldErrors[fieldName] ? "error" : "success";
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
            <div className="space-y-2">
              <Label htmlFor="warehouseName">Warehouse Name</Label>
              <div className="relative">
                <Input
                  id="warehouseName"
                  value={formData.warehouseName}
                  onChange={(e) =>
                    handleInputChange("warehouseName", e.target.value)
                  }
                  onBlur={() => handleBlur("warehouseName")}
                  required
                  className={`pr-10 ${fieldErrors.warehouseName && touchedFields.warehouseName ? "border-red-500" : ""}`}
                />
                {touchedFields.warehouseName && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("warehouseName") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.warehouseName && touchedFields.warehouseName && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {fieldErrors.warehouseName}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  onBlur={() => handleBlur("location")}
                  required
                  className={`pr-10 ${fieldErrors.location && touchedFields.location ? "border-red-500" : ""}`}
                />
                {touchedFields.location && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    {getInputStatus("location") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.location && touchedFields.location && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.location}</AlertDescription>
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
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                    onBlur={() => handleBlur("capacity")}
                    required
                    min="0"
                    className={`pr-10 ${fieldErrors.capacity && touchedFields.capacity ? "border-red-500" : ""}`}
                  />
                  {touchedFields.capacity && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {getInputStatus("capacity") === "error" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.capacity && touchedFields.capacity && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fieldErrors.capacity}</AlertDescription>
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
                    onChange={(e) =>
                      handleInputChange("currentStock", e.target.value)
                    }
                    onBlur={() => handleBlur("currentStock")}
                    required
                    min="0"
                    className={`pr-10 ${fieldErrors.currentStock && touchedFields.currentStock ? "border-red-500" : ""}`}
                  />
                  {touchedFields.currentStock && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      {getInputStatus("currentStock") === "error" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldErrors.currentStock && touchedFields.currentStock && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {fieldErrors.currentStock}
                    </AlertDescription>
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
