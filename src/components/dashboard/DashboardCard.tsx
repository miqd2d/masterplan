
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedChip from '../ui-custom/AnimatedChip';

interface DashboardCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DashboardCard = ({
  title,
  description,
  icon,
  badge,
  children,
  footer,
  className,
  ...props
}: DashboardCardProps) => {
  return (
    <div 
      className={cn("bg-white rounded-lg border border-border/30 shadow-sm overflow-hidden h-full flex flex-col", className)} 
      {...props}
    >
      <div className="px-5 py-4 border-b border-border/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="text-primary/80">
                {icon}
              </div>
            )}
            <h3 className="font-medium">{title}</h3>
          </div>
          {badge && (
            <AnimatedChip color={badge.color || 'default'}>
              {badge.text}
            </AnimatedChip>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      
      <div className="flex-1 p-5 overflow-auto">
        {children}
      </div>
      
      {footer && (
        <div className="px-5 py-3 border-t border-border/10 bg-secondary/30">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
