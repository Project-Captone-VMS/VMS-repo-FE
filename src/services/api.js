import axios from "axios";

const api = axios.create({
    baseURL:'http://localhost:8080/',
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