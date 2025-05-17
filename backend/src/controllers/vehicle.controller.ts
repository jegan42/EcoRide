// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { User } from '../../generated/prisma';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  static readonly createVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const {
      brand,
      model,
      color,
      vehicleYear,
      licensePlate,
      energy,
      seatCount,
    } = req.body;

    const invalidInput = VehicleService.checkCreateInput(req.body);
    if (invalidInput) {
      res.status(400).json({ message: invalidInput });
      return;
    }

    try {
      if (
        await VehicleService.checkVehicleExistsWithLicensePlate(licensePlate)
      ) {
        res
          .status(400)
          .json({ message: 'Vehicle with this license plate already exists' });
        return;
      }

      const user = req.user as User;
      if (!user) {
        res.status(403).json({ message: 'Unauthorized' });
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
      res.status(400).json({ message: 'Failed to create vehicle' });
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
      res.status(400).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };

  static readonly updateVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const existing = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      const user = req.user as User;
      if (!existing || existing.userId !== user.id) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const vehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: req.body,
      });

      res.json(vehicle);
    } catch {
      res.status(400).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };

  static readonly deleteVehicle = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    try {
      const existing = await prismaNewClient.vehicle.findUnique({
        where: { id },
      });
      const user = req.user as User;
      if (!existing || existing.userId !== user.id) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      await prismaNewClient.vehicle.delete({ where: { id } });
      res.status(200).json({ message: 'Vehicle deleted!' });
    } catch {
      res.status(400).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };
}
