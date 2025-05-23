// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { VehicleService } from '../services/vehicle.service';
import { sendJsonResponse } from '../utils/response';
import { User } from '../../generated/prisma';

export class VehicleController {
  static readonly create = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const {
        brand,
        model,
        color,
        vehicleYear,
        licensePlate,
        energy,
        seatCount,
      } = req.body;

      if (await VehicleService.isVehicleExistsWithLicensePlate(licensePlate)) {
        sendJsonResponse(
          res,
          'CONFLICT',
          'Vehicle',
          'already used this licensePlate'
        );
        return;
      }

      const user = req.user as User;

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

      if (vehicles?.length === 0) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'vehicle not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Vehicle',
        'getAll',
        'vehicles',
        vehicles
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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
    try {
      const { id } = req.params;

      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'vehicle not found');
        return;
      }

      sendJsonResponse(
        res,
        'SUCCESS',
        'Vehicle',
        'getById',
        'vehicle',
        vehicle
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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

      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'vehicle not found');
        return;
      }

      const user = req.user as User;

      if (!(await VehicleService.isAuthorized(user, id))) {
        sendJsonResponse(res, 'FORBIDDEN', 'Vehicle', 'not the driver');
        return;
      }

      const updateVehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: req.body,
      });

      sendJsonResponse(
        res,
        'SUCCESS',
        'Vehicle',
        'updated',
        'vehicle',
        updateVehicle
      );
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
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
    try {
      const { id } = req.params;

      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        sendJsonResponse(res, 'NOT_FOUND', 'Vehicle', 'vehicle not found');
        return;
      }

      const user = req.user as User;

      if (!(await VehicleService.isAuthorized(user, id))) {
        sendJsonResponse(res, 'FORBIDDEN', 'Vehicle', 'not the driver');
        return;
      }

      await prismaNewClient.vehicle.delete({ where: { id } });
      sendJsonResponse(res, 'SUCCESS', 'Vehicle', 'deleted');
    } catch (error) {
      sendJsonResponse(
        res,
        'ERROR',
        'Vehicle',
        'failed to delete',
        undefined,
        undefined,
        error
      );
    }
  };
}
