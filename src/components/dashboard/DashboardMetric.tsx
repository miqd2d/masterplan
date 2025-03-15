
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

interface DashboardMetricProps extends VariantProps<typeof metricVariants> {
  title: string;
  value: string | number;
  metricClassName?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
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
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className={cn("text-3xl font-semibold", metricClassName)}>
          {value}
        </span>
        
        {trend && (
          <AnimatedChip
            color={
              trend.direction === 'up' 
                ? 'success' 
                : trend.direction === 'down' 
                ? 'danger' 
                : 'default'
            }
            className={cn(
              'ml-1',
              metricVariants({ trend: trend.direction })
            )}
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}
            {trend.label && ` ${trend.label}`}
          </AnimatedChip>
        )}
      </div>
      
      {subtitle && (
        <span className="text-xs text-muted-foreground mt-1">{subtitle}</span>
      )}
    </div>
  );
};

export default DashboardMetric;
