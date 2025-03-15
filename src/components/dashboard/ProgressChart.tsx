
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ProgressChartProps {
  data: Array<{
    name: string;
    completed: number;
    remaining: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-2 rounded-md text-xs">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-green-600">{`Completed: ${payload[0].value}`}</p>
        <p className="text-amber-600">{`Remaining: ${payload[1].value}`}</p>
      </div>
    );
  }

  return null;
};

const ProgressChart = ({ data }: ProgressChartProps) => {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          barGap={0}
          barCategoryGap={30}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="completed" stackId="a" fill="rgba(34, 197, 94, 0.8)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" stackId="a" fill="rgba(250, 204, 21, 0.5)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
