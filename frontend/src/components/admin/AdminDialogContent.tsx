// frontend/src/components/admin/AdminDialogContent.tsx
import React from 'react';
import { Typography } from '@mui/material';
import { AdminUserForm } from '../../components/admin/AdminUserForm';
import type { User } from '../../types/user';
import type { AdminFormMode } from '../../types/admin';
import type { Trip } from '../../types/trip';
import type { Contact } from '../../types/contact';
import { formatDateTime } from '../../utils/formatDateTime';
import { ContactForm } from '../contact/ContactForm';
import { TripForm } from '../trip/TripForm';
import type { Review } from '../../types/review';

interface Props {
  viewMode: AdminFormMode;
  selectedData: User | Trip | Contact | Review;
  setDataToUpdate: (
    data: Partial<User> | Partial<Trip> | Partial<Contact> | Partial<Review>
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
        <TripForm
          defaultValues={selectedData as Trip}
          isSubmitting={false}
          onSubmit={setDataToUpdate}
          onCancel={() => {}}
          isAdmin={true}
        />
      )}
      {viewMode.includes('tripDelete') && (
        <Typography>
          {`Êtes-vous sûr de vouloir annuler \
                le voyage ${(selectedData as Trip).departureCity} → ${(selectedData as Trip).arrivalCity} \
                du ${formatDateTime((selectedData as Trip).departureDate)} au ${formatDateTime((selectedData as Trip).arrivalDate)} ?`}
        </Typography>
      )}
      {viewMode.includes('tripStart') && (
        <Typography>
          {`Êtes-vous sûr de vouloir commencer \
                le voyage ${(selectedData as Trip).departureCity} → ${(selectedData as Trip).arrivalCity} \
                du ${formatDateTime((selectedData as Trip).departureDate)} au ${formatDateTime((selectedData as Trip).arrivalDate)} ?`}
        </Typography>
      )}
      {viewMode.includes('tripArrived') && (
        <Typography>
          {`Êtes-vous sûr de vouloir finir \
                le voyage ${(selectedData as Trip).departureCity} → ${(selectedData as Trip).arrivalCity} \
                du ${formatDateTime((selectedData as Trip).departureDate)} au ${formatDateTime((selectedData as Trip).arrivalDate)} ?`}
        </Typography>
      )}
      {viewMode.includes('contactEdit') && (
        <ContactForm
          onSubmit={setDataToUpdate}
          defaultData={selectedData as Contact}
          showEmail={false}
          showSubmitButton={false}
          autoSubmit={true}
        />
      )}
      {viewMode.includes('contactDelete') && (
        <Typography>{`Êtes-vous sûr de vouloir ne pas répondre au message.`}</Typography>
      )}
    </>
  );
};
