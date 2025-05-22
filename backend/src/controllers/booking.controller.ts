// backend/src/controllers/booking.controller.ts
import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { requireUser } from '../utils/request';
import { BookingStatus } from '../../generated/prisma';
import prismaNewClient from '../lib/prisma';
import { isId } from '../utils/validation';
import { sendJsonResponse } from '../utils/response';

export class BookingController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      if (!(await BookingService.isValidCreateInput(req.body))) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'Invalid or missing fields'
        );
        return;
      }

      const { tripId, seatCount } = req.body;
      const trip = await prismaNewClient.trip.findUnique({
        where: { id: tripId },
        include: { bookings: true, driver: true },
      });
      if (!trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Trip not found');
        return;
      }
      if (trip.status !== 'open') {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Trip not available');
        return;
      }
      if (seatCount > trip.availableSeats) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'Not enough seats available'
        );
        return;
      }
      if (user.id === trip.driverId) {
        sendJsonResponse(
          res,
          'FORBIDDEN',
          'Booking',
          'Will not booking own trip'
        );
        return;
      }

      const totalPrice = trip.price * seatCount;
      if (user.credits < totalPrice) {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Not enough credits');
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
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'User already booked this trip'
        );
        return;
      }

      const booking = await BookingService.create(user, trip, seatCount);

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Booking',
        'Created',
        'booking',
        booking
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'Failed to create',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly cancel = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookingId = req.params.id;

    if (!isId(bookingId)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Invalid booking ID');
      return;
    }

    const booking = await prismaNewClient.booking.findUnique({
      where: { id: bookingId },
      include: { trip: true },
    });

    if (!booking) {
      sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Booking not found');
      return;
    }

    const isUserPassenger = booking.userId === user.id;
    const isUserDriver = booking.trip.driverId === user.id;

    if (!isUserPassenger && !isUserDriver) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Booking',
        'Not a passenger or not a driver'
      );
      return;
    }

    if (booking.status === BookingStatus.cancelled) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Already cancelled');
      return;
    }

    const existingTrip = await prismaNewClient.trip.findUnique({
      where: { id: booking.tripId },
    });
    if (!existingTrip) {
      sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Trip does not exist');
      return;
    }

    const resultMsg = await BookingService.cancel(
      existingTrip,
      booking,
      bookingId,
      user.id
    );
    sendJsonResponse(res, 'SUCCESS', 'Booking', resultMsg);
  };

  static readonly getAllByUser = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookings = await BookingService.getAllByUserId(user.id);
    sendJsonResponse(
      res,
      'SUCCESS',
      'Booking',
      'getAllByUser',
      'bookings',
      bookings
    );
  };

  static readonly getAllByDriver = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookings = await BookingService.getAllByDriverId(user.id);
    sendJsonResponse(
      res,
      'SUCCESS',
      'Booking',
      'getAllByDriver',
      'bookings',
      bookings
    );
  };

  static readonly getAllByTrip = async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookings = await BookingService.getAllByTripId(id);
    sendJsonResponse(
      res,
      'SUCCESS',
      'Booking',
      'getAllByTrip',
      'bookings',
      bookings
    );
  };

  static readonly validate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { action } = req.body;
    const user = requireUser(req, res);
    if (!user?.role?.includes('driver')) {
      sendJsonResponse(res, 'FORBIDDEN', 'Booking', 'Not a driver');
      return;
    }

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Invalid ID');
      return;
    }

    if (action !== 'accept' && action !== 'reject') {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Booking',
        'Action must be either accept or reject'
      );
      return;
    }
    try {
      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
        include: { trip: true },
      });
      if (!booking) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Booking not found');
        return;
      }

      if (!booking.trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Trip not found');
        return;
      }

      if (booking.trip.driverId !== user.id) {
        sendJsonResponse(
          res,
          'FORBIDDEN',
          'Booking',
          'Only the driver can validate this booking'
        );
        return;
      }
      if (booking.status !== BookingStatus.pending) {
        sendJsonResponse(res, 'CONFLICT', 'Booking', 'Booking is not pending');
        return;
      }
      const validateBookingMsg = await BookingService.validate(
        booking,
        user.id,
        action
      );
      sendJsonResponse(res, 'SUCCESS', 'Booking', validateBookingMsg);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'On validate or cancel booking',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getById = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { id } = req.params;

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'Invalid booking ID');
      return;
    }

    const booking = await prismaNewClient.booking.findUnique({
      where: { id },
      include: { trip: true },
    });

    if (!booking) {
      sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'Booking not found');
      return;
    }

    const isUserPassenger = booking.userId === user.id;
    const isUserDriver = booking.trip.driverId === user.id;

    if (!isUserPassenger && !isUserDriver) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Booking',
        'Not a passenger or not a driver'
      );
      return;
    }
    sendJsonResponse(res, 'SUCCESS', 'Booking', 'getById', 'booking', booking);
  };
}
