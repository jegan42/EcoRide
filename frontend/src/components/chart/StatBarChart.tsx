// frontend/src/components/chart/StatBarChart.tsx
import React from 'react';
import { Typography, Paper } from '@mui/material';
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
import type { ChartDataType } from '../../types/common';

interface Props {
  title: string;
  chartDataToSet: ChartDataType[];
}

export const StatBarChart: React.FC<Props> = ({ title, chartDataToSet }) => {
  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        height: '100%',
        width: '100%',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={500} height={300} data={chartDataToSet}>
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
