// frontend/src/components/admin/AdminStatHead.tsx
import { Stack } from '@mui/material';
import { AdminStatHeadInfo } from './AdminStatHeadInfo';

interface Props {
  commissionTotal: number;
  nbUsers: number;
  nbDrivers: number;
  nbPassengers: number;
  nbTrips: number;
  nbBookings: number;
  nbContacts: number;
}

export const AdminStatHead: React.FC<Props> = ({
  commissionTotal,
  nbUsers,
  nbDrivers,
  nbPassengers,
  nbTrips,
  nbBookings,
  nbContacts,
}) => (
  <Stack
    direction={'column'}
    spacing={2}
    mt={4}
    justifyContent={'space-between'}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent={'space-between'}
    >
      <AdminStatHeadInfo title="Gain" value={commissionTotal} />
      <AdminStatHeadInfo title="Utilisateurs" value={nbUsers} />
      <AdminStatHeadInfo title="Chauffeurs" value={nbDrivers} />
      <AdminStatHeadInfo title="Passagers" value={nbPassengers} />
    </Stack>
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent={'space-between'}
    >
      <AdminStatHeadInfo title="Trajets" value={nbTrips} />
      <AdminStatHeadInfo title="Réservation" value={nbBookings} />
      <AdminStatHeadInfo title="Messages" value={nbContacts} />
    </Stack>
  </Stack>
);
