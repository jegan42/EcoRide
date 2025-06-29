// frontend/src/components/chart/StatPieChart.tsx
import React from 'react';
import { Stack, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  Legend,
  Tooltip,
  Cell,
  Pie,
  PieChart,
} from 'recharts';
import type { ChartDataType } from '../../types/common';
import { COLORS_CHART } from './ColorsChart';

interface Props {
  title: string;
  dataToSet: ChartDataType[];
}

export const StatPieChart: React.FC<Props> = ({ title, dataToSet }) => {
  return (
    <Stack spacing={2}>
      <Typography variant="h6" mt={6} gutterBottom>
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={dataToSet}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {dataToSet.map((_entry, index) => (
              <Cell
                key={`cell-driver-${index}`}
                fill={COLORS_CHART[index % COLORS_CHART.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Stack>
  );
};
