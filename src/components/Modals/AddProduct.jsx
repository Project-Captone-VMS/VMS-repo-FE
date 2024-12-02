import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X, AlertCircle } from "lucide-react";
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
import { createProduct } from "../../services/apiRequest";

const validateProductData = (data) => {
  const errors = {};

  if (!data.productName?.trim()) {
    errors.productName = "Product name is required";
  } else if (data.productName.length > 100) {
    errors.productName = "Product name cannot exceed 100 characters";
  }

  const price = Number(data.price);
  if (!data.price) {
    errors.price = "Price is required";
  } else if (isNaN(price)) {
    errors.price = "Price must be a valid number";
  } else if (price <= 0) {
    errors.price = "Price must be greater than 0";
  } else if (price > 1000000) {
    errors.price = "Price cannot exceed 1,000,000";
  }

  const quantity = Number(data.quantity);
  if (data.quantity === "") {
    errors.quantity = "Quantity is required";
  } else if (isNaN(quantity)) {
    errors.quantity = "Quantity must be a valid number";
  } else if (quantity < 0) {
    errors.quantity = "Quantity cannot be negative";
  } else if (quantity > 1000000) {
    errors.quantity = "Quantity cannot exceed 1,000,000";
  }

  return errors;
};

export const AddProduct = ({ isOpen, onClose, warehouseId, onSubmit }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [alertMessage, setAlertMessage] = useState("");

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    quantity: "",
    warehouse: {
      warehouseId: warehouseId,
    },
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate on change
    const errors = validateProductData({
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

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouchedFields(allTouched);

    const errors = validateProductData(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all errors before submitting");
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      };
      await createProduct(productData);
      toast.success("Product created successfully!");
      onSubmit(productData);
      handleClose();
    } catch (error) {
      setAlertMessage(
        error.message || "An error occurred while saving the product"
      );
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      productName: "",
      price: "",
      quantity: "",
      warehouse: {
        warehouseId: warehouseId,
      },
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
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-full overflow-y-auto z-50 border border-gray-200">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        {alertMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <div className="relative">
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
                onBlur={() => handleBlur("productName")}
                className={`pr-10 ${
                  fieldErrors.productName && touchedFields.productName
                    ? "border-red-500"
                    : ""
                }`}
              />
              {touchedFields.productName && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getInputStatus("productName") === "error" ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fieldErrors.productName && touchedFields.productName && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fieldErrors.productName}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  onBlur={() => handleBlur("price")}
                  min="0"
                  step="0.01"
                  className={`pr-10 ${
                    fieldErrors.price && touchedFields.price
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {touchedFields.price && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getInputStatus("price") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.price && touchedFields.price && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.price}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="relative">
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", e.target.value)
                  }
                  onBlur={() => handleBlur("quantity")}
                  min="0"
                  className={`pr-10 ${
                    fieldErrors.quantity && touchedFields.quantity
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {touchedFields.quantity && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {getInputStatus("quantity") === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                )}
              </div>
              {fieldErrors.quantity && touchedFields.quantity && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{fieldErrors.quantity}</AlertDescription>
                </Alert>
              )}
            </div>
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
              {isSubmitting ? "Saving..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddProduct;
