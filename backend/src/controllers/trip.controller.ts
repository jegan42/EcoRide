// backend/src/controllers/trip.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { TripService } from '../services/trip.service';
import { requireUser } from '../utils/request';
import { sendJsonResponse } from '../utils/response';

export class TripController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!TripService.isValidCreateInput(req.body)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Trip', 'Invalid or missing fields');
      return;
    }

    const user = requireUser(req, res);
    if (!user) return;

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
      sendJsonResponse(res, 'BAD_REQUEST', 'Trip', dateValidationMsg);
      return;
    }

    try {
      const maxPassengerSeats =
        await TripService.getMaxPassengerSeats(vehicleId);
      if (maxPassengerSeats === null) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'Vehicle not found');
        return;
      }

      if (maxPassengerSeats < availableSeats) {
        sendJsonResponse(
          res,
          'BAD_REQUEST',
          'Trip',
          'Available seats cannot exceed maxPassengerSeats (total seats minus 1 for the driver)'
        );
        return;
      }

      if (await TripService.isExistTrip(user.id, vehicleId, departureDate)) {
        sendJsonResponse(
          res,
          'CONFLICT',
          'Trip',
          'A trip with the same vehicle and user already exists on this date'
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

      if (!trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'trip founded', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'Failed to create',
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
    const { from, to, date, flexible } = req.query;

    if (!TripService.isValidSearchInput(req.query)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Trip', 'Invalid fields');
      return;
    }

    try {
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
          sendJsonResponse(
            res,
            'SUCCESS',
            'Trip',
            'No trips found matching your criteria',
            'trips',
            []
          );
          return;
        } else {
          sendJsonResponse(
            res,
            'SUCCESS',
            'Trip',
            'alternative trips is founded',
            'trips',
            alternative
          );
          return;
        }
      }

      if (!trips) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trips not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Trip',
        'trips is founded',
        'trips',
        trips
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'Failed to getAll',
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

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'trip founded', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'Failed to getById',
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
    const { id } = req.params;

    if (!TripService.isValidUpdateInput(req.body)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Trip', 'Invalid or missing fields');
      return;
    }

    try {
      const existingTrip = await prismaNewClient.trip.findUnique({
        where: { id },
      });
      if (!existingTrip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      if (requireUser(req, res)?.id !== existingTrip.driverId) {
        sendJsonResponse(res, 'FORBIDDEN', 'Trip', 'not driver');
        return;
      }

      const trip = await prismaNewClient.trip.update({
        where: { id },
        data: req.body,
      });

      if (!trip) {
        sendJsonResponse(res, 'NOT_FOUND', 'Trip', 'trip not found');
        return;
      }

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'trip founded', 'trip', trip);
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'Failed to update',
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
        sendJsonResponse(res, 'FORBIDDEN', 'Trip', 'not driver');
        return;
      }

      await prismaNewClient.trip.delete({
        where: { id },
      });

      sendJsonResponse(res, 'SUCCESS', 'Trip', 'trip deleted');
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Trip',
        'Failed to delete',
        undefined,
        undefined,
        error
      );
    }
  };
}
