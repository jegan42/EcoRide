// frontend/src/components/admin/AdminSwitchViewList.tsx
import React from 'react';
import type { User } from '../../types/user';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import type { AdminFormMode } from '../../types/admin';
import { AdminStatList } from './AdminStatList';
import { AdminUserList } from './AdminUserList';
import { AdminTripList } from './AdminTripList';
import { ContactList } from '../contact/ContactList';

interface Props {
  viewMode: AdminFormMode;
  setViewMode: (mode: AdminFormMode) => void;
  setSelectedData: (data: User | Trip | Contact) => void;
}

export const AdminSwitchViewList: React.FC<Props> = ({
  viewMode,
  setViewMode,
  setSelectedData,
}) => {
  return (
    <>
      {viewMode.includes('userList') && (
        <AdminUserList
          setViewMode={setViewMode}
          setSelectedUser={setSelectedData}
        />
      )}

      {viewMode.includes('tripList') && (
        <AdminTripList
          setViewMode={setViewMode}
          setSelectedTrip={setSelectedData}
        />
      )}

      {viewMode.includes('contactList') && (
        <ContactList
          setViewMode={setViewMode}
          setSelectedContact={setSelectedData}
        />
      )}

      {viewMode.includes('statList') && <AdminStatList />}
    </>
  );
};
