import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown, Check, User, Briefcase, Activity, MapPin, Calendar } from 'lucide-react';

export interface FilterOption {
    id: string;
    label: string;
    group: 'supervisor' | 'status' | 'type' | 'route' | 'day';
}

interface FilterBarProps {
    onSearch: (term: string) => void;
    onFilterChange: (filters: FilterOption[]) => void;
    className?: string;
    availableFilters?: FilterOption[]; // Optional: pass available options dynamically
}

const DEFAULT_FILTERS: FilterOption[] = [
    { id: 'sup-1', label: 'Nadja A Belgrave', group: 'supervisor' },
    { id: 'sup-2', label: 'SUPERVISOR WISY - 01', group: 'supervisor' },
    { id: 'stat-comp', label: 'Completed', group: 'status' },
    { id: 'stat-pend', label: 'Pending', group: 'status' },
    { id: 'type-ret', label: 'Retailer', group: 'type' },
    { id: 'type-wh', label: 'Wholesaler', group: 'type' },
];

const FilterBar: React.FC<FilterBarProps> = ({ onSearch, onFilterChange, className = '', availableFilters = DEFAULT_FILTERS }) => {
    const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'supervisor' | 'status' | 'type' | 'route' | 'day'>('route');
    const [filterSearchTerm, setFilterSearchTerm] = useState('');

    const handleToggleFilter = (option: FilterOption) => {
        let newFilters;
        if (activeFilters.some(f => f.id === option.id)) {
            newFilters = activeFilters.filter(f => f.id !== option.id);
        } else {
            newFilters = [...activeFilters, option];
        }
        setActiveFilters(newFilters);
        onFilterChange(newFilters);
    };

    const removeFilter = (id: string) => {
        const newFilters = activeFilters.filter(f => f.id !== id);
        setActiveFilters(newFilters);
        onFilterChange(newFilters);
    };

    const getFilteredOptions = () => {
        const options = availableFilters.filter(f => f.group === activeTab);
        if (!filterSearchTerm) return options;
        return options.filter(o => o.label.toLowerCase().includes(filterSearchTerm.toLowerCase()));
    };

    const handleTabChange = (tab: typeof activeTab) => {
        setActiveTab(tab);
        setFilterSearchTerm('');
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Search and Main Actions */}
            <div className="flex gap-3">
                <div className="relative flex-grow max-w-2xl">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por tienda, ID o supervisor..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all"
                        onChange={(e) => onSearch(e.target.value)}
                    />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg shadow-sm transition-all font-medium text-sm ${isFilterMenuOpen || activeFilters.length > 0
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <Filter size={16} />
                        <span>Filtros</span>
                        {activeFilters.length > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] bg-blue-600 text-white text-[10px] font-bold px-1 rounded-full">
                                {activeFilters.length}
                            </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Filter Popover */}
                    {isFilterMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-0 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                            {/* Filter Tabs */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto no-scrollbar">
                                <button onClick={() => handleTabChange('route')} className={`flex-1 min-w-[64px] py-3 text-xs font-semibold ${activeTab === 'route' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Ruta</button>
                                <button onClick={() => handleTabChange('supervisor')} className={`flex-1 min-w-[64px] py-3 text-xs font-semibold ${activeTab === 'supervisor' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Usuario</button>
                                <button onClick={() => handleTabChange('status')} className={`flex-1 min-w-[64px] py-3 text-xs font-semibold ${activeTab === 'status' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Estado</button>
                                <button onClick={() => handleTabChange('day')} className={`flex-1 min-w-[64px] py-3 text-xs font-semibold ${activeTab === 'day' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Días</button>
                                <button onClick={() => handleTabChange('type')} className={`flex-1 min-w-[64px] py-3 text-xs font-semibold ${activeTab === 'type' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Tipo</button>
                            </div>

                            <div className="p-2 border-b border-slate-100 bg-white">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Filtrar opciones..."
                                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                                        value={filterSearchTerm}
                                        onChange={(e) => setFilterSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto p-2">
                                {getFilteredOptions().map((opt) => {
                                    const isActive = activeFilters.some(f => f.id === opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleToggleFilter(opt)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg mb-1 transition-colors ${isActive ? 'bg-blue-50 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {opt.group === 'supervisor' && <User size={14} className="text-slate-400" />}
                                                {opt.group === 'status' && <Activity size={14} className="text-slate-400" />}
                                                {opt.group === 'type' && <Briefcase size={14} className="text-slate-400" />}
                                                {opt.group === 'route' && <MapPin size={14} className="text-slate-400" />}
                                                {opt.group === 'day' && <Calendar size={14} className="text-slate-400" />}
                                                <span>{opt.label}</span>
                                            </div>
                                            {isActive && <Check size={14} className="text-blue-600" />}
                                        </button>
                                    )
                                })}
                                {getFilteredOptions().length === 0 && (
                                    <div className="p-4 text-center text-slate-400 text-xs italic">
                                        No se encontraron opciones.
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={() => setIsFilterMenuOpen(false)}
                                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md shadow-sm transition-all"
                                >
                                    Listo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center animate-in slide-in-from-top-2 duration-300">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Filtros activos:</span>
                    {activeFilters.map(filter => (
                        <span
                            key={filter.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 group hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            onClick={() => removeFilter(filter.id)}
                        >
                            {filter.label}
                            <X size={12} className="text-slate-400 group-hover:text-red-500" />
                        </span>
                    ))}
                    <button
                        onClick={() => { setActiveFilters([]); onFilterChange([]); }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-2 hover:underline"
                    >
                        Limpiar todos
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
