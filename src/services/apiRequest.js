import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());
  try {
    const res = await api.post("auth/token", user);
    if (res.status === 200) {
      const userRole = res.data.result.roles[0];
      const token = res.data.result.token;

      localStorage.setItem("userRole", userRole);
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("username", user.username);

      if (userRole === "ADMIN") {
        navigate("/dashboard");
      } else if (userRole === "USER") {
        navigate("/driveuser");
      }
      Swal.fire("Success!", "Logged in successfully!", "success");
      dispatch(loginSuccess(res.data));
      return res.data;
    }
  } catch (err) {
    Swal.fire("Error!", "Login failed. Please try again.", "error");
    dispatch(loginFailed());
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());

  try {
    const res = await api.post("user/create", user);
    if (res.status === 200) {
      const userRole = res.data.result.roles[0];

      localStorage.setItem("userRole", userRole);

      Swal.fire("Success!", "Registration successfully!", "success");
      dispatch(registerSuccess(res.data));
      navigate("/login");
    }
  } catch (err) {
    Swal.fire("Error!", "Registration failed. Please try again.", "error");
    dispatch(registerFailed());
  }
};

export const getAllVehicles = async () => {
  try {
    const response = await api.get("vehicle/all");
    return response.data.result || response.data;
  } catch (error) {
    console.error(
      "Error fetching vehicles:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const createVehicle = async (vehicleDTO) => {
  const response = await api.post("vehicle/add", vehicleDTO);
  return response.data;
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  const response = await api.put(`vehicle/update/${vehicleId}`, vehicleData);
  return response.data;
};

export const deleteVehicle = async (vehicleId) => {
  const response = await api.delete(`vehicle/delete/${vehicleId}`);
  return response.data;
};

export const getVehicleById = async (vehicleId) => {
  const response = await api.get(`vehicle/${vehicleId}`);
  return response.data;
};

export const getAllDrivers = async () => {
  try {
    const response = await api.get("driver/all");
    return response.data.result || response.data;
  } catch (error) {
    console.error(
      "Error fetching drivers:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getDriverById = async (driverId) => {
  const response = await api.get(`driver/${driverId}`);
  return response.data;
};

export const updateDriver = async (driverId, driverData) => {
  const response = await api.put(`driver/update/${driverId}`, driverData);
  return response.data;
};

export const deleteDriver = async (driverId) => {
  const response = await api.delete(`driver/delete/${driverId}`);
  return response.data;
};

export const getUserByUsername = async (username) => {
  const response = await api.get(`user/username/${username}`);
  return response.data;
};
export const createWarehouse = async (warehouseDTO) => {
  const response = await api.post("warehouse/add", warehouseDTO);
  return response.data;
};

export const updateWarehouse = async (warehouseId, warehouseData) => {
  const response = await api.put(`warehouse/update/${warehouseId}`, warehouseData);
  return response.data;
};

export const deleteWarehouse = async (warehouseId) => {
  const response = await api.delete(`warehouse/delete/${warehouseId}`);
  return response.data;
};
export const getAllWarehouses = async () => {
  const response = await api.get("warehouse/all");
  return response.data;
};
export const createProduct = async (productDTO) => {
  const response = await api.post("product/add", productDTO);
  return response.data;
};

export const updateProduct = async (productId, productData) => {
  const response = await api.put(`product/update/${productId}`, productData);
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`product/delete/${productId}`);
  return response.data;
};

export const getAllProducts = async (warehouseId) => {
  const response = await api.get(`product/all/${warehouseId}`);
  return response.data;
};
export const getWarehouseById = async (warehouseId) => {
  try {
    const response = await api.get(`warehouse/${warehouseId}`); 
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API gọi để lấy danh sách hóa đơn
export const getAllInvoices = async (warehouseId) => {
  const response = await api.get(`invoices/${warehouseId}`);
  return response.data;
};

// API gọi để tạo mới hóa đơn
export const createInvoice = async (warehouseId, invoice) => {
  const response = await api.post(`invoices/${warehouseId}`, invoice);
  return response.data;
};

// API gọi để xóa hóa đơn
export const deleteInvoice = async (invoiceId) => {
  const response = await api.delete(`invoices/${invoiceId}`);
  return response.data;
};
// API gọi Incidents
export const getAllIncidents = async () => {
  try {
    const response = await api.get('incidents');
    return response.data;
  } catch (error) {
    console.error('Error fetching incidents:', error);
    throw error;
  }
};

export const getIncidentById = async (id) => {
  try {
    const response = await api.get(`incidents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addIncident = async (incidentData) => {
  try {
    const response = await api.post('incidents', incidentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateIncident = async (id, updatedIncident) => {
  try {
    if (!id) {
      throw new Error('Incident ID is required');
    }
    const response = await api.put(`incidents/${id}`, updatedIncident);
    return response.data;
  } catch (error) {
    console.error('Error updating incident:', error);
    throw error;
  }
};

export const deleteIncident = async (id) => {
  try {
    const response = await api.delete(`incidents/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIncidentsByType = async (type) => {
  try {
    const response = await api.get(`incidents/type/${type}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIncidentsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get(`incidents/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIncidentsByDriver = async (driverId) => {
  try {
    const response = await api.get(`incidents/driver/${driverId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getIncidentsByVehicle = async (vehicleId) => {
  try {
    const response = await api.get(`incidents/vehicle/${vehicleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Maintenance API endpoints
export const getAllMaintenance = async (vehicleId) => {
  const response = await api.get(`maintenance/all/${vehicleId}`);
  return response.data;
};

export const getMaintenanceById = async (maintenanceId) => {
  const response = await api.get(`maintenance/${maintenanceId}`);
  return response.data;
};

export const createMaintenance = async (maintenanceDTO) => {
  const response = await api.post('maintenance/add', maintenanceDTO);
  return response.data;
};

export const updateMaintenance = async (maintenanceId, maintenanceData) => {
  const response = await api.put(`maintenance/update/${maintenanceId}`, maintenanceData);
  return response.data;
};

export const deleteMaintenance = async (maintenanceId) => {
  const response = await api.delete(`maintenance/delete/${maintenanceId}`);
  return response.data;
};