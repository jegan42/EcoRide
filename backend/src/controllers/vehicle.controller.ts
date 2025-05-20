// backend/src/controllers/vehicle.controller.ts
import { Request, Response } from 'express';
import prismaNewClient from '../lib/prisma';
import { VehicleService } from '../services/vehicle.service';
import { isId } from '../utils/validation';
import { requireUser } from '../utils/request';

export class VehicleController {
  static readonly create = async (
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

      const user = requireUser(req, res);
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
          role: Array.from(new Set([...user.role, 'driver'])),
        },
      });
      res.status(201).json({ vehicle });
    } catch {
      res.status(500).json({ message: 'Failed to create vehicle' });
    }
  };

  static readonly getAll = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    const vehicles = await prismaNewClient.vehicle.findMany();
    res.status(200).json({ vehicles });
  };

  static readonly getById = async (
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

  static readonly update = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { id } = req.params;

    if (!VehicleService.isUpdateInputValid(req.body)) {
      res.status(400).json({ message: 'Invalid or missing fields' });
      return;
    }

    if (!isId(id)) {
      res.status(400).json({ message: 'Invalid ID' });
      return;
    }

    const user = requireUser(req, res);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      if (!(await VehicleService.isAuthorized(user, id))) {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const vehicle = await prismaNewClient.vehicle.update({
        where: { id },
        data: req.body,
      });

      res.status(200).json({ vehicle });
    } catch {
      res.status(500).json({ message: 'Error checking vehicle existence' });
      return;
    }
  };

  static readonly delete = async (
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

    const user = requireUser(req, res);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    try {
      if (!(await VehicleService.isAuthorized(user, id))) {
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
