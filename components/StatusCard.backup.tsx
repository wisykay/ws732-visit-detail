
import React from 'react';

interface StatusCardProps {
  label: string;
  value: string | number;
  type: 'valid' | 'score' | 'invalid';
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  size?: 'normal' | 'small';
}

const StatusCard: React.FC<StatusCardProps> = ({ label, value, type, active, onClick, children, size = 'normal' }) => {
  const isClickable = !!onClick;

  const heightClass = size === 'small' ? 'min-h-[90px]' : 'min-h-[135px]';
  const paddingClass = size === 'small' ? 'px-2 py-2' : 'px-2 py-4';
  const valueTextSize = size === 'small' ? 'text-[32px]' : 'text-[44px]';
  const labelTextSize = size === 'small' ? 'text-[10px]' : 'text-[12px]';

  const baseStyles = `flex-1 rounded-[20px] ${paddingClass} flex flex-col items-center justify-center text-center ${heightClass} transition-all duration-300 relative overflow-hidden`;

  const typeStyles = {
    valid: `${active ? 'bg-[#EEFDF6] border-[3px] border-[#10B981]' : 'bg-[#EEFDF6] border border-[#BCF5D9]'}`,
    score: "bg-white border border-slate-200 shadow-sm",
    invalid: `${active ? 'bg-[#FEF2F2] border-[3px] border-[#EF4444]' : 'bg-[#FEF2F2] border border-[#FEE2E2]'}`,
  };

  const textStyles = {
    valid: "text-[#064E3B]",
    score: "text-[#0F172A]",
    invalid: "text-[#9F1239]",
  };

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`${baseStyles} ${typeStyles[type]} ${isClickable ? 'cursor-pointer active:scale-[0.98] hover:opacity-95' : ''}`}
    >
      {children ? (
        <div className="flex items-center justify-center w-full h-full">
          {children}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <span className={`${valueTextSize} font-bold ${textStyles[type]} leading-none tracking-tighter mb-1`}>
            {value}
          </span>
          <span className={`${labelTextSize} font-bold ${textStyles[type]} opacity-60 uppercase tracking-[0.1em]`}>
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
