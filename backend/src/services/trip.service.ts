// backend/src/services/trip.service.ts
import prismaNewClient from '../lib/prisma';
import { Trip, Prisma } from '../../generated/prisma';
import { ParsedQs } from 'qs';

type QueryValue =
  | (string | boolean)
  | ParsedQs
  | (string | ParsedQs)[]
  | undefined;

export class TripService {
  static async getMaxPassengerSeats(vehicleId: string): Promise<number | null> {
    const availableSeats = (
      await prismaNewClient.vehicle.findUnique({
        where: { id: vehicleId },
      })
    )?.seatCount;
    return availableSeats ? availableSeats - 1 : null;
  }

  static isValidDates(
    departureDate: string,
    arrivalDate: string
  ): string | null {
    const startDate = new Date(departureDate);
    if (new Date() > startDate) return 'departureDate must be after today';

    const endDate = new Date(arrivalDate);
    if (startDate > endDate) return 'departureDate must be before arrivalDate';

    if (startDate.getTime() === endDate.getTime())
      return 'departureDate and arrivalDate can start at the same date but not same time';

    return null;
  }

  static async isExistTrip(
    userId: string,
    vehicleId: string,
    departureDate: string
  ): Promise<Trip | null> {
    try {
      const startDate = new Date(departureDate);
      const startOfDay = new Date(startDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(startDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const existingTrip = await prismaNewClient.trip.findFirst({
        where: {
          driverId: userId,
          vehicleId,
          departureDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      return existingTrip;
    } catch {
      return null;
    }
  }

  static buildWhereClause(
    data: Partial<Trip> & { flexible: boolean }
  ): Prisma.TripWhereInput {
    const departureCity =
      data.departureCity !== undefined && typeof data.departureCity === 'string'
        ? data.departureCity
        : undefined;

    const arrivalCity =
      data.arrivalCity !== undefined && typeof data.arrivalCity === 'string'
        ? data.arrivalCity
        : undefined;

    let departureDate: Prisma.DateTimeFilter | undefined;

    if (
      data.departureDate !== undefined &&
      typeof data.departureDate === 'string'
    ) {
      if (data.flexible === true) {
        departureDate = this.getFlexibleDateRange(data.departureDate);
      } else {
        const targetDate = new Date(data.departureDate);
        departureDate = {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        };
      }
    }

    return {
      status: 'open',
      ...(departureCity && { departureCity }),
      ...(arrivalCity && { arrivalCity }),
      ...(departureDate && { departureDate }),
    };
  }

  static async findAlternativeTrips(
    baseWhereClause: Prisma.TripWhereInput,
    date: QueryValue,
    flexible: QueryValue
  ): Promise<Trip[] | null> {
    if (date !== undefined && typeof date === 'string' && flexible !== true) {
      const flexibleRange = this.getFlexibleDateRange(date);
      const whereClause: Prisma.TripWhereInput = {
        ...baseWhereClause,
        departureDate: flexibleRange,
      };

      return await prismaNewClient.trip.findMany({
        where: whereClause,
        include: {
          driver: true,
          vehicle: true,
        },
      });
    }

    return null;
  }

  private static getFlexibleDateRange(dateStr: string) {
    const targetDate = new Date(dateStr);
    const minDate = new Date(targetDate);
    const maxDate = new Date(targetDate);

    minDate.setDate(minDate.getDate() - 2);
    maxDate.setDate(maxDate.getDate() + 2);

    return { gte: minDate, lte: maxDate };
  }
}
