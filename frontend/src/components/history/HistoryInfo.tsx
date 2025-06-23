// frontend/src/components/booking/HistoryInfo.tsx
import { Chip, Stack, Typography } from '@mui/material';
import {
  getStatusColor,
  getStatusLabel,
  type History,
} from '../../types/history';
import { formatTimestampToDate } from '../../utils/formatDateTime';
import { formatField } from '../../utils/formatField';

interface Props {
  history?: History;
}

export const HistoryInfo: React.FC<Props> = ({ history }) => {
  if (!history) return <></>;
  const isDriver = history.role === 'driver';
  return (
    <Stack
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: { xs: '100%', sm: '40%' },
        gap: 1,
      }}
    >
      <Typography variant="h6">
        Rôle : {isDriver ? 'Conducteur' : 'Passager'}
      </Typography>
      {isDriver ? (
        <Typography variant="body2">
          Passager :{' '}
          {formatField(history.booking?.user?.username.toUpperCase())}
        </Typography>
      ) : (
        <Typography variant="body2">
          Conducteur :{' '}
          {formatField(history.trip?.driver?.username.toUpperCase())}
        </Typography>
      )}

      <Typography variant="body2">
        Validé le : {formatTimestampToDate(history.createdAt, true)}
      </Typography>
      <Chip
        label={getStatusLabel(history.status)}
        color={getStatusColor(history.status)}
        size="small"
      />
    </Stack>
  );
};
