// frontend/src/component/dashboard/DashboardListSwitch.tsx
import type { Vehicle } from '../../types/vehicle';
import type { ProfileTabsMode } from '../profile/ProfileTabs';
import { VehicleList } from '../vehicle/VehicleList';
import type { FormMode } from '../../hooks/useDashboardState';
import { PreferencesView } from '../preferences/PreferencesView';
import type { Trip } from '../../types/trip';
import { TripList } from '../trip/TripList';
import { BookingList } from '../booking/BookingList';
import { ReviewListSwitch } from '../review/ReviewListSwitch';
import { HistoryList } from '../history/HistoryList';

interface Props {
  profileTabs: ProfileTabsMode;
  onSetPreferencesMode: (mode: FormMode) => void;
  onSetVehicleMode: (mode: FormMode) => void;
  onSetSelectedVehicle: (vehicle: Vehicle) => void;
  onSetTripMode: (mode: FormMode) => void;
  onSetSelectedTrip: (trip: Trip) => void;
}

export const DashboardListSwitch: React.FC<Props> = ({
  profileTabs,
  onSetPreferencesMode,
  onSetVehicleMode,
  onSetSelectedVehicle,
  onSetTripMode,
  onSetSelectedTrip,
}) => {
  switch (profileTabs) {
    case 'preference':
      return <PreferencesView onSetPreferencesMode={onSetPreferencesMode} />;
    case 'vehicle':
      return (
        <VehicleList
          onSetVehicleMode={onSetVehicleMode}
          onSetSelectedVehicle={onSetSelectedVehicle}
        />
      );
    case 'trip':
      return (
        <TripList
          onSetTripMode={onSetTripMode}
          onSetSelectedTrip={onSetSelectedTrip}
        />
      );
    case 'booking':
      return <BookingList />;
    case 'review':
      return <ReviewListSwitch />;
    case 'history':
      return <HistoryList />;
    default:
      return null;
  }
};
