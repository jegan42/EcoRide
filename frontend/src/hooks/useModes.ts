// frontend/src/hooks/useModes.tsx
import { useState } from 'react';
import { type Vehicle } from '../types/vehicle';
import { type ProfileTabsMode } from '../components/profile/ProfileTabs';

export type FormMode = 'view' | 'edit' | 'add';

export const useModes = (): {
  profileMode: FormMode;
  setProfileMode: React.Dispatch<React.SetStateAction<FormMode>>;
  vehicleMode: FormMode;
  setVehicleMode: React.Dispatch<React.SetStateAction<FormMode>>;
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<Vehicle | null>>;
  profileTabs: ProfileTabsMode;
  setProfileTabs: React.Dispatch<React.SetStateAction<ProfileTabsMode>>;
  resetModes: () => void;
  isViewMode: boolean;
} => {
  const [profileMode, setProfileMode] = useState<FormMode>('view');
  const [vehicleMode, setVehicleMode] = useState<FormMode>('view');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [profileTabs, setProfileTabs] = useState<ProfileTabsMode>('preference');

  const resetModes = (): void => {
    setProfileMode('view');
    setVehicleMode('view');
    setSelectedVehicle(null);
    setProfileTabs('preference');
  };

  return {
    profileMode,
    setProfileMode,
    vehicleMode,
    setVehicleMode,
    selectedVehicle,
    setSelectedVehicle,
    profileTabs,
    setProfileTabs,
    resetModes,
    isViewMode: profileMode === 'view' && vehicleMode === 'view',
  };
};
