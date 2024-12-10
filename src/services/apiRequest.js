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

export const getAllDriver = async () => {
  const response = await api.get("driver/all");
  return response.data;
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

export const listRouteNoActive = async () => {
  const response = await api.get("route");
  return response.data;
};

export const getUsernameByDriverId = async (driverId) => {
  const response = await api.get(`driver/findUsername/${driverId}`);
  return response.data;
};

export const getDriverNoActive = async () => {
  const response = await api.get(`driver/No-Active`);
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

export const getVehicleNoActive = async () => {
  const response = await api.get(`vehicle/No-Active`);
  return response.data;
};

export const updateEstimateTime = async (id, formData) => {
  const response = await api.put(
    `interconnections/timeEstimate/${id}`,
    formData
  );
  return response.data;
};

export const updateActualTime = async (id, formData) => {
  const response = await api.put(`interconnections/timeActual/${id}`, formData);
  return response.data;
};

export const getRouteByUserName = async (username) => {
  const response = await api.get(`route/user/${username}`);
  return response.data;
};

export const getRouteById = async (id) => {
  const response = await api.get(`route/${id}`);
  return response.data;
};

export const updateRoute = async (id) =>{
  const response = await api.put(`route/update/${id}`);
  return response.data;
}