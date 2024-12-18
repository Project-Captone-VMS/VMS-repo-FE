import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import toast from "react-hot-toast";
import { createExpense } from "../../services/apiRequest";

const validateExpenseData = (data) => {
  const errors = {};

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  const amount = Number(data.amount);
  if (!data.amount) {
    errors.amount = "Amount is required";
  } else if (isNaN(amount) || amount <= 0) {
    errors.amount = "Amount must be a positive number";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.category) {
    errors.category = "Category is required";
  }

  if (!data.vehicle) {
    errors.vehicle = "Vehicle ID is required";
  }

  if (!data.driver) {
    errors.driver = "Driver ID is required";
  }

  return errors;
};

const AddExpense = ({ isOpen, onClose, onExpenseAdded }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
    vehicle: "",
    driver: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    const errors = validateExpenseData({
      ...formData,
      [field]: value,
    });
    setFieldErrors(errors);
  };

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setIsSubmitting(true);

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouchedFields(allTouched);

    const errors = validateExpenseData(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        vehicle: { vehicleId: parseInt(formData.vehicle) },
        driver: { driverId: parseInt(formData.driver) },
      };
      await createExpense(expenseData);
      toast.success("Expense added successfully!");
      onExpenseAdded(expenseData);
      handleClose();
    } catch (error) {
      setAlertMessage(
        error.message || "An error occurred while saving the expense",
      );
      toast.error(error.message || "Failed to save expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: "",
      amount: "",
      date: "",
      category: "",
      vehicle: "",
      driver: "",
    });
    setFieldErrors({});
    setTouchedFields({});
    setAlertMessage("");
    onClose();
  };

  const getInputStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return "default";
    return fieldErrors[fieldName] ? "error" : "success";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-full w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        {alertMessage && (
          <Alert variant="destructive">
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              onBlur={() => handleBlur("description")}
              className={
                fieldErrors.description && touchedFields.description
                  ? "border-red-500"
                  : ""
              }
            />
            {fieldErrors.description && touchedFields.description && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              onBlur={() => handleBlur("amount")}
              className={
                fieldErrors.amount && touchedFields.amount
                  ? "border-red-500"
                  : ""
              }
            />
            {fieldErrors.amount && touchedFields.amount && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.amount}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              onBlur={() => handleBlur("date")}
              className={
                fieldErrors.date && touchedFields.date ? "border-red-500" : ""
              }
            />
            {fieldErrors.date && touchedFields.date && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.date}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              onBlur={() => handleBlur("category")}
              className={
                fieldErrors.category && touchedFields.category
                  ? "border-red-500"
                  : ""
              }
            />
            {fieldErrors.category && touchedFields.category && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.category}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle ID *</Label>
            <Input
              id="vehicle"
              value={formData.vehicle}
              onChange={(e) => handleInputChange("vehicle", e.target.value)}
              onBlur={() => handleBlur("vehicle")}
              className={
                fieldErrors.vehicle && touchedFields.vehicle
                  ? "border-red-500"
                  : ""
              }
            />
            {fieldErrors.vehicle && touchedFields.vehicle && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.vehicle}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driver">Driver ID *</Label>
            <Input
              id="driver"
              value={formData.driver}
              onChange={(e) => handleInputChange("driver", e.target.value)}
              onBlur={() => handleBlur("driver")}
              className={
                fieldErrors.driver && touchedFields.driver
                  ? "border-red-500"
                  : ""
              }
            />
            {fieldErrors.driver && touchedFields.driver && (
              <Alert variant="destructive">
                <AlertDescription>{fieldErrors.driver}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpense;
