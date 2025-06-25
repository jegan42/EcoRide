// frontend/src/components/admin/AdminStatHead.tsx
import { Stack } from '@mui/material';
import { AdminStatHeadInfo } from './AdminStatHeadInfo';

interface Props {
  nbUsers: number;
  nbDrivers: number;
  nbPassengers: number;
  nbTrips: number;
  nbContacts: number;
}

export const AdminStatHead: React.FC<Props> = ({
  nbUsers,
  nbDrivers,
  nbPassengers,
  nbTrips,
  nbContacts,
}) => (
  <Stack
    direction={{ xs: 'column', sm: 'row' }}
    spacing={2}
    mt={4}
    justifyContent={'space-between'}
  >
    <AdminStatHeadInfo title="Utilisateurs" value={nbUsers} />
    <AdminStatHeadInfo title="Chauffeurs" value={nbDrivers} />
    <AdminStatHeadInfo title="Passagers" value={nbPassengers} />
    <AdminStatHeadInfo title="Trajets" value={nbTrips} />
    <AdminStatHeadInfo title="Messages de contact" value={nbContacts} />
  </Stack>
);
