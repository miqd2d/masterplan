
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

export interface ProgressChartProps {
  data?: Array<{
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
        <p className="text-green-600">{`Completed: ${payload[0].value}%`}</p>
        <p className="text-amber-600">{`Remaining: ${payload[1].value}%`}</p>
      </div>
    );
  }

  return null;
};

const ProgressChart = ({ data }: ProgressChartProps) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<Array<{
    name: string;
    completed: number;
    remaining: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data: lessons, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) {
          throw error;
        }
        
        if (lessons && lessons.length > 0) {
          // Take up to 5 lessons to avoid cluttering the chart
          const processedData = lessons.slice(0, 5).map(lesson => {
            return {
              name: lesson.title,
              completed: lesson.progress || 0,
              remaining: 100 - (lesson.progress || 0)
            };
          });
          
          setChartData(processedData);
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLessons();
  }, [user]);

  // If custom data is provided, use it. Otherwise use the data from the database
  const displayData = data || chartData;
  
  // If still loading and no data provided, show loading state
  if (isLoading && !data) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If no data available, show fallback
  if (displayData.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center">
        <p className="text-muted-foreground">No lesson data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 30,
          }}
          barGap={0}
          barCategoryGap={30}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 10 }}
            height={70}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10 }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ fontSize: 12, color: value === 'completed' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(250, 204, 21, 0.8)' }}>
                {value === 'completed' ? 'Completed' : 'Remaining'}
              </span>
            )}
          />
          <Bar dataKey="completed" name="Completed" stackId="a" fill="rgba(34, 197, 94, 0.8)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="remaining" name="Remaining" stackId="a" fill="rgba(250, 204, 21, 0.5)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
