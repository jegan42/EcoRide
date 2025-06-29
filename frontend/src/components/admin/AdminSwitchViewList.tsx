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
import { ReviewList } from '../review/ReviewList';
import { Stack, Typography } from '@mui/material';
import type { Review } from '../../types/review';

interface Props {
  viewMode: AdminFormMode;
  setViewMode: (mode: AdminFormMode) => void;
  setSelectedData: (data: User | Trip | Contact | Review) => void;
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

      {viewMode.includes('reviewList') && (
        <Stack spacing={2} mt={4}>
          <Typography variant="h5" gutterBottom>
            Liste des Trajets
          </Typography>
          <ReviewList
            setViewMode={setViewMode}
            setSelectedData={setSelectedData}
          />
        </Stack>
      )}

      {viewMode.includes('statList') && <AdminStatList />}
    </>
  );
};
