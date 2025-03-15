
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  animation?: 'pulse' | 'float' | 'none';
}

const AnimatedChip = ({
  children,
  color = 'default',
  animation = 'none',
  className,
  ...props
}: AnimatedChipProps) => {
  const colorClasses = {
    default: 'bg-secondary text-secondary-foreground',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/80 text-secondary-foreground',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  };

  const animationClasses = {
    pulse: 'animate-pulse-slow',
    float: 'animate-float',
    none: '',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all',
        colorClasses[color],
        animationClasses[animation],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedChip;
