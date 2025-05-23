import { TripService } from '../../services/trip.service';
import prismaNewClient from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    vehicle: {
      findUnique: jest.fn(),
    },
    trip: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('TripService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isValidDates', () => {
    it('returns error if departureDate is in the past', () => {
      const result = TripService.isValidDates('2000-01-01', '2125-01-01');
      expect(result).toBe('departureDate must be after today');
    });

    it('returns error if arrivalDate is before departureDate', () => {
      const result = TripService.isValidDates('2125-01-02', '2125-01-01');
      expect(result).toBe('departureDate must be before arrivalDate');
    });

    it('returns error if both dates are the same timestamp', () => {
      const date = new Date().toISOString();
      const result = TripService.isValidDates(date, date);
      expect(result).toBe(
        'departureDate and arrivalDate can start at the same date but not same time'
      );
    });

    it('returns null for valid dates', () => {
      const result = TripService.isValidDates(
        '2125-01-01T10:00:00Z',
        '2125-01-01T12:00:00Z'
      );
      expect(result).toBeNull();
    });
  });

  describe('getMaxPassengerSeats', () => {
    it('returns seatCount - 1 if vehicle found', async () => {
      (prismaNewClient.vehicle.findUnique as jest.Mock).mockResolvedValue({
        seatCount: 5,
      });
      const result = await TripService.getMaxPassengerSeats('some-id');
      expect(result).toBe(4);
    });

    it('returns null if vehicle not found', async () => {
      (prismaNewClient.vehicle.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await TripService.getMaxPassengerSeats('some-id');
      expect(result).toBeNull();
    });
  });

  describe('isExistTrip', () => {
    it('returns a trip if found on same day', async () => {
      const mockTrip = { id: 'trip1' };
      (prismaNewClient.trip.findFirst as jest.Mock).mockResolvedValue(mockTrip);

      const result = await TripService.isExistTrip(
        'user1',
        'veh1',
        '2125-01-01T08:00:00Z'
      );
      expect(result).toEqual(mockTrip);
    });

    it('returns null if no trip found', async () => {
      (prismaNewClient.trip.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await TripService.isExistTrip(
        'user1',
        'veh1',
        '2125-01-01T08:00:00Z'
      );
      expect(result).toBeNull();
    });

    it('returns null if prisma throws an error', async () => {
      (prismaNewClient.trip.findFirst as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await TripService.isExistTrip(
        'user-id',
        'vehicle-id',
        '2125-12-01T08:00:00Z'
      );

      expect(result).toBeNull();
    });
  });

  describe('buildWhereClause', () => {
    it('builds correct filter with exact date', () => {
      const where = TripService.buildWhereClause({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00Z' as unknown as Date,
        flexible: false,
      });

      expect(where.departureCity).toBe('Paris');
      expect(where.arrivalCity).toBe('Lyon');
      expect(where.departureDate).toHaveProperty('gte');
      expect(where.departureDate).toHaveProperty('lt');
    });

    it('builds correct filter with flexible dates', () => {
      const where = TripService.buildWhereClause({
        departureCity: 'Paris',
        arrivalCity: 'Lyon',
        departureDate: '2125-01-01T08:00:00Z' as unknown as Date,
        flexible: true,
      });

      expect(where.departureDate).toHaveProperty('gte');
      expect(where.departureDate).toHaveProperty('lte');
    });
  });

  describe('findAlternativeTrips', () => {
    it('returns alternatives if flexible is not true', async () => {
      const mockTrips = [{ id: 'alt1' }];
      (prismaNewClient.trip.findMany as jest.Mock).mockResolvedValue(mockTrips);

      const result = await TripService.findAlternativeTrips(
        { departureCity: 'Paris', arrivalCity: 'Lyon', status: 'open' },
        '2125-01-01T08:00:00Z',
        false
      );

      expect(result).toEqual(mockTrips);
    });

    it('returns null if flexible is true', async () => {
      const result = await TripService.findAlternativeTrips(
        { departureCity: 'Paris', arrivalCity: 'Lyon', status: 'open' },
        '2125-01-01T08:00:00Z',
        true
      );

      expect(result).toBeNull();
    });
  });
});
