// backend/src/services/vehicle.service.ts
import prismaNewClient from '../lib/prisma';
import { User } from '../../generated/prisma';

export class VehicleService {
  static async isVehicleExistsWithLicensePlate(
    licensePlate: string
  ): Promise<boolean> {
    return Boolean(
      await prismaNewClient.vehicle.findUnique({
        where: { licensePlate },
      })
    );
  }

  static async isAuthorized(user: User, vehicleId: string): Promise<boolean> {
    const vehicle = await prismaNewClient.vehicle.findUnique({
      where: { id: vehicleId },
    });
    return Boolean(
      user.role.includes('admin') || (vehicle && vehicle.userId === user.id)
    );
  }
}
