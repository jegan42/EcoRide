// backend/src/services/vehicle.service.ts
import prismaNewClient from '../lib/prisma';
import { Vehicle } from '../../generated/prisma';

export class VehicleService {
  static checkCreateInput(data: Vehicle): string | null {
    return !data.brand ||
      !data.model ||
      !data.color ||
      !data.vehicleYear ||
      !data.licensePlate ||
      !data.energy ||
      !data.seatCount
      ? 'Missing required fields'
      : null;
  }

  static async checkVehicleExistsWithLicensePlate(
    licensePlate: string
  ): Promise<Vehicle | null> {
    try {
      const vehicle = await prismaNewClient.vehicle.findUnique({
        where: { licensePlate },
      });
      return vehicle;
    } catch {
      return null;
    }
  }
}
