// frontend/src/types/vehicle.ts
export interface Vehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  color: string;
  vehicleYear: number;
  licensePlate: string;
  energy: VehicleEnergy;
  photo?: string;
  seatCount: number;
  createdAt: string;
  updatedAt: string;
}

export const vehicleEnergyEnum = [
  'petrol',
  'diesel',
  'hybrid',
  'lpg',
  'electric',
  'plug_in_hybrid',
  'cng',
  'hydrogen',
  'ethanol',
] as const;

export type VehicleEnergy = (typeof vehicleEnergyEnum)[number];

export const energyOptions: { value: VehicleEnergy; label: string }[] = [
  { value: 'petrol', label: 'Essence' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybride' },
  { value: 'lpg', label: 'GPL' },
  { value: 'electric', label: 'Électrique' },
  { value: 'plug_in_hybrid', label: 'Hybride rechargeable' },
  { value: 'cng', label: 'GNC' },
  { value: 'hydrogen', label: 'Hydrogène' },
  { value: 'ethanol', label: 'Éthanol' },
];

export const getEnergyLabel = (value?: VehicleEnergy): string => {
  return (
    energyOptions.find((option) => option.value === value)?.label ?? value ?? ''
  );
};
