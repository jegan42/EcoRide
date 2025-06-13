// frontend/src/__tests__/validations/tripSchema.ts
import { describe, expect, it } from 'vitest';
import { tripSchemaBase, parseTripForm } from '../../validations/tripSchema';
import type { TripStatus } from '../../types/trip';

const validBaseData = {
  driverId: crypto.randomUUID(),
  vehicleId: crypto.randomUUID(),
  departureCity: 'Paris',
  arrivalCity: 'Lyon',
  departureDate: '2025-06-12T12:00',
  arrivalDate: '2025-06-12T14:00',
  availableSeats: '3',
  price: '25',
};

describe('tripSchemaBase', () => {
  it('accepts valid data', () => {
    const result = tripSchemaBase.safeParse({
      driverId: crypto.randomUUID(),
      vehicleId: crypto.randomUUID(),
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2025-06-12T12:00',
      arrivalDate: '2025-06-12T14:00',
      availableSeats: '3',
      price: '25',
      status: 'open',
    });

    expect(result.success).toBe(true);
  });

  it('rejects if arrival is before departure', () => {
    const result = tripSchemaBase.safeParse({
      driverId: crypto.randomUUID(),
      vehicleId: crypto.randomUUID(),
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2025-06-12T14:00',
      arrivalDate: '2025-06-12T12:00',
      availableSeats: '3',
      price: '25',
      status: 'open',
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().arrivalDate?._errors).toContain(
      'La date d’arrivée doit être après la date de départ'
    );
  });
});

describe('parseTripForm', () => {
  it('parses TripFormData to TripFormOutput correctly', () => {
    const raw = {
      driverId: 'd1',
      vehicleId: 'v1',
      departureCity: 'Paris',
      arrivalCity: 'Lyon',
      departureDate: '2025-06-12T12:00',
      arrivalDate: '2025-06-12T14:00',
      availableSeats: '2',
      price: '15',
      status: 'full' as TripStatus,
    };

    const parsed = parseTripForm(raw);

    expect(parsed.availableSeats).toBe(2);
    expect(parsed.price).toBe(15);
    expect(parsed.status).toBe('full');
  });
});

describe('tripSchemaBase – custom errors', () => {
  it('displays a custom error if the status is invalid', () => {
    const result = tripSchemaBase.safeParse({
      ...validBaseData,
      status: 'foobar',
    });

    expect(result.success).toBe(false);
    const errors = result.error?.format();
    expect(errors?.status?._errors[0]).toBe('Statut de trajet invalide');
  });

  it('displays an error if the arrival date is before departure', () => {
    const result = tripSchemaBase.safeParse({
      ...validBaseData,
      departureDate: '2025-06-12T15:00',
      arrivalDate: '2025-06-11T12:00',
    });

    expect(result.success).toBe(false);
    const errors = result.error?.format();
    expect(errors?.arrivalDate?._errors[0]).toBe(
      'La date d’arrivée doit être après la date de départ'
    );
  });
});
