// frontend/src/__tests__/services/tripService.test.tsx
import tripService from '../../services/tripService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('tripService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetchTrips appelle api.get sans filtre', async () => {
    const mockTrips = [{ id: '1' }, { id: '2' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockTrips });

    const result = await tripService.fetchTrips();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/trips$/), {
      withCredentials: true,
      params: {},
    });
    expect(result).toEqual(mockTrips);
  });

  it('fetchTrips appelle api.get avec filtres', async () => {
    const filters = {
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      date: '2025-06-01',
      flexible: true,
    };
    const mockTrips = [{ id: 'filtered-trip' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockTrips });

    const result = await tripService.fetchTrips(filters);

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/trips$/), {
      withCredentials: true,
      params: filters,
    });
    expect(result).toEqual(mockTrips);
  });

  it('fetchTripById appelle api.get avec un id', async () => {
    const mockTrip = { id: 't1' };
    (api.get as jest.Mock).mockResolvedValue({ data: mockTrip });

    const result = await tripService.fetchTripById('t1');

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/trips\/t1$/),
      { withCredentials: true }
    );
    expect(result).toEqual(mockTrip);
  });

  it('createTrip appelle api.post avec les données du trajet', async () => {
    const tripData = { departureCity: 'Paris' };
    const mockCreatedTrip = { id: 'new-trip', ...tripData };
    (api.post as jest.Mock).mockResolvedValue({ data: mockCreatedTrip });

    const result = await tripService.createTrip(tripData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/trips$/),
      tripData,
      { withCredentials: true }
    );
    expect(result).toEqual(mockCreatedTrip);
  });

  it('updateTrip appelle api.put avec id et données du trajet', async () => {
    const tripId = 't2';
    const updateData = { arrivalCity: 'Nice' };
    const updatedTrip = { id: tripId, ...updateData };
    (api.put as jest.Mock).mockResolvedValue({ data: updatedTrip });

    const result = await tripService.updateTrip(tripId, updateData);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trips/${tripId}$`)),
      updateData,
      { withCredentials: true }
    );
    expect(result).toEqual(updatedTrip);
  });

  it("cancelTrip appelle api.delete avec l'id du trajet", async () => {
    const tripId = 'cancel-me';
    const cancelledTrip = { id: tripId, status: 'cancelled' };
    (api.delete as jest.Mock).mockResolvedValue({ data: cancelledTrip });

    const result = await tripService.cancelTrip(tripId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trips/${tripId}$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(cancelledTrip);
  });
});
