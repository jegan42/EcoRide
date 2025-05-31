// frontend/src/services/vehicleService.ts
import api from '../api/axios';
import { API_URL } from '../constants/api';
import type { ApiResponse } from '../types/api';
import type { Vehicle } from '../types/vehicle';
import {
  handleApiResponseBasic,
  handleApiResponseSafe,
} from '../utils/handleApiResponse';

const createVehicle = async (
  vehicleData: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  const response = await api.post(`${API_URL}/vehicles`, vehicleData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Vehicle>(response.data);
};

const fetchVehicles = async (): Promise<ApiResponse<Vehicle[]>> => {
  const response = await api.get(`${API_URL}/vehicles`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Vehicle[]>(response.data);
};

const fetchVehicleById = async (id: string): Promise<ApiResponse<Vehicle>> => {
  const response = await api.get(`${API_URL}/vehicles/${id}`, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Vehicle>(response.data);
};

const updateVehicle = async (
  id: string,
  vehicleData: Partial<Vehicle>
): Promise<ApiResponse<Vehicle>> => {
  const response = await api.put(`${API_URL}/vehicles/${id}`, vehicleData, {
    withCredentials: true,
  });
  return handleApiResponseSafe<Vehicle>(response.data);
};

const deleteVehicle = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`${API_URL}/vehicles/${id}`, {
    withCredentials: true,
  });
  return handleApiResponseBasic<void>(response.data);
};

export default {
  createVehicle,
  fetchVehicles,
  fetchVehicleById,
  updateVehicle,
  deleteVehicle,
};
