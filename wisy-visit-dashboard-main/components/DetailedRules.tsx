
import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronUp, ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// Export Rule interface to fix type mismatches in App.tsx
export interface Rule {
  id: number | string;
  label: string;
  status: 'passed' | 'failed';
}

interface DetailedRulesProps {
  forcedFilter?: 'all' | 'passed' | 'failed';
  onFilterChange?: (filter: 'all' | 'passed' | 'failed') => void;
  customRules?: Rule[];
  onRuleClick?: (rule: Rule) => void;
  activeRuleId?: number | string | null;
}

const DetailedRules: React.FC<DetailedRulesProps> = ({
  forcedFilter = 'all',
  onFilterChange,
  customRules = [],
  onRuleClick,
  activeRuleId
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const passedCount = customRules.filter(r => r.status === 'passed').length;
  const failedCount = customRules.filter(r => r.status === 'failed').length;
  const totalCount = customRules.length;

  const filteredRules = customRules.filter(rule => {
    if (forcedFilter === 'all') return true;
    return rule.status === forcedFilter;
  });

  const FilterButton = ({ id, label, count }: { id: 'all' | 'passed' | 'failed', label: string, count: number }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onFilterChange?.(id); }}
      className={`px-4 py-1.5 rounded-[8px] border text-[12px] font-bold transition-all shadow-sm ${forcedFilter === id
        ? 'bg-[#E0E7FF] border-[#C7D2FE] text-[#4338CA]'
        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
        }`}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="border border-slate-200 rounded-[12px] overflow-hidden bg-white shadow-sm mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <span className="font-bold text-slate-600 text-[13px] tracking-tight">
          {isOpen ? 'Ocultar' : 'Mostrar'} reglas detalladas ({totalCount} total)
        </span>
        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-400">
              <Filter size={14} className="opacity-70" />
              <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500">Filtrar:</span>
            </div>
            <div className="flex gap-2">
              <FilterButton id="all" label="Todas" count={totalCount} />
              <FilterButton id="passed" label="Válidas" count={passedCount} />
              <FilterButton id="failed" label="Inválidas" count={failedCount} />
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {filteredRules.length > 0 ? filteredRules.map((rule) => {
              const isActive = activeRuleId !== null && String(activeRuleId) === String(rule.id);
              return (
                <div
                  key={rule.id}
                  onClick={() => onRuleClick?.(rule)}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-lg text-sm transition-all border group cursor-pointer mb-1 ${isActive
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-transparent hover:bg-slate-50 border-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full p-0.5 ${rule.status === 'passed' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                      {rule.status === 'passed' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <span className={`font-semibold text-left ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{rule.label}</span>
                  </div>
                  <ChevronRight size={16} className={`${isActive ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
                </div>
              );
            }) : (
              <div className="px-6 py-12 text-center text-slate-400 text-sm font-medium italic">
                No se encontraron reglas para este filtro.
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Mostrando {filteredRules.length} resultados
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-300 hover:text-slate-500"><ChevronLeft size={18} /></button>
              <span className="text-[11px] font-black text-slate-800 uppercase">Página 1 de 1</span>
              <button className="text-slate-300 hover:text-slate-500"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedRules;
