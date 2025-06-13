// frontend/src/hooks/useDashboardState.tsx
import { useState } from 'react';
import { type Vehicle } from '../types/vehicle';
import { type ProfileTabsMode } from '../components/profile/ProfileTabs';
import type { Trip } from '../types/trip';

export type FormMode = 'view' | 'edit' | 'add';

export const useDashboardState = (): {
  profileMode: FormMode;
  setProfileMode: React.Dispatch<React.SetStateAction<FormMode>>;
  preferencesMode: FormMode;
  setPreferencesMode: React.Dispatch<React.SetStateAction<FormMode>>;
  vehicleMode: FormMode;
  setVehicleMode: React.Dispatch<React.SetStateAction<FormMode>>;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
  tripMode: FormMode;
  setTripMode: React.Dispatch<React.SetStateAction<FormMode>>;
  selectedTrip: Trip | null;
  setSelectedTrip: React.Dispatch<React.SetStateAction<Trip | null>>;
  profileTabs: ProfileTabsMode;
  setProfileTabs: React.Dispatch<React.SetStateAction<ProfileTabsMode>>;
  resetModes: () => void;
  isViewMode: boolean;
} => {
  const [profileMode, setProfileMode] = useState<FormMode>('view');
  const [preferencesMode, setPreferencesMode] = useState<FormMode>('view');
  const [vehicleMode, setVehicleMode] = useState<FormMode>('view');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [tripMode, setTripMode] = useState<FormMode>('view');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [profileTabs, setProfileTabs] = useState<ProfileTabsMode>('preference');

  const resetModes = (): void => {
    setProfileMode('view');
    setPreferencesMode('view');
    setVehicleMode('view');
    setSelectedVehicle(null);
    setTripMode('view');
    setSelectedTrip(null);
    setProfileTabs('preference');
  };

  return {
    profileMode,
    setProfileMode,
    preferencesMode,
    setPreferencesMode,
    vehicleMode,
    setVehicleMode,
    selectedVehicle,
    setSelectedVehicle,
    tripMode,
    setTripMode,
    selectedTrip,
    setSelectedTrip,
    profileTabs,
    setProfileTabs,
    resetModes,
    isViewMode:
      profileMode === 'view' &&
      preferencesMode === 'view' &&
      vehicleMode === 'view' &&
      tripMode === 'view',
  };
};
