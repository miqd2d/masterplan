
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import AnimatedChip from '../ui-custom/AnimatedChip';

const metricVariants = cva('', {
  variants: {
    trend: {
      up: 'text-green-600',
      down: 'text-red-600',
      neutral: 'text-muted-foreground',
    },
  },
  defaultVariants: {
    trend: 'neutral',
  },
});

interface TrendData {
  value: string | number;
  direction: 'up' | 'down' | 'neutral';
  label?: string;
}

interface DashboardMetricProps {
  title: string;
  value: string | number;
  metricClassName?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: TrendData;
  className?: string;
}

const DashboardMetric = ({
  title,
  value,
  metricClassName,
  subtitle,
  icon,
  trend,
  className,
}: DashboardMetricProps) => {
  return (
    <div className={cn('bg-white rounded-lg p-6 shadow-sm border border-border/30', className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex flex-col">
        <span className={cn("text-4xl font-bold", metricClassName)}>
          {value}
        </span>
        
        {trend && (
          <div className="mt-2">
            <AnimatedChip
              color={
                trend.direction === 'up' 
                  ? 'success' 
                  : trend.direction === 'down' 
                  ? 'danger' 
                  : 'default'
              }
              className={cn(
                metricVariants({ trend: trend.direction })
              )}
            >
              {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
              {trend.label && ` ${trend.label}`}
            </AnimatedChip>
          </div>
        )}
      </div>
      
      {subtitle && (
        <span className="text-xs text-muted-foreground mt-1">{subtitle}</span>
      )}
    </div>
  );
};

export default DashboardMetric;
