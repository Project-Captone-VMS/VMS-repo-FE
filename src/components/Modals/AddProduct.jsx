import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { createProduct } from "../../services/apiRequest";

export const AddProduct = ({ isOpen, onClose, warehouseId }) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState('');
  
    const [formData, setFormData] = useState({
      productName: '',
      price: '',
      quantity: '',
      warehouseId: warehouseId
    });
  
    const validateForm = () => {
      const newErrors = {};
  
      if (!formData.productName?.trim()) {
        newErrors.productName = "Product name is required";
      }
  
      if (!formData.price || formData.price <= 0) {
        newErrors.price = "Price must be greater than 0";
      }
  
      if (!formData.quantity || formData.quantity < 0) {
        newErrors.quantity = "Quantity must be 0 or greater";
      }
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setAlertMessage('');
  
      if (!validateForm()) {
        toast.error("Please fix all errors before submitting");
        return;
      }
  
      setIsSubmitting(true);
  
      try {
        const productData = {
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity)
        };
  
        await createProduct(productData);
        toast.success("Product created successfully!");
        handleClose();
        navigate(`/warehouse/${warehouseId}/products`);
      } catch (error) {
        setAlertMessage(error.message || 'An error occurred while saving the product');
        toast.error(error.message || 'Failed to save product');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleClose = () => {
      setFormData({
        productName: '',
        price: '',
        quantity: '',
        warehouseId: warehouseId
      });
      setErrors({});
      setAlertMessage('');
      onClose();
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
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                className={errors.productName ? "border-red-500" : ""}
              />
              {errors.productName && (
                <p className="text-red-500 text-sm">{errors.productName}</p>
              )}
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min="0"
                  step="0.01"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>
  
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  min="0"
                  className={errors.quantity ? "border-red-500" : ""}
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity}</p>
                )}
              </div>
            </div>
  
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
};