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
    const user = requireUser(req, res);
    if (!user) return;

    try {
      if (!(await BookingService.isValidCreateInput(req.body))) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'invalid or missing fields'
        );
        return;
      }

      const { tripId, seatCount } = req.body;
      const trip = await prismaNewClient.trip.findUnique({
        where: { id: tripId },
        include: { bookings: true, driver: true },
      });
      if (!trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'trip not found');
        return;
      }
      if (trip.status !== 'open') {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'trip not open');
        return;
      }
      if (seatCount > trip.availableSeats) {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'not enough seats');
        return;
      }
      if (user.id === trip.driverId) {
        sendJsonResponse(
          res,
          'FORBIDDEN',
          'Booking',
          'will not booking own trip'
        );
        return;
      }

      const totalPrice = trip.price * seatCount;
      if (user.credits < totalPrice) {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'not enough credits');
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
          'already booked this trip'
        );
        return;
      }

      const booking = await BookingService.create(user, trip, seatCount);

      if (!booking) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Booking',
        'created',
        'booking',
        booking
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to create',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly cancel = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { id } = req.params;
    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'invalid ID');
      return;
    }

    try {
      const booking = await prismaNewClient.booking.findUnique({
        where: { id: id },
        include: { trip: true },
      });

      if (!booking) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      const isUserPassenger = booking.userId === user.id;
      const isUserDriver = booking.trip.driverId === user.id;

      if (!isUserPassenger && !isUserDriver) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'not a passenger or not a driver'
        );
        return;
      }

      if (booking.status === BookingStatus.cancelled) {
        sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'already cancelled');
        return;
      }

      const existingTrip = await prismaNewClient.trip.findUnique({
        where: { id: booking.tripId },
      });
      if (!existingTrip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'trip not found');
        return;
      }

      const resultMsg = await BookingService.cancel(
        existingTrip,
        booking,
        id,
        user.id
      );
      sendJsonResponse(res, 'SUCCESS', 'Booking', resultMsg);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to cancel',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getAllByUser = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    try {
      const bookings = await BookingService.getAllByUserId(user.id);

      if (!bookings) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Booking',
        'getAllByUser',
        'bookings',
        bookings
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to getAllByUser',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getAllByDriver = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    try {
      const bookings = await BookingService.getAllByDriverId(user.id);
      if (!bookings) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Booking',
        'getAllByDriver',
        'bookings',
        bookings
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to getAllByDriver',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getAllByTrip = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const bookings = await BookingService.getAllByTripId(id);

      if (!bookings) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }
      sendJsonResponse(
        res,
        'SUCCESS',
        'Booking',
        'getAllByTrip',
        'bookings',
        bookings
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to getAllByTrip',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly validate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { action } = req.body;
    const user = requireUser(req, res);
    if (!user?.role?.includes('driver')) {
      sendJsonResponse(res, 'FORBIDDEN', 'Booking', 'not a driver');
      return;
    }

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'invalid ID');
      return;
    }

    if (action !== 'accept' && action !== 'reject') {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Booking',
        'action must be either accept or reject'
      );
      return;
    }
    try {
      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
        include: { trip: true },
      });
      if (!booking) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      if (!booking.trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'trip not found');
        return;
      }

      if (booking.trip.driverId !== user.id) {
        sendJsonResponse(
          res,
          'FORBIDDEN',
          'Booking',
          'only the driver can validate'
        );
        return;
      }
      if (booking.status !== BookingStatus.pending) {
        sendJsonResponse(res, 'CONFLICT', 'Booking', 'booking not pending');
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
        'failed to validate',
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
      sendJsonResponse(res, 'BAD_REQUEST', 'Booking', 'invalid ID');
      return;
    }

    try {
      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
        include: { trip: true },
      });

      if (!booking) {
        sendJsonResponse(res, 'NOT_FOUND', 'Booking', 'booking not found');
        return;
      }

      const isUserPassenger = booking.userId === user.id;
      const isUserDriver = booking.trip.driverId === user.id;

      if (!isUserPassenger && !isUserDriver) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Booking',
          'not a passenger or not a driver'
        );
        return;
      }
      sendJsonResponse(
        res,
        'SUCCESS',
        'Booking',
        'getById',
        'booking',
        booking
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Booking',
        'failed to getById',
        undefined,
        undefined,
        error
      );
    }
  };
}
