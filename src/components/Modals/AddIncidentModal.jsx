import React, { useState, useEffect } from 'react'
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { addIncident, getAllDrivers, getAllVehicles } from '../../services/apiRequest'
import { AlertCircle, Check, X } from 'lucide-react'
import { Alert, AlertDescription } from "../../components/ui/alert"
import Swal from "sweetalert2"

const validateIncidentData = (data) => {
  const errors = {};

  if (!data.type?.trim()) {
    errors.type = "Incident type is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!data.date) {
    errors.date = "Date is required";
  }

  if (!data.driverId) {
    errors.driverId = "Driver is required";
  }

  if (!data.vehicleId) {
    errors.vehicleId = "Vehicle is required";
  }

  return errors;
};

const AddIncidentModal = ({ isOpen, onClose, onIncidentAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [alertMessage, setAlertMessage] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    date: '',
    driverId: '',
    vehicleId: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          getAllDrivers(),
          getAllVehicles()
        ]);
        setDrivers(Array.isArray(driversData) ? driversData : []);
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAlertMessage('Failed to load drivers and vehicles');
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));

    const errors = validateIncidentData({
      ...formData,
      [field]: value
    });
    setFieldErrors(errors);
  };

  const handleBlur = (field) => {
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const getInputStatus = (fieldName) => {
    if (!touchedFields[fieldName]) return "default";
    return fieldErrors[fieldName] ? "error" : "success";
  };

  const handleClose = () => {
    setFormData({
      type: '',
      description: '',
      date: '',
      driverId: '',
      vehicleId: ''
    });
    setFieldErrors({});
    setTouchedFields({});
    setAlertMessage('');
    onClose();
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setAlertMessage('');
    setIsSubmitting(true);

    const errors = validateIncidentData(formData);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }

    try {
      const incidentToSave = {
        type: formData.type,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        driver: {
          id: Number(formData.driverId)
        },
        vehicle: {
          id: Number(formData.vehicleId)
        }
      };

      await addIncident(incidentToSave);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Incident created successfully!'
      });
      handleClose();
      if (onIncidentAdded) {
        onIncidentAdded();
      }
    } catch (error) {
      console.error('Failed to create incident:', error);
      setAlertMessage(error.response?.data?.message || 'Failed to create incident');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to create incident'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Incident</DialogTitle>
        </DialogHeader>

        {alertMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Incident Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger id="type" className={fieldErrors.type && touchedFields.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCIDENT">Accident</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="VIOLATION">Violation</SelectItem>
              </SelectContent>
            </Select>
            {fieldErrors.type && touchedFields.type && (
              <p className="text-sm text-red-600">{fieldErrors.type}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onBlur={() => handleBlur('description')}
                className={`pr-10 ${fieldErrors.description && touchedFields.description ? 'border-red-500' : ''}`}
              />
              {touchedFields.description && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getInputStatus("description") === "error" ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fieldErrors.description && touchedFields.description && (
              <p className="text-sm text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                onBlur={() => handleBlur('date')}
                className={`pr-10 ${fieldErrors.date && touchedFields.date ? 'border-red-500' : ''}`}
              />
              {touchedFields.date && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {getInputStatus("date") === "error" ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {fieldErrors.date && touchedFields.date && (
              <p className="text-sm text-red-600">{fieldErrors.date}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="driverId">Driver</Label>
            <Select
              value={formData.driverId}
              onValueChange={(value) => handleInputChange('driverId', value)}
            >
              <SelectTrigger id="driverId" className={fieldErrors.driverId && touchedFields.driverId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select driver" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map(driver => (
                  <SelectItem key={driver.id} value={driver.id.toString()}>
                    {`${driver.firstName} ${driver.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.driverId && touchedFields.driverId && (
              <p className="text-sm text-red-600">{fieldErrors.driverId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => handleInputChange('vehicleId', value)}
            >
              <SelectTrigger id="vehicleId" className={fieldErrors.vehicleId && touchedFields.vehicleId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map(vehicle => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {`${vehicle.type} - ${vehicle.licensePlate}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.vehicleId && touchedFields.vehicleId && (
              <p className="text-sm text-red-600">{fieldErrors.vehicleId}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Add Incident'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddIncidentModal;

