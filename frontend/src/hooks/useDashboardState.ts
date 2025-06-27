// frontend/src/hooks/useDashboardState.tsx
import { useState } from 'react';
import { type Vehicle } from '../types/vehicle';
import { type ProfileTabsMode } from '../components/profile/ProfileTabs';
import type { Trip } from '../types/trip';

export type DashboardMode =
  | ''
  | 'view'
  | 'profilView'
  | 'preferencesView'
  | 'tripView'
  | 'vehicleView'
  | 'profilEdit'
  | 'preferencesEdit'
  | 'tripEdit'
  | 'vehicleEdit'
  | 'profilAdd'
  | 'preferencesAdd'
  | 'tripAdd'
  | 'vehicleAdd'
  | 'profilDelete'
  | 'preferencesDelete'
  | 'tripDelete'
  | 'vehicleDelete'
  | 'tripStart'
  | 'tripArrived';

export const useDashboardState = (): {
  dashboardMode: DashboardMode;
  setDashboardMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  selectedData: Vehicle | Trip | null;
  setSelectedData: React.Dispatch<React.SetStateAction<Vehicle | Trip | null>>;
  profileTabs: ProfileTabsMode;
  setProfileTabs: React.Dispatch<React.SetStateAction<ProfileTabsMode>>;
  resetModes: () => void;
  isViewMode: boolean;
} => {
  const [dashboardMode, setDashboardMode] = useState<DashboardMode>('view');
  const [selectedData, setSelectedData] = useState<Vehicle | Trip | null>(null);
  const [profileTabs, setProfileTabs] = useState<ProfileTabsMode>('preference');

  const resetModes = (): void => {
    setDashboardMode('view');
    setProfileTabs('preference');
  };

  return {
    dashboardMode,
    setDashboardMode,
    selectedData,
    setSelectedData,
    profileTabs,
    setProfileTabs,
    resetModes,
    isViewMode: dashboardMode.includes('view')
  };
};
