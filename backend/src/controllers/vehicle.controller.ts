// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { VehicleService } from '../services/vehicle.service';
import {
  conflictResponse,
  errorResponse,
  forbiddenResponse,
  notFoundResponse,
  successCreateResponse,
  successResponse,
} from '../utils/response';
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
        photo,
      } = req.body;

      if (await VehicleService.isVehicleExistsWithLicensePlate(licensePlate)) {
        conflictResponse(res, 'Vehicle', 'already used this licensePlate');
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
          photo: photo ?? null,
        },
      });

      await prismaNewClient.user.update({
        where: { id: user.id },
        data: {
          role: Array.from(new Set([...user.role, 'driver'])),
        },
      });

      successCreateResponse(res, 'Vehicle', 'created', vehicle);
    } catch (error) {
      errorResponse(res, 'Vehicle', 'failed to create', error);
    }
  };

  static readonly getAll = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const vehicles = await prismaNewClient.vehicle.findMany();

      if (vehicles?.length === 0) {
        notFoundResponse(res, 'Vehicle', 'vehicle not found');
        return;
      }

      successResponse(res, 'Vehicles', 'getAll', vehicles);
    } catch (error) {
      errorResponse(res, 'Vehicles', 'failed to getAll', error);
    }
  };

  static readonly getByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const user = req.user as User;
    try {
      const vehicles = await prismaNewClient.vehicle.findMany({
        where: {
          userId: user.id,
        },
      });

      if (vehicles?.length === 0) {
        notFoundResponse(res, 'Vehicle', 'vehicle not found');
        return;
      }

      successResponse(res, 'Vehicles', 'getByUser', vehicles);
    } catch (error) {
      errorResponse(res, 'Vehicles', 'failed to getByUser', error);
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
        notFoundResponse(res, 'Vehicle', 'vehicle not found');
        return;
      }

      successResponse(res, 'Vehicle', 'getById', vehicle);
    } catch (error) {
      errorResponse(res, 'Vehicle', 'failed to getById', error);
    }
  };

  static readonly getByUserId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const vehicles = await prismaNewClient.vehicle.findMany({
        where: { userId:id },
      });
      if (!vehicles) {
        notFoundResponse(res, 'Vehicle', 'vehicles not found');
        return;
      }

      successResponse(res, 'Vehicle', 'getByUserId', vehicles);
    } catch (error) {
      errorResponse(res, 'Vehicle', 'failed to getByUserId', error);
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
        notFoundResponse(res, 'Vehicle', 'vehicle not found');
        return;
      }

      const user = req.user as User;

      if (!(await VehicleService.isAuthorized(user, id))) {
        forbiddenResponse(res, 'Vehicle', 'not the driver');
        return;
      }

      const updateVehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: { ...req.body, updatedAt: new Date() },
      });

      successResponse(res, 'Vehicle', 'updated', updateVehicle);
    } catch (error) {
      errorResponse(res, 'Vehicle', 'failed to update', error);
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
        notFoundResponse(res, 'Vehicle', 'vehicle not found');
        return;
      }

      const user = req.user as User;

      if (!(await VehicleService.isAuthorized(user, id))) {
        forbiddenResponse(res, 'Vehicle', 'not the driver');
        return;
      }

      await prismaNewClient.vehicle.delete({ where: { id } });
      successResponse(res, 'Vehicle', 'deleted');
    } catch (error) {
      errorResponse(res, 'Vehicle', 'failed to delete', error);
    }
  };
}
