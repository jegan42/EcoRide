// frontend/src/__tests__/services/tripService.test.tsx
import tripService from '../../services/tripService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('tripService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetchTrips calls api.get without filter', async () => {
    const mockTrips = [{ id: '1' }, { id: '2' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getAllTrips successful',
        data: mockTrips,
      },
    });

    const result = await tripService.fetchTrips();

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/trips$/), {
      withCredentials: true,
      params: {},
    });
    expect(result.message).toBe('getAllTrips successful');
    expect(result.data).toEqual(mockTrips);
  });

  it('fetchTrips calls api.get with filters', async () => {
    const filters = {
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      date: '2025-06-01',
      flexible: true,
    };
    const mockTrips = [{ id: 'filtered-trip' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getTripWithFilters successful',
        data: mockTrips,
      },
    });

    const result = await tripService.fetchTrips(filters);

    expect(api.get).toHaveBeenCalledWith(expect.stringMatching(/\/trips$/), {
      withCredentials: true,
      params: filters,
    });
    expect(result.message).toBe('getTripWithFilters successful');
    expect(result.data).toEqual(mockTrips);
  });

  it('fetchTripById calls api.get with an id', async () => {
    const mockTrip = { id: 't1' };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getTripById successful',
        data: mockTrip,
      },
    });

    const result = await tripService.fetchTripById('t1');

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/trips\/t1$/),
      { withCredentials: true }
    );
    expect(result.message).toBe('getTripById successful');
    expect(result.data).toEqual(mockTrip);
  });

  it('fetchTripByDriver calls api.get', async () => {
    const mockTrip = { id: 't1' };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getTripByDriver successful',
        data: mockTrip,
      },
    });

    const result = await tripService.fetchTripsByDriver();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/trips\/driver$/),
      { withCredentials: true }
    );
    expect(result.message).toBe('getTripByDriver successful');
    expect(result.data).toEqual(mockTrip);
  });

  it('createTrip calls api.post with the trip data', async () => {
    const tripData = { departureCity: 'Paris' };
    const mockCreatedTrip = { id: 'new-trip', ...tripData };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'createTrip successful',
        data: mockCreatedTrip,
      },
    });

    const result = await tripService.createTrip(tripData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/trips$/),
      tripData,
      { withCredentials: true }
    );
    expect(result.message).toBe('createTrip successful');
    expect(result.data).toEqual(mockCreatedTrip);
  });

  it('updateTrip calls api.put with trip id and data', async () => {
    const tripId = 't2';
    const updateData = { arrivalCity: 'Nice' };
    const updatedTrip = { id: tripId, ...updateData };
    (api.put as jest.Mock).mockResolvedValue({
      data: {
        message: 'updateTrip successful',
        data: updatedTrip,
      },
    });

    const result = await tripService.updateTrip(tripId, updateData);

    expect(api.put).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trips/${tripId}$`)),
      updateData,
      { withCredentials: true }
    );
    expect(result.message).toBe('updateTrip successful');
    expect(result.data).toEqual(updatedTrip);
  });

  it('cancelTrip calls api.delete with the trip id', async () => {
    const tripId = 'cancel-me';
    const cancelledTrip = { id: tripId, status: 'cancelled' };
    (api.delete as jest.Mock).mockResolvedValue({
      data: {
        message: 'cancelTrip successful',
        data: cancelledTrip,
      },
    });

    const result = await tripService.cancelTrip(tripId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trips/${tripId}$`)),
      { withCredentials: true }
    );
    expect(result.message).toBe('cancelTrip successful');
    expect(result.data).toEqual(cancelledTrip);
  });
});
