// frontend/src/utils/getFuelEcoGroup.ts
import { type FuelEcoGroup, fuelEcoGroups } from '../types/vehicle';

export const getFuelEcoGroup = (fuelType: string | undefined): FuelEcoGroup => {
  if (!fuelType) return 'unknown';
  for (const [group, fuels] of Object.entries(fuelEcoGroups)) {
    if (fuels.includes(fuelType)) {
      return group as FuelEcoGroup;
    }
  }
  return 'unknown';
};
