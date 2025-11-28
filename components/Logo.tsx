import React from 'react';
import { Car, Scan, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', animated = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 40
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      <div className={`absolute inset-0 bg-indigo-600 rounded-xl opacity-10 ${animated ? 'animate-pulse' : ''}`}></div>
      {animated && (
        <div className="absolute inset-0 border-2 border-indigo-400/30 rounded-xl animate-[spin_8s_linear_infinite]"></div>
      )}
      <Scan 
        className={`absolute text-indigo-500 ${animated ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}`} 
        size={iconSizes[size] * 1.5} 
        strokeWidth={1}
      />
      <Car 
        className={`relative text-indigo-700 z-10 drop-shadow-sm ${animated ? 'animate-bounce' : ''}`} 
        style={{ animationDuration: '3s' }}
        size={iconSizes[size]} 
      />
      {animated && (
        <Sparkles 
          className="absolute -top-1 -right-1 text-amber-400 animate-ping" 
          size={iconSizes[size] / 2} 
        />
      )}
    </div>
  );
};

export default Logo;