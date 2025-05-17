// backend/src/controllers/trip.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { User } from '../../generated/prisma';
import { TripService } from '../services/trip.service';

export class TripController {
  static readonly createTrip = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      vehicleId,
      departureCity,
      arrivalCity,
      departureDate,
      arrivalDate,
      availableSeats,
      price,
    } = req.body;

    const invalidInput = TripService.checkCreateInput(req.body);
    if (invalidInput) {
      res.status(400).json({ message: invalidInput });
      return;
    }

    if (!(await TripService.checkVehicleExists(vehicleId))) {
      res.status(400).json({ message: 'Vehicle not found' });
      return;
    }

    const invalidDate = TripService.checkDates(departureDate, arrivalDate);
    if (invalidDate) {
      res.status(400).json({
        message: invalidDate,
      });
      return;
    }

    const user = req.user as User;

    if (await TripService.checkTripExists(user.id, vehicleId, departureDate)) {
      res.status(409).json({
        message:
          'A trip with the same vehicle and user already exists on this date.',
      });
      return;
    }

    try {
      const trip = await prismaNewClient.trip.create({
        data: {
          driverId: user.id,
          vehicleId,
          departureCity,
          arrivalCity,
          departureDate: new Date(departureDate),
          arrivalDate: new Date(arrivalDate),
          availableSeats,
          price,
        },
      });

      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create trip', details: error });
    }
  };

  static readonly getAllTrips = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { from, to, date, flexible } = req.query;

      const whereClause = TripService.buildWhereClause(
        from,
        to,
        date,
        flexible
      );

      const trips = await prismaNewClient.trip.findMany({
        where: whereClause,
        include: {
          driver: true,
          vehicle: true,
        },
      });

      if (trips.length === 0) {
        const alternative = await TripService.findAlternativeTrips(
          whereClause,
          date,
          flexible
        );
        if (!alternative?.length) {
          res
            .status(200)
            .json({ message: 'No trips found matching your criteria.' });
          return;
        } else {
          res.status(200).json({ trips: alternative, alternative: true });
          return;
        }
      }

      res.status(200).json(trips);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trips', details: error });
    }
  };

  static readonly getTripById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const trip = await prismaNewClient.trip.findUnique({
        where: { id: id },
        include: {
          driver: true,
          vehicle: true,
        },
      });

      if (!trip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }

      res.status(200).json(trip);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trip', details: error });
    }
  };

  static readonly updateTrip = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const existeTrip = await prismaNewClient.trip.findUnique({
        where: { id },
      });
      if (!existeTrip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }

      const trip = await prismaNewClient.trip.update({
        where: { id },
        data: req.body,
      });

      if ((req.user as User).id !== trip.driverId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update trip', details: error });
    }
  };

  static readonly deleteTrip = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const trip = await prismaNewClient.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        res.status(400).json({ message: 'Trip does not exist' });
        return;
      }

      if ((req.user as User).id !== trip.driverId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      await prismaNewClient.trip.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Trip deleted!' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete trip', details: error });
    }
  };
}
