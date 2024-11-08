import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { updateWarehouse } from "../../services/apiRequest";

const EditWarehouse = ({ isOpen, onClose, onSubmit, warehouse }) => {
    const [formData, setFormData] = useState({
        warehouseId: 0,
        location: '',
        capacity: 0,
        currentStock: 0,
    });
  
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Initialize form data when warehouse data changes
    useEffect(() => {
        if (warehouse) {
            setFormData({
                warehouseId: warehouse.warehouseId ?? 0,
                location: warehouse.location ?? '',
                capacity: warehouse.capacity ?? 0,
                currentStock: warehouse.currentStock ?? 0,
            });
        }
    }, [warehouse]);
  
    // Validate form fields
    const validateForm = () => {
        const newErrors = {};

        if (!formData.location.trim()) {
            newErrors.location = "Location is required";
        }

        const capacity = parseInt(formData.capacity, 10);
        const currentStock = parseInt(formData.currentStock, 10);

        if (isNaN(capacity) || capacity <= 0) {
            newErrors.capacity = "Capacity must be a positive number";
        }

        if (isNaN(currentStock) || currentStock < 0) {
            newErrors.currentStock = "Current stock must be zero or a positive number";
        }

        if (currentStock > capacity) {
            newErrors.currentStock = "Current stock cannot exceed capacity";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Prepare the data to send
            const warehouseData = {
                warehouseId: formData.warehouseId,
                location: formData.location.trim(),
                capacity: parseInt(formData.capacity, 10),
                currentStock: parseInt(formData.currentStock, 10),
            };

            console.log('Submitting warehouse data:', warehouseData);

            // Call updateWarehouse API and wait for response
            const response = await updateWarehouse(warehouseData.warehouseId, warehouseData);

            if (response) {
                console.log('Update response:', response);
                onSubmit && onSubmit(response);  // Trigger any parent onSubmit action
                onClose();  // Close modal on successful update
            } else {
                throw new Error("Failed to update warehouse. No response from server.");
            }
        } catch (error) {
            console.error('Error updating warehouse:', error);

            // Display more specific error messages based on the type of error
            if (error.response) {
                setErrors({
                    submit: `Server error: ${error.response.data?.message || error.response.statusText || 'Unknown error'}`,
                });
            } else if (error.request) {
                setErrors({
                    submit: "Network error: Could not reach the server. Please check your connection.",
                });
            } else {
                setErrors({
                    submit: `Error: ${error.message || 'Unknown error occurred'}`,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };
  
    // Update form field values and clear related errors
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };
  
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto z-50 border border-gray-200">
                <DialogHeader>
                    <DialogTitle>Edit Warehouse</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.submit && (
                        <Alert variant="destructive">
                            <AlertDescription>{errors.submit}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="warehouseId">Warehouse ID</Label>
                        <Input
                            id="warehouseId"
                            value={formData.warehouseId}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.location}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => handleInputChange('capacity', e.target.value)}
                            min="0"
                            className={errors.capacity ? 'border-red-500' : ''}
                        />
                        {errors.capacity && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.capacity}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currentStock">Current Stock</Label>
                        <Input
                            id="currentStock"
                            type="number"
                            value={formData.currentStock}
                            onChange={(e) => handleInputChange('currentStock', e.target.value)}
                            min="0"
                            className={errors.currentStock ? 'border-red-500' : ''}
                        />
                        {errors.currentStock && (
                            <Alert variant="destructive">
                                <AlertDescription>{errors.currentStock}</AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Warehouse'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditWarehouse;