// frontend/src/__tests__/services/bookingService.test.tsx
import bookingService from '../../services/bookingService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('bookingService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createBooking appelle api.post avec les données', async () => {
    const bookingData = { tripId: 't1', userId: 'u1' };
    const mockBooking = { id: 'b1', ...bookingData };
    (api.post as jest.Mock).mockResolvedValue({ data: mockBooking });

    const result = await bookingService.createBooking(bookingData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings$/),
      bookingData,
      { withCredentials: true }
    );
    expect(result).toEqual(mockBooking);
  });

  it('cancelBooking appelle api.delete avec id', async () => {
    const bookingId = 'b2';
    const mockResponse = { id: bookingId, status: 'cancelled' };
    (api.delete as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await bookingService.cancelBooking(bookingId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/b2$/),
      { withCredentials: true }
    );

    expect(result).toEqual(mockResponse);
  });

  it('fetchBookings appelle api.get pour utilisateur', async () => {
    const mockBookings = [{ id: 'b3' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockBookings });

    const result = await bookingService.fetchBookings();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/me$/),
      { withCredentials: true }
    );
    expect(result).toEqual(mockBookings);
  });

  it('fetchBookingsByDriver appelle api.get pour conducteur', async () => {
    const mockBookings = [{ id: 'b4' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockBookings });

    const result = await bookingService.fetchBookingsByDriver();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/driver$/),
      { withCredentials: true }
    );
    expect(result).toEqual(mockBookings);
  });

  it('fetchBookingsByTrip appelle api.get avec trip id', async () => {
    const tripId = 't2';
    const mockBookings = [{ id: 'b5' }];
    (api.get as jest.Mock).mockResolvedValue({ data: mockBookings });

    const result = await bookingService.fetchBookingsByTrip(tripId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/trip/${tripId}$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(mockBookings);
  });

  it('validateBooking appelle api.post pour valider une réservation', async () => {
    const bookingId = 'b6';
    const mockResponse = [{ id: bookingId, status: 'validated' }];
    (api.post as jest.Mock).mockResolvedValue({ data: mockResponse });

    const result = await bookingService.validateBooking(bookingId);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/${bookingId}/validate$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetchBookingById appelle api.get avec id', async () => {
    const bookingId = 'b7';
    const mockBooking = { id: bookingId };
    (api.get as jest.Mock).mockResolvedValue({ data: mockBooking });

    const result = await bookingService.fetchBookingById(bookingId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/${bookingId}$`)),
      { withCredentials: true }
    );
    expect(result).toEqual(mockBooking);
  });
});
