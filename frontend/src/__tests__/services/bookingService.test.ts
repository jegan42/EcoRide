// frontend/src/__tests__/services/bookingService.test.tsx
import bookingService from '../../services/bookingService';
import api from '../../api/axios';
import { vi } from 'vitest';

vi.mock('../../api/axios');

describe('bookingService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('createBooking calls api.post with the data', async () => {
    const bookingData = { tripId: 't1', userId: 'u1' };
    const mockBooking = { id: 'b1', ...bookingData };
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'createBooking successful',
        data: mockBooking,
      },
    });

    const result = await bookingService.createBooking(bookingData);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings$/),
      bookingData,
      { withCredentials: true }
    );
    expect(result.message).toBe('createBooking successful');
    expect(result.data).toEqual(mockBooking);
  });

  it('cancelBooking call api.delete with id', async () => {
    const bookingId = 'b2';
    const mockResponse = { id: bookingId, status: 'cancelled' };
    (api.delete as jest.Mock).mockResolvedValue({
      data: {
        message: 'cancelBooking successful',
        data: mockResponse,
      },
    });

    const result = await bookingService.cancelBooking(bookingId);

    expect(api.delete).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/b2$/),
      { withCredentials: true }
    );

    expect(result.message).toBe('cancelBooking successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('fetchBookings call api.get for user', async () => {
    const mockBookings = [{ id: 'b3' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getBooking successful',
        data: mockBookings,
      },
    });

    const result = await bookingService.fetchBookings();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/me$/),
      { withCredentials: true }
    );
    expect(result.message).toBe('getBooking successful');
    expect(result.data).toEqual(mockBookings);
  });

  it('fetchBookingsByDriver call api.get for driver', async () => {
    const mockBookings = [{ id: 'b4' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getBookingsByDriver successful',
        data: mockBookings,
      },
    });

    const result = await bookingService.fetchBookingsByDriver();

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(/\/bookings\/driver$/),
      { withCredentials: true }
    );
    expect(result.message).toBe('getBookingsByDriver successful');
    expect(result.data).toEqual(mockBookings);
  });

  it('fetchBookingsByTrip call api.get with trip id', async () => {
    const tripId = 't2';
    const mockBookings = [{ id: 'b5' }];
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getBookingsByTrip successful',
        data: mockBookings,
      },
    });

    const result = await bookingService.fetchBookingsByTrip(tripId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/trip/${tripId}$`)),
      { withCredentials: true }
    );
    expect(result.message).toBe('getBookingsByTrip successful');
    expect(result.data).toEqual(mockBookings);
  });

  it('validateBooking call api.post for validate booking', async () => {
    const bookingId = 'b6';
    const mockResponse = [{ id: bookingId, status: 'validated' }];
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        message: 'validateBooking successful',
        data: mockResponse,
      },
    });

    const result = await bookingService.validateBooking(bookingId);

    expect(api.post).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/${bookingId}/validate$`)),
      { withCredentials: true }
    );
    expect(result.message).toBe('validateBooking successful');
    expect(result.data).toEqual(mockResponse);
  });

  it('fetchBookingById call api.get with id', async () => {
    const bookingId = 'b7';
    const mockBooking = { id: bookingId };
    (api.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'getBookingById successful',
        data: mockBooking,
      },
    });

    const result = await bookingService.fetchBookingById(bookingId);

    expect(api.get).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/bookings/${bookingId}$`)),
      { withCredentials: true }
    );
    expect(result.message).toBe('getBookingById successful');
    expect(result.data).toEqual(mockBooking);
  });
});
