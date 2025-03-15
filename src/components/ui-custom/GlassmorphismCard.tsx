
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'strong';
}

const GlassmorphismCard = ({
  children,
  className,
  hoverEffect = true,
  intensity = 'medium',
  ...props
}: GlassmorphismCardProps) => {
  const intensityClasses = {
    light: 'bg-white/30 backdrop-blur-sm border-white/10 shadow-sm',
    medium: 'bg-white/50 backdrop-blur-md border-white/20 shadow-glass',
    strong: 'bg-white/70 backdrop-blur-lg border-white/30 shadow-lg',
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-300 animate-fade-in',
        intensityClasses[intensity],
        hoverEffect && 'hover:shadow-glass-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphismCard;
