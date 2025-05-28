// src/services/vehicleService.ts
import axios from 'axios';
import type { Vehicle } from '../types/vehicle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const createVehicle = async (
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await axios.post(`${API_URL}/vehicles`, vehicleData, {
    withCredentials: true,
  });
  return response.data;
};

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await axios.get(`${API_URL}/vehicles`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await axios.get(`${API_URL}/vehicles/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateVehicle = async (
  id: string,
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await axios.put(`${API_URL}/vehicles/${id}`, vehicleData, {
    withCredentials: true,
  });
  return response.data;
};

const deleteVehicle = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/vehicles/${id}`, {
    withCredentials: true,
  });
};

export default {
  createVehicle,
  fetchVehicles,
  fetchVehicleById,
  updateVehicle,
  deleteVehicle,
};
