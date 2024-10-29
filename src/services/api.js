import axios from "axios";

const api = axios.create({
    baseURL:'http://localhost:8082/',
    headers: {
        'Content-Type': 'application/json',
    },
});


export const getAllVehicle = async()=>{
    const reponse = await api.get("vehicle/all");
    return reponse.data;
}

export const createVehicle = async(vehicleDTO)=>{
    const reponse = await api.post("vehicle/add",vehicleDTO);
    return reponse.data;
}

export const updateVehicle = async(vehicleId,vehicleData)=>{
    const reponse = await api.put(`vehicle/update/${vehicleId}`,vehicleData)
    return reponse.data;
}

export const deleteVehicle = async(vehicleId) =>{
    const reponse = await api.delete(`vehicle/delete/${vehicleId}`);
    return reponse.data;
}

export const getVehicleById = async(vehicleId) =>{
    const reponse = await api.get(`vehicle/${vehicleId}`);
    return reponse.data;
}


export const getAllDriver = async() =>{
    const reponse = await api.get("driver/all");
    return reponse.data;
}

export const getDriverById = async(driverId) =>{
    const reponse = await api.get(`dirver/${driverId}`);
    return reponse.data;
}

export const updateDriver = async(driverId,driverData) =>{
    const reponse = await api.put(`driver/update/${driverId}`,driverData);
    return reponse.data;
}

export const deleteDriver = async(driverId) =>{
    const reponse = await api.delete(`driver/delete/${driverId}`);
    return reponse.data;
}