// backend/src/controllers/trip.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { TripService } from '../services/trip.service';
import { requireUser } from '../utils/request';

export class TripController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!TripService.isValidCreateInput(req.body)) {
      res.status(400).json({ message: 'Invalid or missing fields' });
      return;
    }

    const {
      vehicleId,
      departureCity,
      arrivalCity,
      departureDate,
      arrivalDate,
      availableSeats,
      price,
    } = req.body;

    const dateValidationMsg = TripService.isValidDates(
      departureDate,
      arrivalDate
    );
    if (dateValidationMsg) {
      res.status(400).json({
        message: dateValidationMsg,
      });
      return;
    }

    const user = requireUser(req, res);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      const maxPassengerSeats =
        await TripService.getMaxPassengerSeats(vehicleId);
      if (maxPassengerSeats === null) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      if (maxPassengerSeats < availableSeats) {
        res.status(400).json({
          message: `Available seats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)`,
        });
        return;
      }

      if (await TripService.isExistTrip(user.id, vehicleId, departureDate)) {
        res.status(409).json({
          message:
            'A trip with the same vehicle and user already exists on this date.',
        });
        return;
      }

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

      res.status(201).json({ trip });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create trip', details: error });
    }
  };

  static readonly getAll = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { from, to, date, flexible } = req.query;

      if (!TripService.isValidSearchInput(req.query)) {
        res.status(400).json({ message: 'Invalid fields' });
        return;
      }

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
          res.status(200).json({
            trips: [],
            message: 'No trips found matching your criteria.',
          });
          return;
        } else {
          res.status(200).json({ trips: alternative, alternative: true });
          return;
        }
      }

      res.status(200).json({ trips });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trips', details: error });
    }
  };

  static readonly getById = async (
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

      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch trip', details: error });
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    if (!TripService.isValidUpdateInput(req.body)) {
      res.status(400).json({ message: 'Invalid or missing fields' });
      return;
    }

    try {
      const existingTrip = await prismaNewClient.trip.findUnique({
        where: { id },
      });
      if (!existingTrip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }

      if (requireUser(req, res)?.id !== existingTrip.driverId) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const trip = await prismaNewClient.trip.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json({ trip });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update trip', details: error });
    }
  };

  static readonly delete = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const trip = await prismaNewClient.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        res.status(404).json({ message: 'Trip does not exist' });
        return;
      }

      if (requireUser(req, res)?.id !== trip.driverId) {
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
