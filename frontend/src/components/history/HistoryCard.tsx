// frontend/src/components/booking/HistoryCard.tsx
import { Card, CardContent, Stack } from '@mui/material';
import { type History } from '../../types/history';
import { FindTripInfoTrip } from '../findtrip/FindTripInfoTrip';
import { HistoryInfo } from './HistoryInfo';

interface Props {
  history?: History;
}

export const HistoryCard: React.FC<Props> = ({ history }) => {
  if (!history) return <></>;
  return (
    <Card sx={{ border: '1px solid black' }}>
      <CardContent>
        <Stack
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-around',
            gap: 2,
          }}
        >
          <HistoryInfo history={history} />
          <Stack
            sx={{
              width: { xs: '100%', sm: '40%' },
            }}
          >
            {history.trip && (
              <FindTripInfoTrip trip={history.trip} minInfo={true} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
