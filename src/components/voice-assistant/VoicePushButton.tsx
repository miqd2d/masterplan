
import React, { useState } from 'react';
import { MicIcon, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoicePushButtonProps {
  onStart: () => void;
  onStop: () => void;
  isListening: boolean;
}

const VoicePushButton = ({ onStart, onStop, isListening }: VoicePushButtonProps) => {
  const [isPressing, setIsPressing] = useState(false);

  const handlePointerDown = () => {
    setIsPressing(true);
    onStart();
  };

  const handlePointerUp = () => {
    setIsPressing(false);
    onStop();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isListening 
            ? "bg-primary/90 text-primary-foreground shadow-lg" 
            : "bg-secondary/80 text-primary shadow-md",
          isListening && "scale-110"
        )}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={isListening ? handlePointerUp : undefined}
      >
        {isListening ? (
          <>
            <Square className="h-6 w-6 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-20"></div>
          </>
        ) : (
          <MicIcon className="h-6 w-6" />
        )}
      </button>
      <span className="mt-2 text-xs font-medium text-center">
        {isListening ? "Release to stop" : "Push to talk"}
      </span>
    </div>
  );
};

export default VoicePushButton;
