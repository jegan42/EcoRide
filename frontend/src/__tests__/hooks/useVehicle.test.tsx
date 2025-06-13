// frontend/src/__tests__/hooks/useVehicle.test.tsx
import { renderHook, waitFor, act } from '@testing-library/react';
import { useVehicle } from '../../hooks/useVehicle';
import vehicleService from '../../services/vehicleService';
import * as snackbar from '../../utils/enqueueSnackbar';
import { Provider } from 'react-redux';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { setUser } from '../../store/slices/authSlice';
import type { VehicleEnergy } from '../../types/vehicle';
import userService from '../../services/userService';
import type { JSX } from 'react';

const mockDispatch = vi.fn();

vi.mock('../../services/vehicleService');
vi.mock('../../utils/enqueueSnackbar');
vi.mock('../../services/userService');

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();

  if (typeof actual === 'object' && actual !== null) {
    return {
      ...actual,
      useDispatch: () => mockDispatch,
      useSelector: vi.fn(),
    };
  }

  return {
    useDispatch: mockDispatch,
    useSelector: vi.fn(),
  };
});

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
  },
});

const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <Provider store={mockStore}>{children}</Provider>
);

const mockedVehicle = {
  id: 'veh1',
  userId: 'user1',
  brand: 'Toyota',
  model: 'Corolla',
  color: 'Rouge',
  vehicleYear: 2020,
  licensePlate: 'AB-123-CD',
  energy: 'petrol' as VehicleEnergy,
  seatCount: 5,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('useVehicle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetches', () => {
    it('fetches vehicles on mount', async () => {
      const mockVehicles = [{ id: '1', brand: 'Toyota' }];
      (vehicleService.fetchVehicles as jest.Mock).mockResolvedValue({
        data: mockVehicles,
        message: 'Chargement réussi',
      });

      const { result } = renderHook(() => useVehicle(), { wrapper });

      await waitFor(() => {
        expect(result.current.vehicles).toEqual(mockVehicles);
      });

      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Chargement réussi'
      );
    });

    it('handles fetchVehicles error', async () => {
      (vehicleService.fetchVehicles as jest.Mock).mockRejectedValue(
        new Error('fail')
      );

      const { result } = renderHook(() => useVehicle(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBe(
          'Erreur lors du chargement des vehicules'
        );
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalled();
    });
  });

  describe('creates', () => {
    it('creates a vehicle and dispatch user', async () => {
      const newVehicle = { ...mockedVehicle, id: 'veh2' };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValue({
        data: newVehicle,
        message: 'Véhicule créé avec succès',
      });

      (userService.fetchUser as jest.Mock).mockResolvedValue({
        data: { id: 'user1', username: 'John Doe' },
        message: 'Utilisateur récupéré',
      });

      const { result } = renderHook(() => useVehicle(), { wrapper });

      await act(async () => {
        const success = await result.current.onCreateVehicle(newVehicle);
        expect(success).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.vehicles).toContainEqual(newVehicle);
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        setUser({
          user: { id: 'user1', username: 'John Doe' },
        })
      );

      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Véhicule créé avec succès'
      );
    });

    it('handles create error', async () => {
      (vehicleService.createVehicle as jest.Mock).mockRejectedValue('Erreur');

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const success = await result.current.onCreateVehicle(mockedVehicle);
        expect(success).toBe(false);
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('Erreur');
      expect(result.current.error).toBe(
        'Erreur lors de la création du véhicule'
      );
    });
  });

  describe('updates', () => {
    it('updates a vehicle', async () => {
      const updated = { ...mockedVehicle, model: 'Corolla' };

      (vehicleService.updateVehicle as jest.Mock).mockResolvedValue({
        data: updated,
        message: 'Modifié',
      });

      const { result } = renderHook(() => useVehicle());

      act(() => {
        result.current['vehicles'] = [mockedVehicle];
      });

      await act(async () => {
        const success = await result.current.onUpdateVehicle(updated);
        expect(success).toBe(true);
      });

      expect(result.current.vehicle).toEqual(updated);

      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith('Modifié');
    });

    it('handles update error', async () => {
      (vehicleService.updateVehicle as jest.Mock).mockRejectedValue(
        'Erreur maj'
      );

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const success = await result.current.onUpdateVehicle({
          ...mockedVehicle,
          id: 'veh1',
        });
        expect(success).toBe(false);
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('Erreur maj');
    });

    it('only replaces the vehicle with the correct ID when updating', async () => {
      const oldVehicle = { ...mockedVehicle };
      const anotherVehicle = { ...mockedVehicle, id: 'veh2', color: 'Vert' };
      const updatedVehicle = { ...mockedVehicle, color: 'Noir' };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValueOnce({
        data: oldVehicle,
        message: 'Véhicule 1 créé',
      });
      (vehicleService.createVehicle as jest.Mock).mockResolvedValueOnce({
        data: anotherVehicle,
        message: 'Véhicule 2 créé',
      });
      (vehicleService.updateVehicle as jest.Mock).mockResolvedValue({
        data: updatedVehicle,
        message: 'Mise à jour',
      });

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        await result.current.onCreateVehicle(oldVehicle);
        await result.current.onCreateVehicle(anotherVehicle);
      });

      await act(async () => {
        const success = await result.current.onUpdateVehicle(updatedVehicle);
        expect(success).toBe(true);
      });

      expect(result.current.vehicles).toHaveLength(2);

      const updated = result.current.vehicles.find((v) => v?.id === 'veh1');
      const untouched = result.current.vehicles.find((v) => v?.id === 'veh2');

      expect(updated?.color).toBe('Noir');
      expect(untouched?.color).toBe('Vert');
    });

    it('updates the vehicle in the vehicles list correctly', async () => {
      const initialVehicle = { ...mockedVehicle };
      const updatedVehicle = { ...mockedVehicle, color: 'Bleu' };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValue({
        data: initialVehicle,
        message: 'Véhicule créé',
      });

      (vehicleService.updateVehicle as jest.Mock).mockResolvedValue({
        data: updatedVehicle,
        message: 'Véhicule mis à jour',
      });

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const success = await result.current.onCreateVehicle(initialVehicle);
        expect(success).toBe(true);
      });

      await act(async () => {
        const success = await result.current.onUpdateVehicle(updatedVehicle);
        expect(success).toBe(true);
      });

      const foundVehicle = result.current.vehicles.find(
        (v) => v?.id === updatedVehicle.id
      );
      expect(foundVehicle).toEqual(updatedVehicle);
    });
  });

  describe('delete', () => {
    it('removes the correct vehicle from the list on delete', async () => {
      const vehicleToDelete = { ...mockedVehicle };
      (vehicleService.deleteVehicle as jest.Mock).mockResolvedValue({
        message: 'Véhicule supprimé avec succès',
      });

      const { result } = renderHook(() => useVehicle(), { wrapper });

      await act(async () => {
        await result.current.onCreateVehicle(vehicleToDelete);
      });

      await act(async () => {
        const success = await result.current.onDeleteVehicle(vehicleToDelete);
        expect(success).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.vehicles).not.toContainEqual(vehicleToDelete);
      });

      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Véhicule supprimé avec succès'
      );
    });

    it('handles delete error', async () => {
      (vehicleService.deleteVehicle as jest.Mock).mockRejectedValue(
        'Erreur suppression'
      );

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const success = await result.current.onDeleteVehicle({ id: 'veh1' });
        expect(success).toBe(false);
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
        'Erreur suppression'
      );
    });

    it('shows error if vehicle ID is missing on update/delete', async () => {
      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const updateRes = await result.current.onUpdateVehicle({});
        const deleteRes = await result.current.onDeleteVehicle({});
        expect(updateRes).toBe(false);
        expect(deleteRes).toBe(false);
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
        'Le véhicule est invalide.'
      );
    });

    it('removes the correct vehicle from the list on delete', async () => {
      const vehicleToDelete = { ...mockedVehicle, id: 'veh1' };
      const anotherVehicle = { ...mockedVehicle, id: 'veh2', model: 'Yaris' };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValueOnce({
        data: vehicleToDelete,
        message: 'Véhicule ajouté',
      });

      (vehicleService.createVehicle as jest.Mock).mockResolvedValueOnce({
        data: anotherVehicle,
        message: 'Véhicule ajouté',
      });

      (vehicleService.deleteVehicle as jest.Mock).mockResolvedValue({
        data: {},
        message: 'Supprimé avec succès',
      });

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        await result.current.onCreateVehicle(vehicleToDelete);
        await result.current.onCreateVehicle(anotherVehicle);
      });

      expect(result.current.vehicles).toHaveLength(2);

      await act(async () => {
        const success = await result.current.onDeleteVehicle({ id: 'veh1' });
        expect(success).toBe(true);
      });

      expect(result.current.vehicles).toHaveLength(1);
      expect(result.current.vehicles[0]?.id).toBe('veh2');
    });
  });
});
