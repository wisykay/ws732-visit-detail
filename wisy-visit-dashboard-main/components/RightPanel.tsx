import React, { useState, useMemo } from 'react';
import { LayoutGrid, Beer, GlassWater, Wine, Layers, ShoppingBag, Check, Circle, ChevronRight, ChevronLeft, Search, ChevronDown, ChevronUp, X } from 'lucide-react';

export interface CategoryOption {
    id: string;
    label: string;
    pts?: number;
    total?: number;
    status: 'DONE' | 'PENDING';
    icon: React.ReactNode;
    imageUrl?: string;
    group?: string;
}

interface RightPanelProps {
    categories: CategoryOption[];
    selectedId: string;
    onSelect: (id: string) => void;
    collapsible?: boolean;
    withTabs?: boolean;
    isDrillDown?: boolean;
    gallery?: React.ReactNode;
    viewMode?: 'list' | 'detail';
    onViewModeChange?: (mode: 'list' | 'detail') => void;
    // Controlled collapse
    isCollapsed?: boolean;
    onCollapseChange?: (collapsed: boolean) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
    categories,
    selectedId,
    onSelect,
    collapsible = false,
    withTabs = false,
    isDrillDown = false,
    gallery,
    viewMode: controlledViewMode,
    onViewModeChange,
    isCollapsed: controlledIsCollapsed,
    onCollapseChange
}) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
    const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;

    const [searchTerm, setSearchTerm] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    const handleCollapseToggle = (val: boolean) => {
        setInternalIsCollapsed(val);
        onCollapseChange?.(val);
    };

    const toggleGroup = (group: string) => {
        setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const groupedCategories = useMemo(() => {
        const filtered = categories.filter(c =>
            c.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.group && c.group.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        const groups: Record<string, CategoryOption[]> = {};
        const noGroup: CategoryOption[] = [];

        filtered.forEach(cat => {
            if (cat.group) {
                if (!groups[cat.group]) groups[cat.group] = [];
                groups[cat.group].push(cat);
            } else {
                noGroup.push(cat);
            }
        });

        return { groups, noGroup };
    }, [categories, searchTerm]);

    const hasGroups = Object.keys(groupedCategories.groups).length > 0;

    const [internalViewMode, setInternalViewMode] = useState<'list' | 'detail'>('list');

    // Use controlled view mode if provided, otherwise internal (renaming tab -> mode for concept clarity)
    // For legacy support (if withTabs is still passed), we treat detail as the second tab
    const currentMode = controlledViewMode ?? internalViewMode;

    const handleModeChange = (mode: 'list' | 'detail') => {
        setInternalViewMode(mode);
        onViewModeChange?.(mode);
    };

    const renderListItem = (cat: CategoryOption) => {
        const isActive = selectedId === cat.id;
        return (
            <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`w-full flex items-center px-4 py-3 border-b border-slate-50 transition-all duration-200 group relative ${isActive
                    ? 'bg-blue-50/50'
                    : 'hover:bg-slate-50'
                    }`}
            >
                {/* Left Accent for Selected State */}
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />}

                {/* Thumbnail / Icon Area - Square Border with White BG */}
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
                    {cat.imageUrl ? (
                        <div className="w-full h-full p-1 bg-white">
                            <img src={cat.imageUrl} alt={cat.label} className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        <div className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                            {cat.icon}
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 ml-3 text-left min-w-0">
                    <h4 className={`text-[12px] font-bold leading-tight truncate px-1 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>
                        {cat.label}
                    </h4>

                    {/* Status / Score Row */}
                    <div className="flex items-center mt-1 gap-2 px-1">
                        {/* Completion Badge */}
                        {cat.status === 'DONE' ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">
                                <Check size={8} strokeWidth={3} /> LISTO
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500">
                                <Circle size={8} strokeWidth={3} /> PENDIENTE
                            </span>
                        )}

                        {/* Score Text */}
                        {cat.pts !== undefined && (
                            <div className="ml-auto flex items-center gap-1">
                                <span className={`text-[10px] font-bold tabular-nums ${(cat.total && (cat.pts / cat.total) * 100 < 50) ? 'text-red-600' : 'text-emerald-600'
                                    }`}>
                                    Score: {cat.pts}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </button>
        );
    };

    if (isCollapsed) {
        return (
            <div className="w-[72px] h-full bg-white flex flex-col border-l border-slate-100 transition-all duration-300 ease-in-out">
                <div className="p-4 border-b border-slate-100 flex justify-center bg-slate-50/50 h-[60px] items-center">
                    <button
                        onClick={() => handleCollapseToggle(false)}
                        className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 flex flex-col items-center">
                    {categories.map((cat) => {
                        const isActive = selectedId === cat.id;
                        const isDone = cat.status === 'DONE';
                        return (
                            <button
                                key={cat.id}
                                onClick={() => onSelect(cat.id)}
                                title={cat.label}
                                className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group
                    ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                    }
                  `}
                            >
                                {isActive && (
                                    <div className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-[3px] h-6 bg-blue-600 rounded-r-full" />
                                )}
                                {isDone && (
                                    <div className="absolute -top-1 -right-1 bg-white rounded-full p-[1px]">
                                        <Check size={10} className="text-emerald-600 fill-emerald-50" strokeWidth={4} />
                                    </div>
                                )}
                                {cat.icon}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Header / Collapse Toggle / Search */}
            <div className="flex-shrink-0 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center justify-between px-4 h-[60px]">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={14} className="text-blue-600" />
                        CONTENIDOS
                        <span className="bg-slate-200 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full">{categories.length}</span>
                    </h3>
                    {collapsible && (
                        <button
                            onClick={() => handleCollapseToggle(true)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    )}
                </div>

                {/* Search Input */}
                <div className="px-4 py-3 border-b border-slate-100">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar contenido..."
                            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabs for View Mode (List/Detail) */}
                {withTabs && (
                    <div className="flex border-b border-slate-100 bg-slate-50/50">
                        <button
                            onClick={() => handleModeChange('list')}
                            className={`flex-1 py-2 text-sm font-medium ${currentMode === 'list'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Lista
                        </button>
                        <button
                            onClick={() => handleModeChange('detail')}
                            className={`flex-1 py-2 text-sm font-medium ${currentMode === 'detail'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Detalle
                        </button>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {currentMode === 'list' ? (
                    // List Mode
                    <div className="divide-y divide-slate-50">
                        {groupedCategories.noGroup.map(renderListItem)}

                        {Object.entries(groupedCategories.groups).map(([groupName, cats]: [string, CategoryOption[]]) => (
                            <div key={groupName}>
                                <button
                                    onClick={() => toggleGroup(groupName)}
                                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-100 text-xs font-bold uppercase text-slate-500 hover:bg-slate-100 transition-colors"
                                >
                                    {groupName}
                                    {collapsedGroups[groupName] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                                </button>
                                {!collapsedGroups[groupName] && (
                                    <div className="divide-y divide-slate-50">
                                        {cats.map(renderListItem)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    // Detail Mode (Master-Detail) or Tab Content
                    <div className="h-full w-full animate-in fade-in zoom-in-95 duration-200">
                        {gallery || (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                                <Layers size={32} className="opacity-20" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-center">Evidencia Visual</p>
                                <p className="text-[10px] text-slate-400 text-center px-4">Seleccione una regla para ver su evidencia.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
                <p className="text-[10px] text-slate-400 font-medium">
                    ID Visita: <span className="font-mono text-slate-500">AA42937</span>
                </p>
            </div>
        </div>
    );
};

export default RightPanel;
