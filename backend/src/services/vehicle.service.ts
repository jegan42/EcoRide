// backend/src/services/vehicle.service.ts
import prismaNewClient from '../lib/prisma';
import { User, Vehicle } from '../../generated/prisma';

export class VehicleService {
  static isCreateInputValid(data: Partial<Vehicle>): boolean {
    return Boolean(
      data.brand &&
        data.model &&
        data.color &&
        data.vehicleYear &&
        typeof data.vehicleYear === 'number' &&
        data.vehicleYear >= 1900 &&
        data.vehicleYear <= new Date().getFullYear() + 1 &&
        data.licensePlate &&
        data.licensePlate.length >= 3 &&
        data.licensePlate.length <= 20 &&
        data.energy &&
        data.seatCount &&
        typeof data.seatCount === 'number' &&
        data.seatCount >= 1 &&
        data.seatCount <= 10
    );
  }

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
