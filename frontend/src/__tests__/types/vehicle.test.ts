// frontend/src/__tests__/types/vehicle.test.ts
import { getEnergyLabel, type VehicleEnergy } from '../../types/vehicle';

describe('getEnergyLabel', () => {
  it('should return the correct French label for each VehicleEnergy value', () => {
    const cases: Record<VehicleEnergy, string> = {
      petrol: 'Essence',
      diesel: 'Diesel',
      hybrid: 'Hybride',
      lpg: 'GPL',
      electric: 'Électrique',
      plug_in_hybrid: 'Hybride rechargeable',
      cng: 'GNC',
      hydrogen: 'Hydrogène',
      ethanol: 'Éthanol',
    };

    for (const [value, expected] of Object.entries(cases)) {
      expect(getEnergyLabel(value as VehicleEnergy)).toBe(expected);
    }
  });

  it('should return the raw value if not found in energyOptions', () => {
    // @ts-expect-error: intentionally testing invalid value
    expect(getEnergyLabel('nuclear')).toBe('nuclear');
  });

  it('should return empty string if value is undefined', () => {
    expect(getEnergyLabel(undefined)).toBe('');
  });
});
