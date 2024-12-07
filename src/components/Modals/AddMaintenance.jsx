import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";

import toast from "react-hot-toast";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { createMaintenance } from "../../services/apiRequest";

// Hàm định dạng ngày
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Xác thực dữ liệu đầu vào
const validateMaintenanceData = (data) => {
  const errors = {};

  // Vehicle ID validation
  if (!data.vehicleId?.trim()) {
    errors.vehicleId = "Vehicle ID is required";
  }

  // Date validation
  if (!data.date) {
    errors.date = "Date is required";
  }

  // Type validation
  if (!data.type?.trim()) {
    errors.type = "Type is required";
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  // Cost validation
  const cost = Number(data.cost);
  if (!data.cost) {
    errors.cost = "Cost is required";
  } else if (isNaN(cost) || cost < 0) {
    errors.cost = "Cost must be a valid positive number";
  }

  return errors;
};

const AddMaintenanceModal = ({ isOpen, onClose, vehicleId, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [formData, setFormData] = useState({
    vehicleId: vehicleId || "",
    date: formatDate(new Date()), // Giá trị mặc định là ngày hiện tại
    type: "",
    description: "",
    cost: "",
    status: "In Progress",
  });

  const handleInputChange = (field, value) => {
    const formattedValue = field === "date" ? formatDate(value) : value; // Định dạng ngày nếu cần
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

    const errors = validateMaintenanceData({ ...formData, [field]: formattedValue });
    setFieldErrors(errors);
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const errors = validateMaintenanceData(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const maintenanceData = {
        ...formData,
        cost: Number(formData.cost),
        vehicle: { vehicleId: formData.vehicleId },
        date: formatDate(formData.date), // Đảm bảo định dạng ngày trước khi gửi
      };

      await createMaintenance(maintenanceData);
      toast.success("Maintenance record added successfully!");
      onSubmit(maintenanceData);
      handleClose();
    } catch (error) {
      toast.error(error.message || "Failed to save maintenance record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      vehicleId: vehicleId || "",
      date: formatDate(new Date()), // Reset ngày về ngày hiện tại
      type: "",
      description: "",
      cost: "",
      status: "In Progress",
    });
    setFieldErrors({});
    setTouchedFields({});
    onClose();
  };

  const getInputStatus = (field) => {
    if (!touchedFields[field]) return "default";
    return fieldErrors[field] ? "error" : "success";
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add Maintenance Record</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="vehicleId">Vehicle ID</Label>
            <Input
              id="vehicleId"
              value={formData.vehicleId}
              onChange={(e) => handleInputChange("vehicleId", e.target.value)}
              onBlur={() => handleBlur("vehicleId")}
              disabled={!!vehicleId}
              className={`pr-10 ${fieldErrors.vehicleId && touchedFields.vehicleId ? "border-red-500" : ""}`}
            />
            {fieldErrors.vehicleId && touchedFields.vehicleId && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.vehicleId}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              onBlur={() => handleBlur("date")}
              className={`pr-10 ${fieldErrors.date && touchedFields.date ? "border-red-500" : ""}`}
            />
            {fieldErrors.date && touchedFields.date && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.date}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={formData.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              onBlur={() => handleBlur("type")}
              className={`pr-10 ${fieldErrors.type && touchedFields.type ? "border-red-500" : ""}`}
            />
            {fieldErrors.type && touchedFields.type && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.type}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              className={`pr-10 ${fieldErrors.description && touchedFields.description ? "border-red-500" : ""}`}
            />
            {fieldErrors.description && touchedFields.description && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              onBlur={() => handleBlur("cost")}
              className={`pr-10 ${fieldErrors.cost && touchedFields.cost ? "border-red-500" : ""}`}
            />
            {fieldErrors.cost && touchedFields.cost && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.cost}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Maintenance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMaintenanceModal;
