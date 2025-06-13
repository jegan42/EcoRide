// frontend/src/hooks/useVehicle.ts
import { useEffect, useState } from 'react';
import { setUser } from '../store/slices/authSlice';
import vehicleService from '../services/vehicleService';
import {
  enqueueSnackbarError,
  enqueueSnackbarSuccess,
} from '../utils/enqueueSnackbar';
import type { VehicleFormOutput } from '../validations/vehicleSchema';
import type { Vehicle } from '../types/vehicle';
import userService from '../services/userService';
import { useDispatch } from 'react-redux';

export const useVehicle = (): {
  vehicles: Partial<Vehicle[]>;
  vehicle: Partial<Vehicle> | undefined;
  loading: boolean;
  error: string | null;
  isSubmitting: boolean;
  onCreateVehicle: (data: VehicleFormOutput) => Promise<boolean>;
  onUpdateVehicle: (formData: VehicleFormOutput) => Promise<boolean>;
  onDeleteVehicle: (formData: VehicleFormOutput) => Promise<boolean>;
} => {
  const dispatch = useDispatch();
  const [vehicle, setVehicle] = useState<Partial<Vehicle> | undefined>(
    undefined
  );
  const [vehicles, setVehicles] = useState<Partial<Vehicle[]>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVehicles = async (): Promise<void> => {
      setLoading(true);
      try {
        const { data, message } = await vehicleService.fetchVehicles();
        setVehicles(data);
        enqueueSnackbarSuccess(message);
      } catch (error) {
        enqueueSnackbarError(error);
        setError('Erreur lors du chargement des vehicules');
      } finally {
        setLoading(false);
      }
    };

    void fetchVehicles();
  }, []);

  const onCreateVehicle = async (data: VehicleFormOutput): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { data: newVehicle, message: vehicleMessage } =
        await vehicleService.createVehicle(data);
      setVehicle(newVehicle);
      setVehicles((prev) => [...prev, newVehicle]);
      enqueueSnackbarSuccess(vehicleMessage);
      const { data: user, message: userMessage } =
        await userService.fetchUser();
      dispatch(setUser({ user }));
      enqueueSnackbarSuccess(userMessage);
      return true;
    } catch (err) {
      enqueueSnackbarError(err);
      setError('Erreur lors de la création du véhicule');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateVehicle = async (
    formData: VehicleFormOutput
  ): Promise<boolean> => {
    if (!formData.id) {
      enqueueSnackbarError('Le véhicule est invalide.');
      return false;
    }
    setIsSubmitting(true);
    try {
      const { message, data: updatedVehicle } =
        await vehicleService.updateVehicle(formData.id, formData);
      setVehicle(updatedVehicle);
      setVehicles((prev) =>
        prev.map((v) => (v?.id === updatedVehicle.id ? updatedVehicle : v))
      );
      enqueueSnackbarSuccess(message);
      return true;
    } catch (error) {
      enqueueSnackbarError(error);
      setError('Erreur lors de la mise à jour du véhicule');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteVehicle = async (
    formData: VehicleFormOutput
  ): Promise<boolean> => {
    if (!formData.id) {
      enqueueSnackbarError('Le véhicule est invalide.');
      return false;
    }
    setIsSubmitting(true);
    try {
      const { message, data: _ } = await vehicleService.deleteVehicle(
        formData.id
      );
      setVehicles((prev) => prev.filter((v) => v?.id !== formData.id));
      enqueueSnackbarSuccess(message);
      return true;
    } catch (error) {
      enqueueSnackbarError(error);
      setError('Erreur lors de la suppression du véhicule');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    vehicles,
    vehicle,
    loading,
    error,
    isSubmitting,
    onCreateVehicle,
    onUpdateVehicle,
    onDeleteVehicle,
  };
};
