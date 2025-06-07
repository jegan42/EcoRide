// frontend/src/test/validations/vehicleSchema.ts
import {
  vehicleSchema,
  parseVehicleForm,
} from '../../validations/vehicleSchema';
import { type VehicleEnergy } from '../../types/vehicle';

describe('vehicleSchema', () => {
  const validData = {
    brand: 'Toyota',
    model: 'Yaris',
    color: 'Rouge',
    vehicleYear: '2022',
    licensePlate: 'AB-123-CD',
    energy: 'petrol' as VehicleEnergy,
    seatCount: '5',
    photo: 'https://example.com/car.jpg',
  };

  it('should pass validation with valid data', () => {
    const result = vehicleSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail if vehicleYear is not a number', () => {
    const result = vehicleSchema.safeParse({
      ...validData,
      vehicleYear: 'abc',
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().vehicleYear?._errors[0]).toContain(
      'nombre entier'
    );
  });

  it('should fail if vehicleYear is out of valid range', () => {
    const result = vehicleSchema.safeParse({
      ...validData,
      vehicleYear: '1800',
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().vehicleYear?._errors[0]).toContain(
      'année est invalide'
    );
  });

  it('should fail if seatCount is not an integer', () => {
    const result = vehicleSchema.safeParse({ ...validData, seatCount: '3.5' });
    expect(result.success).toBe(false);
    expect(result.error?.format().seatCount?._errors[0]).toContain('un entier');
  });

  it('should fail if seatCount is out of range', () => {
    const result = vehicleSchema.safeParse({ ...validData, seatCount: '12' });
    expect(result.success).toBe(false);
    expect(result.error?.format().seatCount?._errors[0]).toContain(
      'entre 1 et 10'
    );
  });

  it('should fail if licensePlate contains invalid characters', () => {
    const result = vehicleSchema.safeParse({
      ...validData,
      licensePlate: '??@@',
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().licensePlate?._errors[0]).toContain(
      'Caractères autorisés'
    );
  });

  it('should fail if energy is invalid', () => {
    const result = vehicleSchema.safeParse({ ...validData, energy: 'invalid' });
    expect(result.success).toBe(false);
    expect(result.error?.format().energy?._errors[0]).toContain(
      'énergie est invalide'
    );
  });

  it('should allow photo to be empty', () => {
    const result = vehicleSchema.safeParse({ ...validData, photo: '' });
    expect(result.success).toBe(true);
  });

  it('should fail if photo is an invalid URL', () => {
    const result = vehicleSchema.safeParse({
      ...validData,
      photo: 'not-a-url',
    });
    expect(result.success).toBe(false);
    expect(result.error?.format().photo?._errors[0]).toContain('URL invalide');
  });

  it('should convert data correctly using parseVehicleForm', () => {
    const parsed = parseVehicleForm({ ...validData, photo: '' });
    expect(parsed.vehicleYear).toBe(2022);
    expect(parsed.seatCount).toBe(5);
    expect(parsed.energy).toBe('petrol');
    expect(parsed.photo).toBeUndefined(); // '' is converted to undefined
  });

  it('should convert data correctly using parseVehicleForm', () => {
    const parsed = parseVehicleForm({
      ...validData,
      photo: 'https://test.com/',
    });
    expect(parsed.vehicleYear).toBe(2022);
    expect(parsed.seatCount).toBe(5);
    expect(parsed.energy).toBe('petrol');
    expect(parsed.photo).toBe('https://test.com/');
  });

  it('should reject empty string as energy', () => {
    const result = vehicleSchema.safeParse({
      brand: 'Toyota',
      model: 'Yaris',
      color: 'Rouge',
      vehicleYear: '2020',
      licensePlate: 'AB-123-CD',
      energy: '',
      seatCount: '5',
      photo: '',
    });

    expect(result.success).toBe(false);
    expect(result.error?.format().energy?._errors[0]).toBe(
      "Le type d'énergie est invalide"
    );
  });
});
