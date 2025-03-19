
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export interface AttendanceChartProps {
  data?: {
    name: string;
    value: number;
    color: string;
  }[];
}

const DEFAULT_DATA = [
  { name: 'Present', value: 70, color: '#22c55e' },
  { name: 'Absent', value: 15, color: '#ef4444' },
  { name: 'Late', value: 15, color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-2 rounded-md text-xs">
        <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const AttendanceChart = ({ data = DEFAULT_DATA }: AttendanceChartProps) => {
  return (
    <div className="h-[300px] w-full flex flex-col justify-center items-center">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
                const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                return (
                  <text 
                    x={x} 
                    y={y} 
                    fill="#888" 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fontSize={10}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center" 
              iconType="circle"
              iconSize={8}
              formatter={(value, entry, index) => (
                <span style={{ color: data[index].color, fontSize: 12 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AttendanceChart;
