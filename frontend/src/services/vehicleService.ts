// frontend/src/services/vehicleService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { Vehicle } from '../types/vehicle';

const createVehicle = async (
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await api.post(`${API_URL}/vehicles`, vehicleData, {
    withCredentials: true,
  });
  return response.data;
};

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get(`${API_URL}/vehicles`, {
    withCredentials: true,
  });
  return response.data;
};

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get(`${API_URL}/vehicles/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

const updateVehicle = async (
  id: string,
  vehicleData: Partial<Vehicle>
): Promise<Vehicle> => {
  const response = await api.put(`${API_URL}/vehicles/${id}`, vehicleData, {
    withCredentials: true,
  });
  return response.data;
};

const deleteVehicle = async (id: string): Promise<void> => {
  await api.delete(`${API_URL}/vehicles/${id}`, {
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
