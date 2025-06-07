// frontend/src/__tests__/hooks/useVehicle.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { useVehicle } from '../../hooks/useVehicle';
import vehicleService from '../../services/vehicleService';
import * as snackbar from '../../utils/enqueueSnackbar';
import type { VehicleEnergy } from '../../types/vehicle';
import { vi } from 'vitest';

vi.mock('../../services/vehicleService');
vi.mock('../../utils/enqueueSnackbar');

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

describe('useVehicle hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches vehicles on mount', async () => {
    (vehicleService.fetchVehicles as jest.Mock).mockResolvedValue({
      data: [mockedVehicle],
      message: 'Liste chargée',
    });

    const { result } = renderHook(() => useVehicle());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual([mockedVehicle]);
    expect(result.current.loading).toBe(false);
    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Liste chargée'
    );
  });

  it('handles fetchVehicles error', async () => {
    (vehicleService.fetchVehicles as jest.Mock).mockRejectedValue('API error');

    const { result } = renderHook(() => useVehicle());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(
      'Erreur lors du chargement des vehicules'
    );
    expect(snackbar.enqueueSnackbarError).toHaveBeenCalled();
    expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('API error');
  });

  it('creates a vehicle', async () => {
    (vehicleService.createVehicle as jest.Mock).mockResolvedValue({
      data: mockedVehicle,
      message: 'Créé avec succès',
    });

    const { result } = renderHook(() => useVehicle());

    await act(async () => {
      const success = await result.current.onCreateVehicle(mockedVehicle);
      expect(success).toBe(true);
    });

    expect(result.current.vehicle).toEqual(mockedVehicle);
    expect(result.current.vehicles).toContainEqual(mockedVehicle);
    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Créé avec succès'
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
    expect(result.current.error).toBe('Erreur lors de la création du véhicule');
  });

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
    (vehicleService.updateVehicle as jest.Mock).mockRejectedValue('Erreur maj');

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

  it('deletes a vehicle', async () => {
    (vehicleService.deleteVehicle as jest.Mock).mockResolvedValue({
      data: {},
      message: 'Supprimé',
    });

    const { result } = renderHook(() => useVehicle());

    act(() => {
      result.current['vehicles'] = [mockedVehicle];
    });

    await act(async () => {
      const success = await result.current.onDeleteVehicle(mockedVehicle);
      expect(success).toBe(true);
    });

    expect(result.current.vehicles).toEqual([]);
    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith('Supprimé');
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

  describe('useVehicle additionnal', () => {
    it('replaces the updated vehicle in the list', async () => {
      const initialVehicle = { ...mockedVehicle };
      const updatedVehicle = {
        ...mockedVehicle,
        color: 'Vert',
        model: 'Yaris',
      };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValue({
        data: initialVehicle,
        message: 'Véhicule ajouté',
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

      expect(result.current.vehicles).toHaveLength(1);
      expect(result.current.vehicles[0]?.color).toBe('Rouge');

      await act(async () => {
        const success = await result.current.onUpdateVehicle(updatedVehicle);
        expect(success).toBe(true);
      });

      expect(result.current.vehicles).toHaveLength(1);
      expect(result.current.vehicles[0]).toEqual(updatedVehicle);
      expect(result.current.vehicles[0]?.color).toBe('Vert');
      expect(result.current.vehicles[0]?.model).toBe('Yaris');
    });

    it('handles error in update with real Error object', async () => {
      (vehicleService.updateVehicle as jest.Mock).mockRejectedValue(
        new Error('Erreur critique')
      );

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const success = await result.current.onUpdateVehicle({
          ...mockedVehicle,
          id: 'veh1',
        });
        expect(success).toBe(false);
      });

      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it('replaces the correct vehicle in the list using map (ternary)', async () => {
      const initialVehicle = { ...mockedVehicle };
      const updatedVehicle = { ...mockedVehicle, color: 'Bleu' };

      (vehicleService.createVehicle as jest.Mock).mockResolvedValue({
        data: initialVehicle,
        message: 'Véhicule créé',
      });

      (vehicleService.updateVehicle as jest.Mock).mockResolvedValue({
        data: updatedVehicle,
        message: 'Mise à jour réussie',
      });

      const { result } = renderHook(() => useVehicle());

      await act(async () => {
        const created = await result.current.onCreateVehicle(initialVehicle);
        expect(created).toBe(true);
      });

      expect(result.current.vehicles).toHaveLength(1);
      expect(result.current.vehicles[0]?.color).toBe('Rouge');

      await act(async () => {
        const updated = await result.current.onUpdateVehicle(updatedVehicle);
        expect(updated).toBe(true);
      });

      expect(result.current.vehicles).toHaveLength(1);
      expect(result.current.vehicles[0]?.color).toBe('Bleu');
      expect(result.current.vehicles[0]).toEqual(updatedVehicle);
    });
  });
});
