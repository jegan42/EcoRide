// backend/src/services/booking.service.ts
import prismaNewClient from '../lib/prisma';
import { Booking, BookingStatus, Trip, User } from '../../generated/prisma';
import { isId } from '../utils/validation';

export class BookingService {
  static readonly isValidCreateInput = async (
    data: Partial<Booking>
  ): Promise<boolean> => {
    if (!data.seatCount || data.seatCount <= 0) return false;
    if (!data.tripId || !isId(data.tripId)) return false;
    const existingTrip = await prismaNewClient.trip.findUnique({
      where: { id: data.tripId },
    });
    if (!existingTrip) return false;

    return true;
  };

  static readonly create = async (
    user: User,
    trip: Trip,
    seatCount: number
  ): Promise<Booking | string> => {
    return await prismaNewClient.$transaction(async (tx) => {
      const totalPrice = trip.price * seatCount;
      const booking = await tx.booking.create({
        data: {
          userId: user.id,
          tripId: trip.id,
          seatCount,
          totalPrice,
          status: BookingStatus.pending,
        },
      });
      const updatedSeats = trip.availableSeats - seatCount;
      await tx.trip.update({
        where: { id: trip.id },
        data: {
          availableSeats: updatedSeats,
          status: updatedSeats === 0 ? 'full' : 'open',
        },
      });
      await tx.user.update({
        where: { id: user.id },
        data: {
          credits: user.credits - totalPrice,
        },
      });
      return booking;
    });
  };

  static readonly getById = async (
    userId: string,
    bookingId: string
  ): Promise<Booking | string | null> => {
    if (!isId(bookingId)) return 'Invalid booking ID';

    const booking = await prismaNewClient.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) return 'Booking not found';

    const isUserPassenger = booking.userId === userId;
    const isUserDriver = booking.trip.driverId === userId;

    if (!isUserPassenger && !isUserDriver) {
      return 'Access denied';
    }

    return booking;
  };

  static readonly getAllByUserId = async (userId: string) => {
    return prismaNewClient.booking.findMany({
      where: { userId },
      include: { trip: true },
    });
  };

  static readonly getAllByDriverId = async (driverId: string) => {
    return prismaNewClient.booking.findMany({
      where: {
        trip: {
          driverId,
        },
      },
      include: { trip: true },
    });
  };

  static readonly getAllByTripId = async (tripId: string) => {
    return prismaNewClient.booking.findMany({
      where: { tripId },
    });
  };

  static readonly validate = async (
    booking: Booking & { trip: Trip },
    driverId: string,
    action: 'accept' | 'reject'
  ) => {
    return await prismaNewClient.$transaction(async (tx) => {
      let bookingData = {};
      let userToCreditId = '';

      if (action === 'accept') {
        bookingData = { status: BookingStatus.confirmed };
        userToCreditId = driverId;
        const updatedSeats = booking.trip.availableSeats - booking.seatCount;
        await tx.trip.update({
          where: { id: booking.tripId },
          data: {
            availableSeats: updatedSeats,
            status: updatedSeats === 0 ? 'full' : 'open',
          },
        });
      } else if (action === 'reject') {
        bookingData = {
          status: BookingStatus.cancelled,
          cancellerId: driverId,
        };
        userToCreditId = booking.userId;
      }

      await tx.booking.update({
        where: { id: booking.id },
        data: bookingData,
      });
      await tx.user.update({
        where: { id: userToCreditId },
        data: { credits: { increment: booking.totalPrice } },
      });

      return action === 'accept' ? 'Booking accepted' : 'Booking rejected';
    });
  };

  static readonly cancel = async (
    trip: Trip,
    booking: Booking,
    bookingId: string,
    userId: string
  ) => {
    return await prismaNewClient.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.cancelled, cancellerId: userId },
      });

      const updatedSeats = trip.availableSeats + booking.seatCount;

      await tx.trip.update({
        where: { id: booking.tripId },
        data: {
          availableSeats: updatedSeats,
          status: updatedSeats > 0 ? 'open' : 'full',
        },
      });

      const isDriver = userId === trip.driverId;
      const isPending = booking.status === BookingStatus.pending;
      const penalty = isDriver || isPending ? 0 : booking.totalPrice * 0.2;
      const refund = booking.totalPrice - penalty;

      await tx.user.update({
        where: { id: trip.driverId },
        data: { credits: { increment: penalty } },
      });

      await tx.user.update({
        where: { id: booking.userId },
        data: {
          credits: { increment: refund },
        },
      });

      return 'Booking cancelled successfully';
    });
  };
}
