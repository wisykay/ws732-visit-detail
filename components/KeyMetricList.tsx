
import React from 'react';

interface Metric {
  label: string;
  value: number | string;
  status?: 'passed' | 'failed' | 'neutral';
}

interface KeyMetricListProps {
  metrics: Metric[];
  title?: string;
}

const KeyMetricList: React.FC<KeyMetricListProps> = ({ metrics, title = "Key Metric" }) => {
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">{title}</h3>
      <div className="space-y-3">
        {metrics.map((metric, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between group"
          >
            <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
              {metric.label}
            </span>
            <span className={`text-[14px] font-bold text-[#10B981]`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeyMetricList;
