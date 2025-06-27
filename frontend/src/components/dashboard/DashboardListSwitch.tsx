// frontend/src/component/dashboard/DashboardListSwitch.tsx
import type { Vehicle } from '../../types/vehicle';
import type { ProfileTabsMode } from '../profile/ProfileTabs';
import { VehicleList } from '../vehicle/VehicleList';
import type { DashboardMode } from '../../hooks/useDashboardState';
import { PreferencesView } from '../preferences/PreferencesView';
import type { Trip } from '../../types/trip';
import { TripList } from '../trip/TripList';
import { BookingList } from '../booking/BookingList';
import { ReviewListSwitch } from '../review/ReviewListSwitch';
import { HistoryList } from '../history/HistoryList';

interface Props {
  profileTabs: ProfileTabsMode;
  setDashboardMode: (mode: DashboardMode) => void;
  setSelectedData: (data: Vehicle | Trip | null) => void;
}

export const DashboardListSwitch: React.FC<Props> = ({
  profileTabs,
  setDashboardMode,
  setSelectedData,
}) => {
  switch (profileTabs) {
    case 'preference':
      return <PreferencesView setDashboardMode={setDashboardMode} />;
    case 'vehicle':
      return (
        <VehicleList
          setDashboardMode={setDashboardMode}
          setSelectedData={setSelectedData}
        />
      );
    case 'trip':
      return (
        <TripList
          setDashboardMode={setDashboardMode}
          setSelectedData={setSelectedData}
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
