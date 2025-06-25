// frontend/src/components/admin/AdminSwitchViewList.tsx
import React from 'react';
import type { User } from '../../types/user';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import type { AdminFormMode } from '../../types/admin';
import type { ChartData } from '../../hooks/useAdmin';
import { AdminStatList } from './AdminStatList';
import { AdminUserList } from './AdminUserList';
import { AdminTripList } from './AdminTripList';
import { AdminContactList } from './AdminContactList';

interface Props {
  viewMode: AdminFormMode;
  setViewMode: (mode: AdminFormMode) => void;
  allUsers: User[];
  allTrips: Trip[];
  allContacts: Contact[];
  setSelectedData: (data: User | Trip | Contact) => void;
  chartDataToSet: ChartData;
}

export const AdminSwitchViewList: React.FC<Props> = ({
  viewMode,
  setViewMode,
  allUsers,
  allTrips,
  allContacts,
  setSelectedData,
  chartDataToSet,
}) => {
  return (
    <>
      {viewMode.includes('userList') && (
        <AdminUserList
          setViewMode={setViewMode}
          allUsers={allUsers}
          setSelectedUser={setSelectedData}
        />
      )}

      {viewMode.includes('tripList') && (
        <AdminTripList
          setViewMode={setViewMode}
          allTrips={allTrips}
          setSelectedTrip={setSelectedData}
        />
      )}

      {viewMode.includes('contactList') && (
        <AdminContactList
          setViewMode={setViewMode}
          allContacts={allContacts}
          setSelectedContact={setSelectedData}
        />
      )}

      {viewMode.includes('statList') && (
        <AdminStatList
          allUsers={allUsers}
          allTrips={allTrips}
          allContacts={allContacts}
          chartDataToSet={chartDataToSet}
        />
      )}
    </>
  );
};
