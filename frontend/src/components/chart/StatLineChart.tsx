// frontend/src/components/chart/StatLineChart.tsx
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
import { COLORS_CHART } from './ColorsChart';

interface Props {
  period: string;
  dataSet: { title: string; data: ChartDataType[] }[];
}

export const StatLineChart: React.FC<Props> = ({ period, dataSet }) => {
  const labels = dataSet[0].data.map((item) => item.label);

  const mergedData = labels.map((label) => {
    const entry: Record<string, number | string> = { day: label };

    dataSet.forEach(({ title, data }) => {
      const item = data.find((d) => d.label === label);
      entry[title] = item?.count ?? 0;
    });

    return entry;
  });
  return (
    <Paper sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Activité {period} ({dataSet.map((d) => d.title).join(', ')})
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={mergedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {dataSet.map((item, i) => (
            <Line
              key={item.title}
              type="monotone"
              dataKey={item.title}
              stroke={COLORS_CHART[i % COLORS_CHART.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};
