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

interface Props {
  title: string;
  dataToSet: ChartDataType[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

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
                fill={COLORS[index % COLORS.length]}
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
