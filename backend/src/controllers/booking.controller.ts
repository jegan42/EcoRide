// backend/src/controllers/booking.controller.ts
import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { BookingStatus, User } from '../../generated/prisma';
import prismaNewClient from '../lib/prisma';
import {
  badRequestResponse,
  conflictResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successCreateResponse,
  successResponse,
} from '../utils/response';

export class BookingController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as User;

      const { tripId, seatCount } = req.body;
      const trip = await prismaNewClient.trip.findUnique({
        where: { id: tripId },
        include: { bookings: true, driver: true },
      });
      if (!trip) {
        notFoundResponse(res, 'Booking', 'trip not found');
        return;
      }
      if (trip.status !== 'open') {
        badRequestResponse(res, 'Booking', 'trip not open');
        return;
      }
      if (seatCount > trip.availableSeats) {
        badRequestResponse(res, 'Booking', 'not enough seats');
        return;
      }
      if (user.id === trip.driverId) {
        forbiddenResponse(res, 'Booking', 'will not booking own trip');
        return;
      }

      const totalPrice = trip.price * seatCount;
      if (user.credits < totalPrice) {
        badRequestResponse(res, 'Booking', 'not enough credits');
        return;
      }

      const existingBooking = await prismaNewClient.booking.findFirst({
        where: {
          tripId,
          userId: user.id,
          status: {
            in: [BookingStatus.pending, BookingStatus.confirmed],
          },
        },
      });

      if (existingBooking) {
        badRequestResponse(res, 'Booking', 'already booked this trip');
        return;
      }

      const booking = await BookingService.create(user, trip, seatCount);

      successCreateResponse(res, 'Booking', 'created', booking);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to create', error);
    }
  };

  static readonly cancel = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const user = req.user as User;

      const booking = await prismaNewClient.booking.findUnique({
        where: { id: id },
        include: { trip: true },
      });

      if (!booking) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }

      const isUserPassenger = booking.userId === user.id;
      const isUserDriver = booking.trip.driverId === user.id;

      if (!isUserPassenger && !isUserDriver) {
        badRequestResponse(res, 'Booking', 'not a passenger or not a driver');
        return;
      }

      if (booking.status === BookingStatus.cancelled) {
        badRequestResponse(res, 'Booking', 'already cancelled');
        return;
      }

      const existingTrip = await prismaNewClient.trip.findUnique({
        where: { id: booking.tripId },
      });
      if (!existingTrip) {
        notFoundResponse(res, 'Booking', 'trip not found');
        return;
      }

      const cancelledBooking = await BookingService.cancel(
        existingTrip.availableSeats,
        id,
        user.id
      );
      successResponse(res, 'Booking', 'cancelled', cancelledBooking);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to cancel', error);
    }
  };

  static readonly getAllByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as User;

      const bookings = await BookingService.getAllByUserId(user.id);

      if (!bookings.length) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }

      successResponse(res, 'Bookings', 'getAllByUser', bookings);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to getAllByUser', error);
    }
  };

  static readonly getAllByDriver = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as User;

      const bookings = await BookingService.getAllByDriverId(user.id);
      if (!bookings.length) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }

      successResponse(res, 'Bookings', 'getAllByDriver', bookings);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to getAllByDriver', error);
    }
  };

  static readonly getAllByTrip = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const bookings = await BookingService.getAllByTripId(id);

      if (!bookings.length) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }
      successResponse(res, 'Bookings', 'getAllByTrip', bookings);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to getAllByTrip', error);
    }
  };

  static readonly validate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { action } = req.body;

      const { id } = req.params;
      const user = req.user as User;

      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
        include: { trip: true },
      });
      if (!booking) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }

      if (booking.trip.driverId !== user.id) {
        forbiddenResponse(res, 'Booking', 'only the driver can validate');
        return;
      }
      if (booking.status !== BookingStatus.pending) {
        conflictResponse(res, 'Booking', 'booking not pending');
        return;
      }
      const validateBookingMsg = await BookingService.validate(
        booking,
        user.id,
        action
      );
      successResponse(res, 'Booking', validateBookingMsg);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to validate', error);
    }
  };

  static readonly getById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = req.user as User;
      const { id } = req.params;

      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
        include: { trip: true },
      });

      if (!booking) {
        notFoundResponse(res, 'Booking', 'booking not found');
        return;
      }

      const isPassenger = booking.userId === user.id;
      const isDriver = booking.trip.driverId === user.id;

      if (!isPassenger && !isDriver) {
        forbiddenResponse(res, 'Booking', 'not a passenger or not a driver');
        return;
      }
      successResponse(res, 'Booking', 'getById', booking);
    } catch (error) {
      errorResponse(res, 'Booking', 'failed to getById', error);
    }
  };
}
