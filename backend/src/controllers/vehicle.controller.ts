// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { User } from '../../generated/prisma';
import { VehicleService } from '../services/vehicle.service';
import { isId } from '../utils/validation';

export class VehicleController {
  static readonly createVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    if (!VehicleService.isCreateInputValid(req.body)) {
      res.status(400).json({ message: 'Missing required fields' });
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
        res
          .status(409)
          .json({ message: 'Vehicle with this license plate already exists' });
        return;
      }

      const user = req.user as User;
      if (!user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

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
          role: {
            push: 'driver',
          },
        },
      });
      res.status(201).json(vehicle);
    } catch {
      res.status(500).json({ message: 'Failed to create vehicle' });
    }
  };

  static readonly getAllVehicles = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const vehicles = await prismaNewClient.vehicle.findMany();
    res.status(200).json(vehicles);
  };

  static readonly getVehicleById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    try {
      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      if (!vehicle) {
        res.status(404).json({ message: 'Vehicle not found' });
        return;
      }

      res.json(vehicle);
    } catch {
      res.status(500).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };

  static readonly updateVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    try {
      if (!(await VehicleService.isAuthorized(req.user as User, id))) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const vehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json(vehicle);
    } catch {
      res.status(500).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };

  static readonly deleteVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    try {
      if (!(await VehicleService.isAuthorized(req.user as User, id))) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      await prismaNewClient.vehicle.delete({ where: { id } });
      res.status(200).json({ message: 'Vehicle deleted!' });
    } catch {
      res.status(500).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };
}
