// frontend/src/components/chart/WeeklyDataChart.tsx
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
import type { ChartData } from '../../hooks/useAdmin';

interface Props {
  chartDataToSet: ChartData;
}

export const WeeklyDataChart: React.FC<Props> = ({ chartDataToSet }) => (
  <Paper sx={{ p: 2 }}>
    <Typography variant="h5" gutterBottom>
      Activité de la semaine (trajets, contacts, connexions)
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartDataToSet.tripsThisWeekByDay.map((item, i) => ({
          day: item.label,
          trajets: item.count,
          contacts: chartDataToSet.contactsThisWeekByDay[i]?.count || 0,
          connexions: chartDataToSet.loginsThisWeekByDay[i]?.count || 0,
        }))}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
        <Line type="monotone" dataKey="trajets" stroke="#8884d8" />
        <Line type="monotone" dataKey="contacts" stroke="#82ca9d" />
        <Line type="monotone" dataKey="connexions" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);
