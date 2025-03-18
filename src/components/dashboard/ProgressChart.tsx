
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
        <p className="text-green-600">{`Completed: ${payload[0].value}`}</p>
        <p className="text-amber-600">{`Remaining: ${payload[1].value}`}</p>
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
          // Transform the lessons data into chart format
          // Take up to 5 lessons to avoid cluttering the chart
          const processedData = lessons.slice(0, 5).map(lesson => {
            // Generate random completion values for demo purposes
            // In a real app, this would come from actual lesson completion data
            const completedPercentage = Math.floor(Math.random() * 60) + 20; // 20-80% completed
            
            return {
              name: lesson.title,
              completed: completedPercentage,
              remaining: 100 - completedPercentage
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
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={displayData}
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
