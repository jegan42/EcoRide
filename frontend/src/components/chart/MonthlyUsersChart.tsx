// frontend/src/components/chart/MonthlyUsersChart.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { ChartDataType } from '../../types/common';

interface Props {
  data: ChartDataType[];
}

export const MonthlyUsersChart: React.FC<Props> = ({ data }) => (
  <Paper sx={{ p: 2, width: '100%' }}>
    <Typography variant="h6" gutterBottom>
      Nouveaux utilisateurs (mois)
    </Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="count"
          name="Utilisateurs"
          stroke="#1976d2"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);
