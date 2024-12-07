import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";
import toast from "react-hot-toast";

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
      toast.success("Logged in successfully");
      dispatch(loginSuccess(res.data));
      return res.data;
    }
  } catch (err) {
    toast.error("Login failed. Please try again.");
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

      toast.success("Registration successfully");
      dispatch(registerSuccess(res.data));
      navigate("/login");
    }
  } catch (err) {
    toast.error("Registration failed. Please try again.");
    dispatch(registerFailed());
  }
};

export const getAllVehicle = async () => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    throw new Error("No token found. Please log in.");
  }

  try {
    const response = await api.get("vehicle/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching vehicles:",
      error.response ? error.response.data : error.message
    );
    throw error;
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

// api để lấy dữ liệu show lên các bảng
export const totalDrivers  = async () => {
  const response = await api.get(`driver/totalDriver`);
  return response.data;
};

export const totalAvailables  = async () => {
  const response = await api.get(`driver/totalAvailable`);
  return response.data;
};

export const totalOndeliverys  = async () => {
  const response = await api.get(`driver/totalOndelivery`);
  return response.data;
};

export const totalWeeks  = async () => {
  const response = await api.get(`driver/totalWeek`);
  return response.data;
};

export const totalWarehouses  = async () => {
  const response = await api.get(`warehouse/totalWarehouse`);
  return response.data;
};

export const totalLocations = async () => {
  const response = await api.get(`warehouse/totalLocation`);
  return response.data;
};

export const totalOvers = async () => {
  const response = await api.get(`warehouse/totalOver`);
  return response.data;
};

export const totalLesss = async () => {
  const response = await api.get(`warehouse/totalLess`);
  return response.data;
};

export const totalVehicles = async () => {
  const response = await api.get(`vehicle/totalVehicle`);
  return response.data;
};

export const totalProducts = async () => {
  const response = await api.get(`product/totalProduct`);
  return response.data;
};

/// hết 
export const getUserByUsername = async (username) => {
  const response = await api.get(`user/username/${username}`);
  return response.data;
};
export const createWarehouse = async (warehouseDTO) => {
  const response = await api.post("warehouse/add", warehouseDTO);
  return response.data;
};

export const updateWarehouse = async (warehouseId, warehouseData) => {
  const response = await api.put(
    `warehouse/update/${warehouseId}`,
    warehouseData
  );
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

// Expense API endpoints
export const getAllExpenses = async () => {
  try {
    const response = await api.get('expenses');
    return response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

export const getExpenseById = async (expenseId) => {
  try {
    const response = await api.get(`expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
};

export const createExpense = async (expenseDTO) => {
  try {
    // Log dữ liệu đầu vào
    console.log('Original expense data:', expenseDTO);

    const formattedData = {
      description: expenseDTO.description,
      amount: parseFloat(expenseDTO.amount),
      date: expenseDTO.date,
      category: expenseDTO.category.toUpperCase(),
      vehicle: expenseDTO.vehicle ? {
        vehicleId: parseInt(expenseDTO.vehicle)
      } : null,
      driver: expenseDTO.driver ? {
        driverId: parseInt(expenseDTO.driver)
      } : null
    };

    // Log dữ liệu đã format
    console.log('Formatted expense data:', formattedData);

    const response = await api.post('expenses', formattedData);
    return response.data;
  } catch (error) {
    // Log chi tiết lỗi
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.config?.data
    });
    throw error;
  }
};

export const updateExpense = async (expenseId, expenseData) => {
  try {
    const formattedData = {
      description: expenseData.description,
      amount: parseFloat(expenseData.amount),
      date: expenseData.date,
      category: expenseData.category,
      vehicle: expenseData.vehicle ? {
        vehicleId: parseInt(expenseData.vehicle)
      } : null,
      driver: expenseData.driver ? {
        driverId: parseInt(expenseData.driver)
      } : null
    };

    const response = await api.put(`expenses/${expenseId}`, formattedData);
    return response.data;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  try {
    const response = await api.delete(`expenses/${expenseId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const sendNoti = async (data) => {
  const response = await api.post(`notificaitons/send`, data);
  return response.data;
};

export const getNoti = async (username) => {
  const response = await api.get(`notifications/${username}`);
  return response.data;
};

export const getAllNoti = async () => {
  const response = await api.get(`notifications/all`);
  return response.data;
};

export const findSequence = async (formData) => {
  const response = await api.post(`route/find-sequence`, formData);
  return response.data;
};

export const listRouteNoActive = async() => {
  const response = await api.get("route")
  return response.data;
}

export const getUsernameByDriverId = async (driverId) => {
  const response = await api.get(`driver/findUsername/${driverId}`);
  return response.data;
};


export const getDriverNoActive = async () => {
  const response = await api.get(`driver/No-Active`);
  return response.data;
};


export const getVehicleNoActive = async () => {
  const response = await api.get(`vehicle/No-Active`);
  return response.data;
};

export const getWayPoint = async (id) => {
  const response = await api.get(`waypoint/route/${id}`);
  return response.data;
};

export const getInterConnections = async (id) => {
  const response = await api.get(`interconnections/route/${id}`);
  return response.data;
};