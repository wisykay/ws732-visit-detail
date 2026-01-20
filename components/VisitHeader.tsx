import React from 'react';
import { ChevronLeft, Download, ListChecks, MapPin, Calendar, User } from 'lucide-react';
import { VisitData } from '../types';
import CircularProgress from './CircularProgress';

interface VisitHeaderProps {
  visit: VisitData;
  onBack?: () => void;
  hideScore?: boolean;
  hideTasks?: boolean;
  facingsCount?: number;
}

const VisitHeader: React.FC<VisitHeaderProps> = ({
  visit,
  onBack,
  hideScore = false,
  hideTasks = false,
  facingsCount
}) => {
  const getScoreTheme = (score: number) => {
    if (score === 0) return { text: 'text-red-700', color: 'red' as const };
    if (score <= 50) return { text: 'text-orange-600', color: 'orange' as const };
    return { text: 'text-emerald-700', color: 'green' as const };
  };

  const theme = getScoreTheme(visit.score);

  return (
    <div className="space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-start gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="mt-1 p-1 -ml-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft size={24} strokeWidth={2.5} />
              </button>
            )}
            <div>
              <h1 className="text-xl font-semibold text-slate-900 leading-tight">
                {visit.customer}
              </h1>
              {(visit as any).subtitle && (
                <p className="text-sm text-slate-500 mt-0.5">{(visit as any).subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar size={14} className="text-slate-400" />
              <span className="font-medium">{visit.date}</span>
            </div>

            <div className="w-px h-3 bg-slate-200" />

            <div className="flex items-center gap-1.5 text-slate-600">
              <User size={14} className="text-slate-400" />
              <span className="font-medium">{visit.supervisor}</span>
            </div>

            <div className="w-px h-3 bg-slate-200" />

            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[11px] font-semibold">
              {visit.status}
            </span>

            <div className="w-px h-3 bg-slate-200" />

            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-slate-500">ID:</span>
              <span className="font-semibold text-slate-900">{visit.id}</span>
            </div>

            <div className="w-px h-3 bg-slate-200" />

            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin size={14} className="text-blue-500" />
              <span className="font-medium truncate max-w-md">{visit.location}</span>
            </div>

            {!hideTasks && (
              <>
                <div className="w-px h-3 bg-slate-200" />
                <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-1 rounded font-medium">
                  <ListChecks size={14} />
                  <span>4 surveys</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {facingsCount !== undefined && (
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200">
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                  Facings
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {facingsCount}
                </div>
              </div>
            </div>
          )}

          {!hideScore && (
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-200">
              <div className="flex flex-col items-end">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                  Score
                </div>
                <div className={`text-xl font-bold ${theme.text}`}>
                  {visit.score}<span className="text-slate-400 font-medium text-sm">/100</span>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <CircularProgress current={visit.score} total={100} size={36} color={theme.color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisitHeader;
