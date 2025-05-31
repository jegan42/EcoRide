// backend/tests/services/booking.service.test.ts
import { BookingService } from '../../services/booking.service';
import prismaNewClient from '../../lib/prisma';
import { BookingStatus } from '../../../generated/prisma';

jest.mock('../../lib/prisma', () => ({
  $transaction: jest.fn(),
}));

describe('BookingService.create', () => {
  const mockUser = {
    id: 'user-123',
    credits: 100,
  };

  const mockTrip = {
    id: 'trip-456',
    price: 10,
    availableSeats: 5,
  };

  const seatCount = 2;
  const expectedTotalPrice = mockTrip.price * seatCount;

  const mockBookingResult = {
    id: 'booking-789',
    userId: mockUser.id,
    tripId: mockTrip.id,
    seatCount,
    totalPrice: expectedTotalPrice,
    status: BookingStatus.pending,
  };

  it('should create booking, update trip and user credits in a transaction', async () => {
    const createMock = jest.fn().mockResolvedValue(mockBookingResult);
    const updateTripMock = jest.fn();
    const updateUserMock = jest.fn();

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          booking: { create: createMock },
          trip: { update: updateTripMock },
          user: { update: updateUserMock },
        })
    );

    const result = await BookingService.create(
      mockUser as any,
      mockTrip as any,
      seatCount
    );

    expect(createMock).toHaveBeenCalledWith({
      data: {
        userId: mockUser.id,
        tripId: mockTrip.id,
        seatCount,
        totalPrice: expectedTotalPrice,
        status: BookingStatus.pending,
      },
    });

    expect(updateTripMock).toHaveBeenCalledWith({
      where: { id: mockTrip.id },
      data: {
        availableSeats: mockTrip.availableSeats - seatCount,
        status: 'open',
      },
    });

    expect(updateUserMock).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: {
        credits: mockUser.credits - expectedTotalPrice,
      },
    });

    expect(result).toEqual(mockBookingResult);
  });

  it('should set trip status to full when no seats left', async () => {
    const fullTrip = { ...mockTrip, availableSeats: 2 };
    const fullSeatCount = 2;
    const createMock = jest.fn().mockResolvedValue(mockBookingResult);
    const updateTripMock = jest.fn();
    const updateUserMock = jest.fn();

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          booking: { create: createMock },
          trip: { update: updateTripMock },
          user: { update: updateUserMock },
        })
    );

    await BookingService.create(
      mockUser as any,
      fullTrip as any,
      fullSeatCount
    );

    expect(updateTripMock).toHaveBeenCalledWith({
      where: { id: fullTrip.id },
      data: {
        availableSeats: 0,
        status: 'full',
      },
    });
  });
});

describe('BookingService.validate', () => {
  const txUpdateTrip = jest.fn();
  const txUpdateUser = jest.fn();
  const txUpdateBooking = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set trip status to full when validating and no seats left', async () => {
    const booking = {
      id: 'booking-1',
      tripId: 'trip-1',
      userId: 'user-1',
      seatCount: 2,
      totalPrice: 50,
      trip: {
        id: 'trip-1',
        availableSeats: 2,
      },
    };

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          trip: { update: txUpdateTrip },
          user: { update: txUpdateUser },
          booking: { update: txUpdateBooking },
        })
    );

    const result = await BookingService.validate(
      booking as any,
      'driver-1',
      'accept'
    );

    expect(txUpdateTrip).toHaveBeenCalledWith({
      where: { id: booking.tripId },
      data: {
        availableSeats: 0,
        status: 'full',
      },
    });

    expect(result).toBe('Booking accepted');
  });
});

describe('BookingService.cancel', () => {
  const txUpdateTrip = jest.fn().mockResolvedValue({
    id: 'trip-1',
    availableSeats: 2,
    driverId: 'driver-1',
  });
  const txUpdateUser = jest.fn();
  const txUpdateBooking = jest.fn().mockResolvedValue({
    id: 'booking-1',
    userId: 'user-1',
    tripId: 'trip-1',
    seatCount: 1,
    totalPrice: 20,
    status: BookingStatus.cancelled,
    cancellerId: 'user-1',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set trip status to open when booking is cancelled', async () => {
    const trip = {
      id: 'trip-1',
      availableSeats: 1,
      driverId: 'driver-1',
    };

    const booking = {
      id: 'booking-1',
      userId: 'user-1',
      tripId: 'trip-1',
      seatCount: 1,
      totalPrice: 20,
      status: BookingStatus.confirmed,
    };

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          booking: { update: txUpdateBooking },
          trip: { update: txUpdateTrip },
          user: { update: txUpdateUser },
        })
    );

    const result = await BookingService.cancel(
      trip.availableSeats,
      booking.id,
      booking.userId
    );

    expect(txUpdateTrip).toHaveBeenCalledWith({
      where: { id: trip.id },
      data: {
        availableSeats: 2,
        status: 'open',
      },
    });

    expect(result).toHaveProperty('status', 'cancelled');
  });
});

describe('BookingService.validate', () => {
  const txUpdateTrip = jest.fn();
  const txUpdateUser = jest.fn();
  const txUpdateBooking = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set trip status to full when accepted booking fills last seat', async () => {
    const booking = {
      id: 'booking-1',
      tripId: 'trip-1',
      userId: 'user-1',
      seatCount: 2,
      totalPrice: 50,
      trip: {
        id: 'trip-1',
        availableSeats: 2,
      },
    };

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          trip: { update: txUpdateTrip },
          user: { update: txUpdateUser },
          booking: { update: txUpdateBooking },
        })
    );

    const result = await BookingService.validate(
      booking as any,
      'driver-1',
      'accept'
    );

    expect(txUpdateTrip).toHaveBeenCalledWith({
      where: { id: booking.tripId },
      data: {
        availableSeats: 0,
        status: 'full',
      },
    });

    expect(result).toBe('Booking accepted');
  });

  it('should set trip status to open when seats remain after accepting', async () => {
    const booking = {
      id: 'booking-1',
      tripId: 'trip-1',
      userId: 'user-1',
      seatCount: 1,
      totalPrice: 25,
      trip: {
        id: 'trip-1',
        availableSeats: 3,
      },
    };

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          trip: { update: txUpdateTrip },
          user: { update: txUpdateUser },
          booking: { update: txUpdateBooking },
        })
    );

    const result = await BookingService.validate(
      booking as any,
      'driver-1',
      'accept'
    );

    expect(txUpdateTrip).toHaveBeenCalledWith({
      where: { id: booking.tripId },
      data: {
        availableSeats: 2,
        status: 'open',
      },
    });

    expect(result).toBe('Booking accepted');
  });
});

describe('BookingService.cancel', () => {
  const txUpdateTrip = jest.fn().mockResolvedValue({
    id: 'trip-1',
    availableSeats: 2,
    driverId: 'driver-1',
  });
  const txUpdateUser = jest.fn();
  const txUpdateBooking = jest.fn().mockResolvedValue({
    id: 'booking-1',
    userId: 'user-1',
    tripId: 'trip-1',
    seatCount: 1,
    totalPrice: 30,
    status: BookingStatus.cancelled,
    cancellerId: 'user-1',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set trip status to open after cancellation when seats increase', async () => {
    const trip = {
      id: 'trip-1',
      availableSeats: 1,
      driverId: 'driver-1',
    };

    const booking = {
      id: 'booking-1',
      userId: 'user-1',
      tripId: 'trip-1',
      seatCount: 1,
      totalPrice: 30,
      status: BookingStatus.confirmed,
    };

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(
      async (callback: any) =>
        await callback({
          trip: { update: txUpdateTrip },
          user: { update: txUpdateUser },
          booking: { update: txUpdateBooking },
        })
    );

    const result = await BookingService.cancel(
      trip.availableSeats,
      booking.id,
      booking.userId
    );

    expect(txUpdateTrip).toHaveBeenCalledWith({
      where: { id: booking.tripId },
      data: {
        availableSeats: 2,
        status: 'open',
      },
    });

    expect(result).toHaveProperty('status', 'cancelled');
  });
});

describe('BookingService.cancel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set trip status to "open" when seats are available after cancellation', async () => {
    const trip = { id: 'trip1', driverId: 'driver1', availableSeats: 2 };
    const booking = {
      id: 'booking1',
      userId: 'user1',
      tripId: 'trip1',
      seatCount: 1,
      status: 'confirmed',
      totalPrice: 100,
    };

    const tripUpdate = jest.fn().mockResolvedValue({
      id: 'trip1',
      driverId: 'driver1',
      availableSeats: 3,
    });
    const bookingUpdate = jest.fn().mockResolvedValue({
      id: 'booking1',
      userId: 'user1',
      tripId: 'trip1',
      seatCount: 1,
      status: 'cancelled',
      totalPrice: 100,
      cancellerId: 'user1',
    });
    const userUpdate = jest.fn();

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(async (cb) =>
      cb({
        booking: { update: bookingUpdate },
        trip: { update: tripUpdate },
        user: { update: userUpdate },
      })
    );

    await BookingService.cancel(trip.availableSeats, booking.id, 'user1');

    expect(tripUpdate).toHaveBeenCalledWith({
      where: { id: 'trip1' },
      data: {
        availableSeats: 3,
        status: 'open',
      },
    });
  });

  it('should set trip status to "full" when updatedSeats is 0 after cancellation', async () => {
    const trip = { id: 'trip1', driverId: 'driver1', availableSeats: 0 };
    const booking = {
      id: 'booking1',
      userId: 'user1',
      tripId: 'trip1',
      seatCount: 0,
      status: 'confirmed',
      totalPrice: 100,
    };

    const tripUpdate = jest.fn().mockResolvedValue({
      id: 'trip1',
      driverId: 'driver1',
      availableSeats: 0,
      status: 'full',
    });
    const bookingUpdate = jest.fn().mockResolvedValue({
      id: 'booking1',
      userId: 'user1',
      tripId: 'trip1',
      seatCount: 0,
      status: 'cancelled',
      totalPrice: 100,
      cancellerId: 'user1',
    });
    const userUpdate = jest.fn();

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(async (cb) =>
      cb({
        booking: { update: bookingUpdate },
        trip: { update: tripUpdate },
        user: { update: userUpdate },
      })
    );

    await BookingService.cancel(trip.availableSeats, booking.id, 'user1');

    expect(tripUpdate).toHaveBeenCalledWith({
      where: { id: 'trip1' },
      data: {
        availableSeats: 0,
        status: 'full',
      },
    });
  });

  it('should apply a 1% penalty when a confirmed booking is cancelled by the user (not driver)', async () => {
    const trip = {
      id: 'trip-1',
      availableSeats: 2,
      driverId: 'driver-1',
    };

    const booking = {
      id: 'booking-1',
      userId: 'user-1',
      tripId: 'trip-1',
      seatCount: 1,
      totalPrice: 100,
      status: BookingStatus.confirmed,
    };

    const bookingUpdateMock = jest.fn().mockResolvedValue(booking);
    const tripUpdateMock = jest.fn().mockResolvedValue(trip);
    const userUpdateMock = jest.fn();

    (prismaNewClient.$transaction as jest.Mock).mockImplementation(async (cb) =>
      cb({
        booking: { update: bookingUpdateMock },
        trip: { update: tripUpdateMock },
        user: { update: userUpdateMock },
      })
    );

    await BookingService.cancel(
      trip.availableSeats,
      booking.id,
      booking.userId
    );

    expect(userUpdateMock).toHaveBeenCalledWith({
      where: { id: trip.driverId },
      data: { credits: { increment: 1 } },
    });

    expect(userUpdateMock).toHaveBeenCalledWith({
      where: { id: booking.userId },
      data: { credits: { increment: 99 } },
    });
  });

  it('should return 0 or 0.2 for getPenalty', () => {
    const penalty = BookingService.getPenalty(true, true);
    expect(penalty).toBe(0);
    const penalty2 = BookingService.getPenalty(false, false);
    expect(penalty2).toBe(0.01);
  });
});
