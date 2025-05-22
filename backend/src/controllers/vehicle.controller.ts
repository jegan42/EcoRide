// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { VehicleService } from '../services/vehicle.service';
import { isId } from '../utils/validation';
import { requireUser } from '../utils/request';
import { sendJsonResponse } from '../utils/response';

export class VehicleController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!VehicleService.isCreateInputValid(req.body)) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Vehicle',
        'missing required fields'
      );
      return;
    }

    const {
      brand,
      model,
      color,
      vehicleYear,
      licensePlate,
      energy,
      seatCount,
    } = req.body;

    try {
      if (await VehicleService.isVehicleExistsWithLicensePlate(licensePlate)) {
        sendJsonResponse(
          res,
          'CONFLICT',
          'Vehicle',
          'this license plate already exists'
        );
        return;
      }

      const user = requireUser(req, res);
      if (!user) return;

      const vehicle = await prismaNewClient.vehicle.create({
        data: {
          brand,
          model,
          color,
          vehicleYear,
          licensePlate,
          energy,
          seatCount,
          userId: user.id,
        },
      });

      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'vehicle not found');
        return;
      }

      await prismaNewClient.user.update({
        where: { id: user.id },
        data: {
          role: Array.from(new Set([...user.role, 'driver'])),
        },
      });
      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Vehicle',
        'created',
        'vehicle',
        vehicle
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
        'failed to create',
        undefined,
        undefined,
        error
      );
    }
  };

  static readonly getAll = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const vehicles = await prismaNewClient.vehicle.findMany();

      if (!vehicles) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS_CREATE',
        'Vehicle',
        'founded',
        'vehicles',
        vehicles
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Vehicle', 'invalid ID');
      return;
    }

    try {
      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Vehicle',
        'founded',
        'vehicle',
        vehicle
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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

    if (!VehicleService.isUpdateInputValid(req.body)) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Vehicle',
        'invalid or missing fields'
      );
      return;
    }

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Vehicle', 'invalid ID');
      return;
    }

    const user = requireUser(req, res);
    if (!user) return;

    try {
      if (!(await VehicleService.isAuthorized(user, id))) {
        sendJsonResponse(res, 'FORBIDDEN', 'Vehicle', 'not a driver');
        return;
      }

      const vehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: req.body,
      });
      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Vehicle',
        'founded',
        'vehicle',
        vehicle
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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

    const user = requireUser(req, res);
    if (!user) return;

    if (!id) {
      sendJsonResponse(
        res,
        'BAD_REQUEST',
        'Vehicle',
        'missing required fields'
      );
      return;
    }

    if (!isId(id)) {
      sendJsonResponse(res, 'BAD_REQUEST', 'Vehicle', 'invalid ID');
      return;
    }

    try {
      if (!(await VehicleService.isAuthorized(user, id))) {
        sendJsonResponse(res, 'FORBIDDEN', 'Vehicle', 'not a driver');
        return;
      }

      await prismaNewClient.vehicle.delete({ where: { id } });
      sendJsonResponse(res, 'SUCCESS', 'Vehicle', 'deleted');
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
        'Failed to delete',
        undefined,
        undefined,
        error
      );
      return;
    }
  };
}
