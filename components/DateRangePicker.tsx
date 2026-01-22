import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

export interface DateRange {
    start: Date | null;
    end: Date | null;
}

interface DateRangePickerProps {
    dateRange: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
}

type Preset = 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month';

const DateRangePicker: React.FC<DateRangePickerProps> = ({ dateRange, onChange, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
        });
    };

    const selectedLabel = dateRange.start && dateRange.end
        ? `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`
        : 'Seleccionar fechas';

    const applyPreset = (preset: Preset) => {
        const today = new Date();
        const start = new Date(today);
        const end = new Date(today);

        switch (preset) {
            case 'today':
                // Start/End are already today
                break;
            case 'yesterday':
                start.setDate(today.getDate() - 1);
                end.setDate(today.getDate() - 1);
                break;
            case 'this_week':
                const day = today.getDay();
                const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
                start.setDate(diff);
                end.setDate(start.getDate() + 6);
                break;
            case 'last_week':
                const lastWeekDay = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1) - 7;
                start.setDate(lastWeekDay);
                end.setDate(start.getDate() + 6);
                break;
            case 'this_month':
                start.setDate(1);
                end.setMonth(today.getMonth() + 1);
                end.setDate(0);
                break;
        }

        // Reset hours for comparison consistency
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        onChange({ start, end });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm transition-all hover:border-slate-300 ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                    }`}
            >
                <Calendar size={16} className="text-slate-500" />
                <span className="text-sm font-medium text-slate-700 min-w-[140px] text-left">
                    {selectedLabel}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="space-y-1">
                        <button
                            onClick={() => applyPreset('today')}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                        >
                            Hoy
                        </button>
                        <button
                            onClick={() => applyPreset('yesterday')}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                        >
                            Ayer
                        </button>
                        <button
                            onClick={() => applyPreset('this_week')}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                        >
                            Esta semana
                        </button>
                        <button
                            onClick={() => applyPreset('this_month')}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md transition-colors"
                        >
                            Este mes
                        </button>
                    </div>

                    <div className="my-2 border-t border-slate-100" />

                    <div className="p-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                            Personalizado
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Desde</span>
                                <input
                                    type="date"
                                    className="w-full text-xs border border-slate-200 rounded p-1"
                                    onChange={(e) => {
                                        const date = e.target.valueAsDate;
                                        if (date) {
                                            // Fix timezone issue by adding time component
                                            const newDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                                            onChange({ ...dateRange, start: newDate });
                                        }
                                    }}
                                    value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                                />
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 mb-1 block">Hasta</span>
                                <input
                                    type="date"
                                    className="w-full text-xs border border-slate-200 rounded p-1"
                                    onChange={(e) => {
                                        const date = e.target.valueAsDate;
                                        if (date) {
                                            const newDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
                                            newDate.setHours(23, 59, 59, 999);
                                            onChange({ ...dateRange, end: newDate });
                                        }
                                    }}
                                    value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
