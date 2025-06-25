// frontend/src/components/admin/AdminStatHeadInfo.tsx
import { Paper, Typography } from '@mui/material';

interface Props {
  title: string;
  value: number | string;
}

export const AdminStatHeadInfo: React.FC<Props> = ({ title, value }) => (
  <Paper elevation={2} sx={{ p: 2, minWidth: 200 }}>
    <Typography variant="subtitle1" color="text.secondary">
      {title}
    </Typography>
    <Typography variant="h5" fontWeight="bold">
      {value}
    </Typography>
  </Paper>
);
