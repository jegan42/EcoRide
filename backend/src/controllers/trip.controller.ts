// backend/src/controllers/trip.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { TripService } from '../services/trip.service';
import { requireUser } from '../utils/request';
import { sendJsonResponse } from '../utils/response';
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
      sendJsonResponse(res, 'BAD_REQUEST', 'Trip', dateValidationMsg);
      return;
    }

    try {
      const { vehicleId, departureCity, arrivalCity, availableSeats, price } =
        req.body;

      const maxPassengerSeats =
        await TripService.getMaxPassengerSeats(vehicleId);
      if (maxPassengerSeats === null) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'vehicle not found');
        return;
      }

      if (maxPassengerSeats < availableSeats) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Trip',
          'availableSeats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)'
        );
        return;
      }

      const user = req.user as User;

      if (await TripService.isExistTrip(user.id, vehicleId, departureDate)) {
        sendJsonResponse(
          res,
          'CONFLICT',
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
      });

      sendJsonResponse(res, 'SUCCESS_CREATE', 'Trip', 'created', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'failed to create',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getAll = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const whereClause =
        req.body !== undefined
          ? TripService.buildWhereClause(req.body)
          : ({
              status: 'open',
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
          sendJsonResponse(
            res,
            'SUCCESS',
            'Trip',
            'trips not found matching your criteria',
            'trips',
            []
          );
          return;
        } else {
          sendJsonResponse(
            res,
            'SUCCESS',
            'Trip',
            'alternative trips founded',
            'trips',
            alternative
          );
          return;
        }
      }

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'getAll', 'trips', trips);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'failed to getAll',
        undefined,
        undefined,
        error
      );
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
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'getById', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'failed to getById',
        undefined,
        undefined,
        error
      );
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
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      if (requireUser(req, res)?.id !== existingTrip.driverId) {
        sendJsonResponse(res, 'FORBIDDEN', 'Trip', 'not a driver');
        return;
      }

      const trip = await prismaNewClient.trip.update({
        where: { id },
        data: req.body,
      });

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'updated', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'failed to update',
        undefined,
        undefined,
        error
      );
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
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      if (requireUser(req, res)?.id !== trip.driverId) {
        sendJsonResponse(res, 'FORBIDDEN', 'Trip', 'not a driver');
        return;
      }

      await prismaNewClient.trip.delete({
        where: { id },
      });

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'deleted');
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'failed to delete',
        undefined,
        undefined,
        error
      );
    }
  };
}
