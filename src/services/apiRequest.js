import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8082/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());

  try {
    const res = await api.post("auth/token", user);
    const userRole = res.data.result.roles[0];
    localStorage.setItem("userRole", userRole);
    dispatch(loginSuccess(res.data));
    console.log("userRole");
    console.log(userRole);

    localStorage.setItem("username", user.username);
    if (userRole == "ADMIN") {
      navigate("/dashboard");
    } else if (userRole == "USER") {
      navigate("/driveuser");
    }
  } catch (err) {
    dispatch(loginFailed());
    alert("Login failed. Please check your credentials.");
  }
};

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());

  try {
    const res = await api.post("user/create", user);
    const userRole = res.data.result.roles[0];
    localStorage.setItem("userRole", userRole);
    dispatch(registerSuccess(res.data));
    console.log(res.data);
    alert("ok");
    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};

export const getAllVehicle = async () => {
  const reponse = await api.get("vehicle/all");
  return reponse.data;
};

export const createVehicle = async (vehicleDTO) => {
  const reponse = await api.post("vehicle/add", vehicleDTO);
  return reponse.data;
};

export const updateVehicle = async (vehicleId, vehicleData) => {
  const reponse = await api.put(`vehicle/update/${vehicleId}`, vehicleData);
  return reponse.data;
};

export const deleteVehicle = async (vehicleId) => {
  const reponse = await api.delete(`vehicle/delete/${vehicleId}`);
  return reponse.data;
};

export const getVehicleById = async (vehicleId) => {
  const reponse = await api.get(`vehicle/${vehicleId}`);
  return reponse.data;
};

export const getAllDriver = async () => {
  const reponse = await api.get("driver/all");
  return reponse.data;
};

export const getDriverById = async (driverId) => {
  const reponse = await api.get(`dirver/${driverId}`);
  return reponse.data;
};

export const updateDriver = async (driverId, driverData) => {
  const reponse = await api.put(`driver/update/${driverId}`, driverData);
  return reponse.data;
};

export const deleteDriver = async (driverId) => {
  const reponse = await api.delete(`driver/delete/${driverId}`);
  return reponse.data;
};
