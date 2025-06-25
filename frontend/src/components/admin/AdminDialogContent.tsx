// frontend/src/components/admin/AdminDialogContent.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { AdminUserForm } from '../../components/admin/AdminUserForm';
import type { User } from '../../types/user';
import type { AdminFormMode } from '../../types/admin';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import { AdminTripForm } from '../../components/admin/AdminTripForm';
import { formatDateTime } from '../../utils/formatDateTime';

interface Props {
  viewMode: AdminFormMode;
  selectedData: User | Trip | Contact;
  setDataToUpdate: (
    data: Partial<User> | Partial<Trip> | Partial<Contact>
  ) => void;
}

export const AdminDialogContent: React.FC<Props> = ({
  viewMode,
  selectedData,
  setDataToUpdate,
}) => {
  return (
    <>
      {viewMode.includes('userEdit') && (
        <AdminUserForm user={selectedData as User} onSave={setDataToUpdate} />
      )}
      {viewMode.includes('userDelete') && (
        <Typography>{`Êtes-vous sûr de vouloir suspendre ${(selectedData as User).username}`}</Typography>
      )}
      {viewMode.includes('tripEdit') && (
        <AdminTripForm
          defaultValues={selectedData as Trip}
          onSubmit={setDataToUpdate}
        />
      )}
      {viewMode.includes('tripDelete') && (
        <Typography>
          {`Êtes-vous sûr de vouloir annuler \
                le voyage ${(selectedData as Trip).departureCity} → ${(selectedData as Trip).arrivalCity} \
                du ${formatDateTime((selectedData as Trip).departureDate)} au ${formatDateTime((selectedData as Trip).arrivalDate)} ?`}
        </Typography>
      )}
    </>
  );
};
