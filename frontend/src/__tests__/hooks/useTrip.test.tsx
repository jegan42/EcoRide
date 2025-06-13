// frontend/src/__tests__/hooks/useTrip.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTrip } from '../../hooks/useTrip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import tripService from '../../services/tripService';
import * as snackbar from '../../utils/enqueueSnackbar';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { TripStatus } from '../../types/trip';
import type { JSX } from 'react';

const theme = createTheme();

vi.mock('../../services/tripService');
vi.mock('../../utils/enqueueSnackbar');

describe('useTrip - onCreateTrip', () => {
  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => <ThemeProvider theme={theme}>{children}</ThemeProvider>;

  const mockTrip = {
    id: '1',
    departureCity: 'Paris',
    arrivalCity: 'Lyon',
    status: 'open' as TripStatus,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    departureDate: '2023-01-10',
    price: 20,
    availableSeats: 3,
    driver: { id: 'u1', username: 'Alice' },
    vehicle: { id: 'v1', brand: 'Renault' },
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch trips and update allTrips on success', async () => {
    (tripService.fetchTrips as jest.Mock).mockResolvedValue({
      data: mockTrip,
      message: 'Liste récupérée',
    });

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      const success = await result.current.fetchTrips({
        departureCity: 'Paris',
      });

      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(tripService.fetchTrips).toHaveBeenCalledWith({
        departureCity: 'Paris',
      });
      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Liste récupérée'
      );
      expect(result.current.allTrips).toEqual(mockTrip);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle error when fetchTrips fails', async () => {
    (tripService.fetchTrips as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      const success = await result.current.fetchTrips({});
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(snackbar.enqueueSnackbarError).toHaveBeenCalled();
      expect(result.current.error).toBe(
        'Erreur lors du chargement des trajets'
      );
      expect(result.current.loading).toBe(false);
    });
  });

  it('should fetchTripById and update trip on success', async () => {
    (tripService.fetchTripById as jest.Mock).mockResolvedValue({
      data: mockTrip,
      message: 'trip récupérée',
    });

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      const success = await result.current.fetchTripById('1');

      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(tripService.fetchTripById).toHaveBeenCalledWith('1');
      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'trip récupérée'
      );
      expect(result.current.selectedTrip).toEqual(mockTrip);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle error when fetchTripById fails', async () => {
    (tripService.fetchTripById as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      const success = await result.current.fetchTripById('2');
      expect(success).toBe(false);
    });

    await waitFor(() => {
      expect(snackbar.enqueueSnackbarError).toHaveBeenCalled();
      expect(result.current.error).toBe('Erreur lors du chargement du trajet');
      expect(result.current.loading).toBe(false);
    });
  });

  it('should fetch trips by driver on mount and update trips', async () => {
    (tripService.fetchTripsByDriver as jest.Mock).mockResolvedValue({
      data: mockTrip,
      message: 'Mes trajets récupérés',
    });

    const { result } = renderHook(() => useTrip(), { wrapper });

    await waitFor(() => {
      expect(tripService.fetchTripsByDriver).toHaveBeenCalled();
      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Mes trajets récupérés'
      );
      expect(result.current.trips).toEqual(mockTrip);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle error when fetchTripsByDriver fails', async () => {
    (tripService.fetchTripsByDriver as jest.Mock).mockRejectedValue(
      new Error('Oops')
    );

    const { result } = renderHook(() => useTrip(), { wrapper });

    await waitFor(() => {
      expect(snackbar.enqueueSnackbarError).toHaveBeenCalled();
      expect(result.current.error).toBe(
        'Vous n’avez encore enregistré aucun voyage.'
      );
      expect(result.current.loading).toBe(false);
    });
  });

  it('should not update state or show snackbar after unmount', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let resolveFetch: any;
    const fetchPromise = new Promise((res) => (resolveFetch = res));
    (tripService.fetchTripsByDriver as jest.Mock).mockReturnValue(fetchPromise);

    const { unmount } = renderHook(() => useTrip(), { wrapper });
    unmount();

    resolveFetch({ data: [{ id: 1 }], message: 'OK' });

    await Promise.resolve();

    expect(snackbar.enqueueSnackbarSuccess).not.toHaveBeenCalled();
    expect(snackbar.enqueueSnackbarError).not.toHaveBeenCalled();
  });

  it('should not update state or show snackbar after unmount with fetchTripsByDriver failed', async () => {
    (tripService.fetchTripsByDriver as jest.Mock).mockRejectedValue(
      new Error('Oops')
    );

    const { unmount } = renderHook(() => useTrip(), { wrapper });
    unmount();

    await Promise.resolve();

    expect(snackbar.enqueueSnackbarSuccess).not.toHaveBeenCalled();
    expect(snackbar.enqueueSnackbarError).not.toHaveBeenCalled();
  });

  it('should create a trip and update state', async () => {
    (tripService.createTrip as jest.Mock).mockResolvedValue({
      data: mockTrip,
      message: 'Trajet créé avec succès',
    });

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      const success = await result.current.onCreateTrip({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        price: 20,
        availableSeats: 3,
      });

      expect(success).toBe(true);
      expect(tripService.createTrip).toHaveBeenCalledWith({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        price: 20,
        availableSeats: 3,
        status: 'open',
      });

      expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
        'Trajet créé avec succès'
      );
    });
    await waitFor(() => {
      expect(result.current.trips).toEqual([mockTrip]);
    });

    expect(result.current.isSubmitting).toBe(false);
  });

  it('handles create error', async () => {
    (tripService.createTrip as jest.Mock).mockRejectedValue('Erreur');

    const { result } = renderHook(() => useTrip());

    await act(async () => {
      const success = await result.current.onCreateTrip({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        price: 20,
        availableSeats: 3,
      });

      expect(success).toBe(false);
    });
    await waitFor(() => {
      expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('Erreur');
    });
    expect(result.current.error).toBe('Erreur lors de la création du trajet');
  });

  it('updates a trip', async () => {
    const initial = { ...mockTrip };
    const updated = { ...mockTrip, departureCity: 'Corolla' };

    (tripService.fetchTripsByDriver as jest.Mock).mockResolvedValue({
      data: [initial],
      message: 'OK',
    });

    (tripService.updateTrip as jest.Mock).mockResolvedValue({
      data: updated,
      message: 'Modifié',
    });

    const { result } = renderHook(() => useTrip());

    await waitFor(() => {
      expect(result.current.trips).toEqual([initial]);
    });

    await act(async () => {
      const success = await result.current.onUpdateTrip(updated.id, updated);
      expect(success).toBe(true);
    });

    expect(result.current.trips[0]).toEqual(updated);
    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith('Modifié');
  });

  it('handles update error', async () => {
    (tripService.updateTrip as jest.Mock).mockRejectedValue('Erreur maj');

    const { result } = renderHook(() => useTrip());

    await act(async () => {
      const success = await result.current.onUpdateTrip('1', mockTrip);
      expect(success).toBe(false);
    });

    expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith('Erreur maj');
  });

  it('only replaces the trip with the correct ID when updating', async () => {
    const oldTrip = { ...mockTrip };
    const anotherTrip = { ...mockTrip, id: 'trip2', departureCity: 'Vert' };
    const updatedTrip = { ...mockTrip, departureCity: 'Noir' };

    (tripService.createTrip as jest.Mock).mockResolvedValueOnce({
      data: oldTrip,
      message: 'Trip 1 créé',
    });
    (tripService.createTrip as jest.Mock).mockResolvedValueOnce({
      data: anotherTrip,
      message: 'Trip 2 créé',
    });
    (tripService.updateTrip as jest.Mock).mockResolvedValue({
      data: updatedTrip,
      message: 'Mise à jour',
    });

    const { result } = renderHook(() => useTrip());

    await act(async () => {
      await result.current.onCreateTrip(oldTrip);
      await result.current.onCreateTrip(anotherTrip);
    });

    await act(async () => {
      const success = await result.current.onUpdateTrip(
        updatedTrip.id,
        updatedTrip
      );
      expect(success).toBe(true);
    });

    expect(result.current.trips).toHaveLength(2);

    const updated = result.current.trips.find((v) => v?.id === '1');
    const untouched = result.current.trips.find((v) => v?.id === 'trip2');

    expect(updated?.departureCity).toBe('Noir');
    expect(untouched?.departureCity).toBe('Vert');
  });

  it('cancel trip', async () => {
    const tripToCancel = { ...mockTrip };
    (tripService.cancelTrip as jest.Mock).mockResolvedValue({
      message: 'Trip annulé avec succès',
    });

    const { result } = renderHook(() => useTrip(), { wrapper });

    await act(async () => {
      await result.current.onCreateTrip(tripToCancel);
    });

    await act(async () => {
      const success = await result.current.onCancelTrip('1');
      expect(success).toBe(true);
    });

    await waitFor(() => {
      expect(result.current.trips).not.toContainEqual(tripToCancel);
    });

    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Trip annulé avec succès'
    );
  });

  it('handles cancel error', async () => {
    (tripService.cancelTrip as jest.Mock).mockRejectedValue(
      'Erreur annulation'
    );

    const { result } = renderHook(() => useTrip());

    await act(async () => {
      const success = await result.current.onCancelTrip('1');
      expect(success).toBe(false);
    });

    expect(snackbar.enqueueSnackbarError).toHaveBeenCalledWith(
      'Erreur annulation'
    );
  });

  it('only replaces the trip with the correct ID when cancelling', async () => {
    const trip1 = { ...mockTrip, id: '1', status: 'open' as TripStatus };
    const trip2 = {
      ...mockTrip,
      id: '2',
      departureCity: 'Nice',
      status: 'open' as TripStatus,
    };
    const cancelledTrip1 = { ...trip1, status: 'cancelled' };

    (tripService.createTrip as jest.Mock).mockResolvedValueOnce({
      data: trip1,
      message: 'Trip 1 créé',
    });

    (tripService.createTrip as jest.Mock).mockResolvedValueOnce({
      data: trip2,
      message: 'Trip 2 créé',
    });

    (tripService.cancelTrip as jest.Mock).mockResolvedValue({
      data: cancelledTrip1,
      message: 'Trajet annulé',
    });

    const { result } = renderHook(() => useTrip());

    await act(async () => {
      await result.current.onCreateTrip(trip1);
      await result.current.onCreateTrip(trip2);
    });

    expect(result.current.trips).toHaveLength(2);

    await act(async () => {
      const success = await result.current.onCancelTrip('1');
      expect(success).toBe(true);
    });

    expect(result.current.trips).toHaveLength(2);

    const cancelled = result.current.trips.find((t) => t?.id === '1');
    const untouched = result.current.trips.find((t) => t?.id === '2');

    expect(cancelled?.status).toBe('cancelled');
    expect(untouched?.status).toBe('open');

    expect(snackbar.enqueueSnackbarSuccess).toHaveBeenCalledWith(
      'Trajet annulé'
    );
  });
});
