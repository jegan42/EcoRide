// frontend/src/components/booking/HistoryList.tsx
import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState, type JSX } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { type History } from '../../types/history';
import { historieEnrichied } from '../../services';
import { HistoryCard } from './HistoryCard';
import { timestampToDate } from '../../utils/formatDateTime';

export const HistoryList = (): JSX.Element => {
  const { user } = useProfile();
  const [histories, setHistories] = useState<History[]>([]);

  useEffect(() => {
    const fetchHistories = async (): Promise<void> => {
      if (!user?.id) return;
      const data: History[] = await historieEnrichied(user.id);
      setHistories(
        data.sort(
          (a, b) =>
            timestampToDate(b.createdAt).getTime() -
            timestampToDate(a.createdAt).getTime()
        )
      );
    };

    void fetchHistories();
  }, [user?.id]);

  return (
    <Box mt={4}>
      {!histories.length ? (
        <Typography variant="body1" color="text.secondary">
          Aucun avis disponible.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {histories.map((history) => {
            return (
              <Box key={history.id}>
                <HistoryCard history={history} />
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};
