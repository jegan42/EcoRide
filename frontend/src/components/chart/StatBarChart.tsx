// frontend/src/components/chart/StatBarChart.tsx
import React from 'react';
import { Typography, Paper } from '@mui/material';
import type { ChartData } from '../../hooks/useAdmin';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Bar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  chartDataToSet: ChartData;
}

export const StatBarChart: React.FC<Props> = ({ chartDataToSet }) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        height: '100%',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Connexion de la semaine
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={chartDataToSet.loginsThisWeekByDay}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};
