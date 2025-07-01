// backend/src/controllers/trip.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { TripService } from '../services/trip.service';
import {
  badRequestResponse,
  conflictResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successCreateResponse,
  successResponse,
} from '../utils/response';
import { User, Prisma } from '../../generated/prisma';

export class TripController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { departureDate, arrivalDate } = req.body;

    const dateValidationMsg = TripService.isValidDates(
      departureDate,
      arrivalDate
    );
    if (dateValidationMsg) {
      badRequestResponse(res, 'Trip', dateValidationMsg);
      return;
    }

    try {
      const { vehicleId, departureCity, arrivalCity, availableSeats, price } =
        req.body;

      const maxPassengerSeats =
        await TripService.getMaxPassengerSeats(vehicleId);
      if (maxPassengerSeats === null) {
        notFoundResponse(res, 'Trip', 'vehicle not found');
        return;
      }

      if (maxPassengerSeats < availableSeats) {
        badRequestResponse(
          res,
          'Trip',
          'availableSeats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)'
        );
        return;
      }

      const user = req.user as User;

      if (await TripService.isExistTrip(user.id, vehicleId, departureDate)) {
        conflictResponse(
          res,
          'Trip',
          'already exists a trip with the same vehicle and user on this date'
        );
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
        include: {
          driver: true,
          vehicle: true,
        },
      });

      successCreateResponse(res, 'Trip', 'created', trip);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to create', error);
    }
  };

  static readonly getByDriver = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;

    try {
      const trips = await prismaNewClient.trip.findMany({
        where: { driverId: user.id },
        include: {
          driver: true,
          vehicle: true,
        },
      });

      if (trips.length === 0) {
        notFoundResponse(res, 'Trip', 'trips not found');
        return;
      }

      successResponse(res, 'Trip', 'getByDriver', trips);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to getByDriver', error);
    }
  };

  static readonly getAll = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const trips = await prismaNewClient.trip.findMany({
        include: {
          driver: true,
          vehicle: true,
        },
      });

      successResponse(res, 'Trips', 'getAll', trips);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to getAll', error);
    }
  };

  static readonly getWithFilter = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const whereClause =
        req.body !== undefined
          ? TripService.buildWhereClause(req.body)
          : ({
              status: 'open',
              availableSeats: {
                gt: 0,
              },
            } as Prisma.TripWhereInput);

      const trips = await prismaNewClient.trip.findMany({
        where: whereClause,
        include: {
          driver: true,
          vehicle: true,
        },
      });

      if (trips.length === 0) {
        const { departureDate } = req.body;
        const { flexible } = req.body;
        const alternative = await TripService.findAlternativeTrips(
          whereClause,
          departureDate,
          flexible
        );
        if (alternative === null || alternative.length === 0) {
          successResponse(
            res,
            'Trips',
            'trips not found matching your criteria',
            []
          );
          return;
        } else {
          successResponse(
            res,
            'Trips',
            'alternative trips founded',
            alternative
          );
          return;
        }
      }

      successResponse(res, 'Trips', 'getWithFilter', trips);
    } catch (error) {
      console.error('🔴 Prisma getWithFilter Error:', error);
      errorResponse(res, 'Trip', 'failed to getWithFilter', error);
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
        notFoundResponse(res, 'Trip', 'trip not found');
        return;
      }

      successResponse(res, 'Trip', 'getById', trip);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to getById', error);
    }
  };

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const existingTrip = await prismaNewClient.trip.findUnique({
        where: { id },
      });
      if (!existingTrip) {
        notFoundResponse(res, 'Trip', 'trip not found');
        return;
      }

      const user = req.user as User;

      if (user.id !== existingTrip.driverId && !user.role.includes('admin')) {
        forbiddenResponse(res, 'Trip', 'not a driver');
        return;
      }

      const trip = await prismaNewClient.trip.update({
        where: { id },
        data: req.body,
        include: {
          driver: true,
          vehicle: true,
        },
      });

      successResponse(res, 'Trip', 'updated', trip);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to update', error);
    }
  };

  static readonly cancel = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const trip = await prismaNewClient.trip.findUnique({
        where: { id },
      });

      if (!trip) {
        notFoundResponse(res, 'Trip', 'trip not found');
        return;
      }

      const user = req.user as User;

      if (user.id !== trip.driverId) {
        forbiddenResponse(res, 'Trip', 'not a driver');
        return;
      }

      const cancelledTrip = await TripService.cancel(trip.id);

      successResponse(res, 'Trip', 'cancelled', cancelledTrip);
    } catch (error) {
      errorResponse(res, 'Trip', 'failed to cancel', error);
    }
  };
}
