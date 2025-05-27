// frontend/src/types/vehicle.ts
export type VehicleEnergy =
  | 'petrol'
  | 'diesel'
  | 'hybrid'
  | 'lpg'
  | 'electric'
  | 'plug_in_hybrid'
  | 'cng'
  | 'hydrogen'
  | 'ethanol';

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
