
import React from 'react';

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  color?: 'orange' | 'red' | 'green' | 'blue';
  showText?: boolean;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ 
  current, 
  total, 
  size = 56, 
  color = 'green',
  showText = true 
}) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  const progress = Math.min(100, Math.max(0, (current / total) * 100));
  const offset = circumference - (progress / 100) * circumference;

  const colorClasses = {
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    green: 'text-[#10B981]'
  };

  const fontSize = size < 60 ? 'text-[10px]' : 'text-[12px]';

  return (
    <div className="relative inline-flex items-center justify-center select-none">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClasses[color]} transition-all duration-700 ease-out`}
        />
      </svg>
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${fontSize} font-bold text-slate-700 tracking-tight`}>
            {current}/{total}
          </span>
        </div>
      )}
    </div>
  );
};

export default CircularProgress;
