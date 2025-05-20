// backend/src/controllers/booking.controller.ts
import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { requireUser } from '../utils/request';
import { BookingStatus } from '../../generated/prisma';
import prismaNewClient from '../lib/prisma';
import { isId } from '../utils/validation';

export class BookingController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const user = requireUser(req, res);
      if (!user) return;

      if (!(await BookingService.isValidCreateInput(req.body))) {
        res.status(400).json({ message: 'Invalid or missing fields' });
        return;
      }

      const { tripId, seatCount } = req.body;

      const booking = await BookingService.create(user, tripId, seatCount);
      if (typeof booking === 'string') {
        res.status(400).json({ message: booking });
        return;
      }

      res.status(201).json({ booking });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create booking', error });
    }
  };

  static readonly cancel = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookingId = req.params.id;

    const existingBooking = await BookingService.getById(user.id, bookingId);
    if (typeof existingBooking === 'string') {
      res.status(400).json({ message: existingBooking });
      return;
    }

    if (existingBooking === null) {
      res.status(400).json({ message: 'Booking not found' });
      return;
    }

    if (existingBooking.status === BookingStatus.cancelled) {
      res.status(400).json({ message: 'Booking already cancelled' });
      return;
    }

    const existingTrip = await prismaNewClient.trip.findUnique({
      where: { id: existingBooking.tripId },
    });
    if (!existingTrip) {
      res.status(404).json({ message: 'Trip does not exist' });
      return;
    }

    const result = await BookingService.cancel(
      existingTrip,
      existingBooking,
      bookingId,
      user.id
    );
    res.status(200).json({ message: result });
  };

  static readonly getAllByUser = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookings = await BookingService.getAllByUserId(user.id);
    res.status(200).json({ bookings });
  };

  static readonly getAllByDriver = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;

    const bookings = await BookingService.getAllByDriverId(user.id);
    res.status(200).json({ bookings });
  };

  static readonly getAllByTrip = async (req: Request, res: Response) => {
    const { id } = req.params;
    const bookings = await BookingService.getAllByTripId(id);
    res.status(200).json({ bookings });
  };

  static readonly validate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;
    const { action } = req.body;
    const user = requireUser(req, res);
    if (!user?.role?.includes('driver')) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    if (action !== 'accept' && action !== 'reject') {
      res
        .status(400)
        .json({ message: 'Action must be either accept or reject' });
      return;
    }
    try {
      const booking = await prismaNewClient.booking.findUnique({
        where: { id },
      });
      if (!booking) {
        res.status(404).json({ message: 'Booking not found' });
        return;
      }

      const validateBookingMsg = await BookingService.validate(
        id,
        user.id,
        action
      );
      res.status(200).json({ message: validateBookingMsg });
    } catch {
      res.status(500).json({ message: 'Error on validate or cancel booking' });
    }
  };

  static readonly getById = async (req: Request, res: Response) => {
    const user = requireUser(req, res);
    if (!user) return;
    const { id } = req.params;

    const booking = await BookingService.getById(user.id, id);
    if (typeof booking === 'string') {
      res.status(400).json({ message: booking });
    }
    res.status(200).json({ booking });
  };
}
