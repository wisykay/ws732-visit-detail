import React, { useState, useMemo } from 'react';
import { Plus, Store, ChevronRight, Calendar as CalendarIcon, MoreHorizontal, ArrowUpRight, Search, MapPin, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Download, FileText, Users } from 'lucide-react';
import { VisitListItem } from '../types';
import FilterBar, { FilterOption } from './FilterBar';
import DateCalendar from './DateCalendar';

interface VisitListProps {
  onVisitSelect: (id: string) => void;
}

// RESTRICTED MOCK LIST (Only AA40258 and AA40299)
const MOCK_LIST = [
  {
    id: 'AA40258',
    tienda: 'INVERSIONES DON MANUEL 1959, CA',
    tipo: 'Retailer',
    nota: 100,
    taskNames: ['Analcohólicos', 'Cervezas', 'Vinos y Licores', 'POP', 'Exhibiciones'],
    fechaInicio: '2025-12-30T11:11:00', // Matches "Hoy" if baseDate is Dec 30 2025
    fechaFin: '2025-12-30T11:11:00',
    tareas: 8,
    asignadoA: 'Nadja A Belgrave',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.0 Km',
    routeKey: 'SCZ.401.M-J'
  },
  {
    id: 'AA40299',
    tienda: 'GENOVEVA ADASME MEJIAS Supermercado',
    tipo: 'Retailer',
    nota: 100,
    taskNames: ['Cervezas', 'Vinos y Licores', 'POP'],
    fechaInicio: '2025-12-30T11:11:00', // Same day
    fechaFin: '2025-12-30T11:11:00',
    tareas: 8,
    asignadoA: 'SUPERVISOR WISY - 01',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.0 Km',
    routeKey: 'SCZ.401.L-X-V'
  },
  // NEW MOCK DATA
  {
    id: 'AA40305',
    tienda: 'MINI MARKET EL SOL',
    tipo: 'Retailer',
    nota: 85,
    taskNames: ['Analcohólicos', 'Inventario'],
    fechaInicio: '2025-12-30T09:30:00',
    fechaFin: '2025-12-30T10:00:00',
    tareas: 5,
    asignadoA: 'Carlos Ruiz',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Pending',
    statusId: 'stat-pend',
    distancia: '1.2 Km',
    routeKey: 'SCZ.402.M-J'
  },
  {
    id: 'AA40312',
    tienda: 'FARMACIA SANTA FE',
    tipo: 'Pharmacy',
    nota: 92,
    fechaInicio: '2025-12-30T14:15:00',
    fechaFin: '2025-12-30T14:45:00',
    tareas: 12,
    asignadoA: 'Carlos Ruiz',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.5 Km',
    routeKey: 'SCZ.402.M-J'
  },
  {
    id: 'BB10201',
    tienda: 'SUPERMERCADO NORTE',
    tipo: 'Wholesaler',
    nota: 78,
    fechaInicio: '2025-12-30T10:00:00',
    fechaFin: '2025-12-30T11:30:00',
    tareas: 20,
    asignadoA: 'Ana Torres',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Pending',
    statusId: 'stat-pend',
    distancia: '5.0 Km',
    routeKey: 'LPZ.101.L-X-V'
  },
  {
    id: 'BB10205',
    tienda: 'BODEGA CENTRAL 4',
    tipo: 'Wholesaler',
    nota: 100,
    fechaInicio: '2025-12-31T08:00:00',
    fechaFin: '2025-12-31T09:00:00',
    tareas: 15,
    asignadoA: 'Ana Torres',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Pending',
    statusId: 'stat-pend',
    distancia: '3.2 Km',
    routeKey: 'LPZ.101.L-X-V'
  },
  {
    id: 'CC50012',
    tienda: 'KIOSKO LA ESQUINA',
    tipo: 'Retailer',
    nota: 60,
    fechaInicio: '2025-12-31T11:00:00',
    fechaFin: '2025-12-31T11:15:00',
    tareas: 3,
    asignadoA: 'Mario Gomez',
    supervisorId: 'sup-3',
    supervisor: 'Pedro Lead',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.1 Km',
    routeKey: 'CBA.205.S'
  },
  {
    id: 'CC50015',
    tienda: 'ABARROTES DOÑA MARIA',
    tipo: 'Retailer',
    nota: 95,
    fechaInicio: '2025-12-30T16:00:00',
    fechaFin: '2025-12-30T16:20:00',
    tareas: 6,
    asignadoA: 'Mario Gomez',
    supervisorId: 'sup-3',
    supervisor: 'Pedro Lead',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.8 Km',
    routeKey: 'CBA.205.S'
  },
  {
    id: 'DD90100',
    tienda: 'LICORERIA EL REY',
    tipo: 'Specialty',
    nota: 0,
    fechaInicio: '2025-12-29T20:00:00',
    fechaFin: '2025-12-29T20:30:00',
    tareas: 4,
    asignadoA: 'Pedro Pascal',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    executionStatus: 'No Visitada',
    distancia: '10.5 Km',
    routeKey: 'SCZ.405.V-S'
  },
  {
    id: 'EE30202',
    tienda: 'FARMACIA UNO',
    tipo: 'Pharmacy',
    nota: 100,
    fechaInicio: '2025-12-30T13:00:00',
    fechaFin: '2025-12-30T13:30:00',
    tareas: 10,
    asignadoA: 'Sofia Vergara',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Pending',
    statusId: 'stat-pend',
    distancia: '2.1 Km',
    routeKey: 'TJA.601.L-J'
  },
  {
    id: 'FF77011',
    tienda: 'MERCADITO 24/7',
    tipo: 'Retailer',
    nota: 45,
    fechaInicio: '2025-12-30T09:00:00',
    fechaFin: '2025-12-30T09:10:00',
    tareas: 2,
    asignadoA: 'Pedro Pascal',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '0.0 Km',
    routeKey: 'SCZ.405.V-S'
  },
  {
    id: 'GG88022',
    tienda: 'HIPERMAXI SUR',
    tipo: 'Supermarket',
    nota: 99,
    fechaInicio: '2026-01-02T10:00:00',
    fechaFin: '2026-01-02T12:00:00',
    tareas: 50,
    asignadoA: 'Nadja A Belgrave',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Pending',
    statusId: 'stat-pend',
    distancia: '15.2 Km',
    routeKey: 'SCZ.401.M-J'
  },
  // Additional December visits to populate "Este mes"
  {
    id: 'AA40311',
    tienda: 'MINIMARKET CENTRAL',
    tipo: 'Retailer',
    nota: 88,
    fechaInicio: '2025-12-15T09:00:00',
    fechaFin: '2025-12-15T10:30:00',
    tareas: 6,
    asignadoA: 'Carlos Ruiz',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '2.5 Km',
    routeKey: 'SCZ.402.L-V'
  },
  {
    id: 'AA40312',
    tienda: 'SUPERMERCADO LA PLAZA',
    tipo: 'Retailer',
    nota: 92,
    fechaInicio: '2025-12-18T14:00:00',
    fechaFin: '2025-12-18T15:30:00',
    tareas: 7,
    asignadoA: 'SUPERVISOR WISY - 01',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '5.8 Km',
    routeKey: 'SCZ.403.M-J'
  },
  {
    id: 'AA40313',
    tienda: 'TIENDA DON PEDRO',
    tipo: 'Retailer',
    nota: 78,
    fechaInicio: '2025-12-20T11:00:00',
    fechaFin: '2025-12-20T12:00:00',
    tareas: 5,
    asignadoA: 'Nadja A Belgrave',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '1.2 Km',
    routeKey: 'SCZ.401.M-J'
  },
  {
    id: 'AA40314',
    tienda: 'ABARROTERIA SAN MARTIN',
    tipo: 'Wholesaler',
    nota: 95,
    fechaInicio: '2025-12-22T08:30:00',
    fechaFin: '2025-12-22T10:00:00',
    tareas: 9,
    asignadoA: 'Carlos Ruiz',
    supervisorId: 'sup-1',
    supervisor: 'Carlos Manager',
    estado: 'Completed',
    statusId: 'stat-comp',
    distancia: '8.3 Km',
    routeKey: 'SCZ.402.L-V'
  },
  {
    id: 'AA40315',
    tienda: 'MARKET EXPRESS',
    tipo: 'Retailer',
    nota: 0,
    fechaInicio: '2025-12-23T16:00:00',
    fechaFin: '2025-12-23T17:00:00',
    tareas: 4,
    asignadoA: 'SUPERVISOR WISY - 01',
    supervisorId: 'sup-2',
    supervisor: 'Ana Director',
    estado: 'Completed',
    statusId: 'stat-comp',
    executionStatus: 'No Visitada',
    distancia: '12.0 Km',
    routeKey: 'SCZ.403.M-J'
  }
];

// Helper to parse "SCZ.401.M-J"
const parseRouteKey = (key?: string) => {
  if (!key) return null;
  const parts = key.split('.');
  if (parts.length < 3) return { region: key, route: '', days: '' };

  const [regionCode, routeCode, dayCodes] = parts;

  // Map Region Codes
  const regionMap: Record<string, string> = {
    'SCZ': 'Santa Cruz',
    // Add others as needed
  };

  // Map day codes to names
  const dayMap: Record<string, string> = {
    'L': 'Lun', 'M': 'Mar', 'X': 'Mié', 'J': 'Jue', 'V': 'Vie', 'S': 'Sáb', 'D': 'Dom'
  };

  const region = regionMap[regionCode] || regionCode;
  const days = dayCodes.split('-').map(c => dayMap[c] || c).join(', ');

  return { region, route: `Ruta ${routeCode} `, days };
};

const VisitList: React.FC<VisitListProps> = ({ onVisitSelect }) => {
  // Navigation / Date State
  const [activeTab, setActiveTab] = useState('Hoy');
  const [baseDate, setBaseDate] = useState(new Date(2025, 11, 30)); // Fixed base date for mock data: Dec 30, 2025

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);

  // Sorting State
  const [sortConfig, setSortConfig] = useState<{ key: keyof VisitListItem; direction: 'asc' | 'desc' } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // UI State
  const [actionsOpen, setActionsOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Helpers for Day Data
  const getDayData = (date: Date, offset: number) => {
    const d = new Date(date);
    d.setDate(date.getDate() + offset);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const mockFormat = `${year} -${month} -${day} `;

    return {
      isoDate: mockFormat,
      displayDate: `${day} /${month}/${year} `,
      fullDisplay: d.toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  // Derived Info for Header
  const activeDateInfo = useMemo(() => {
    const offset = activeTab === 'Hoy' ? 0 : activeTab === 'Mañana' ? 1 : 0;
    // If specific date selected (Otro dia), offset is always 0 relative to baseDate
    return getDayData(baseDate, offset);
  }, [activeTab, baseDate]);

  // Calculate counts for Tabs
  const counts = useMemo(() => {
    // Ideally this counts relative to the "real" today, but mock data is static.
    // For demo, we count based on the specific Mock dates.
    const todayISO = '2025-12-30';
    const tomorrowISO = '2025-12-31';
    const monthISO = '2025-12'; // All December visits

    return {
      hoy: MOCK_LIST.filter(v => v.fechaInicio.startsWith(todayISO)).length,
      manana: MOCK_LIST.filter(v => v.fechaInicio.startsWith(tomorrowISO)).length,
      // Esta semana = last 7 days (Dec 24-30) + Mañana (Dec 31)
      semana: MOCK_LIST.filter(v => {
        const date = new Date(v.fechaInicio);
        const dec24 = new Date(2025, 11, 24);
        const dec31 = new Date(2025, 11, 31, 23, 59, 59);
        return date >= dec24 && date <= dec31;
      }).length,
      mes: MOCK_LIST.filter(v => v.fechaInicio.startsWith(monthISO)).length
    };
  }, []);

  // Dynamic Filters Generation
  const dynamicFilters = useMemo(() => {
    const routes = new Set<string>();
    const days = new Set<string>();
    const supervisors = new Set<string>();

    MOCK_LIST.forEach(v => {
      if (v.routeKey) {
        const info = parseRouteKey(v.routeKey);
        if (info) {
          routes.add(v.routeKey);
          // day logic: "M-J" -> "Mar", "Jue" or just "Mar - Jue" combined
          // We'll filter by the exact combined string for simplicity first, or individual chars?
          // Getting unique formatted day strings
          days.add(v.routeKey.split('.')[2]); // "M-J", "L-X-V"
        }
      }
      supervisors.add(v.supervisorId + '|' + v.asignadoA);
    });

    const options: FilterOption[] = [
      { id: 'stat-comp', label: 'Completed', group: 'status' },
      { id: 'stat-pend', label: 'Pending', group: 'status' },
      { id: 'type-ret', label: 'Retailer', group: 'type' },
    ];

    // Add Supervisors
    Array.from(supervisors).forEach(s => {
      const [id, name] = s.split('|');
      options.push({ id, label: name, group: 'supervisor' });
    });

    // Add Routes
    Array.from(routes).forEach(r => {
      const info = parseRouteKey(r);
      if (info) {
        options.push({ id: r, label: `${info.region} • ${info.route} `, group: 'route' });
      }
    });

    // Add Days
    Array.from(days).forEach(d => {
      // rough map
      const map: Record<string, string> = { 'L': 'Lun', 'M': 'Mar', 'X': 'Mié', 'J': 'Jue', 'V': 'Vie', 'S': 'Sáb', 'D': 'Dom' };
      // "M-J" -> "Mar, Jue"
      const label = d.split('-').map(c => map[c] || c).join(', ');
      options.push({ id: d, label, group: 'day' });
    });

    return options;
  }, []);

  // Main Filter Logic combining Tabs + FilterBar + Sorting
  const filteredVisits = useMemo(() => {
    let result = MOCK_LIST.filter(visit => {
      // 1. Tab / Date Filter
      if (activeTab === 'Otro día') {
        const selectedIso = getDayData(baseDate, 0).isoDate;
        if (!visit.fechaInicio.startsWith(selectedIso)) return false;
      } else if (activeTab === 'Hoy') {
        if (!visit.fechaInicio.startsWith('2025-12-30')) return false;
      } else if (activeTab === 'Mañana') {
        if (!visit.fechaInicio.startsWith('2025-12-31')) return false;
      }

      // 2. Search Filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          visit.tienda.toLowerCase().includes(term) ||
          visit.id.toLowerCase().includes(term) ||
          visit.asignadoA.toLowerCase().includes(term) ||
          (visit.routeKey && visit.routeKey.toLowerCase().includes(term));
        if (!matchesSearch) return false;
      }

      // 3. Category/Tag Filters
      if (activeFilters.length > 0) {
        const supervisorFilters = activeFilters.filter(f => f.group === 'supervisor').map(f => f.id);
        const statusFilters = activeFilters.filter(f => f.group === 'status').map(f => f.id);
        const routeFilters = activeFilters.filter(f => f.group === 'route').map(f => f.id);
        const dayFilters = activeFilters.filter(f => f.group === 'day').map(f => f.id);

        if (supervisorFilters.length > 0 && !supervisorFilters.includes(visit.supervisorId)) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(visit.statusId)) return false;
        if (routeFilters.length > 0 && (!visit.routeKey || !routeFilters.includes(visit.routeKey))) return false;
        if (dayFilters.length > 0 && (!visit.routeKey || !dayFilters.some(d => visit.routeKey.includes(d)))) return false;
      }

      return true;
    });

    // 4. Sorting
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;

        let comparison = 0;

        if (sortConfig.key === 'fechaInicio') {
          comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        } else {
          comparison = String(aValue).localeCompare(String(bValue));
        }

        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [activeTab, baseDate, searchTerm, activeFilters, sortConfig]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredVisits.length / ITEMS_PER_PAGE);
  const paginatedVisits = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredVisits.slice(startIndex, endIndex);
  }, [filteredVisits, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, activeFilters, sortConfig]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate KPIs from filtered visits
  const kpis = useMemo(() => {
    const total = filteredVisits.length;
    const completed = filteredVisits.filter(v => v.estado === 'Completed').length;
    const pending = filteredVisits.filter(v => v.estado === 'Pending').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const completedVisits = filteredVisits.filter(v => v.estado === 'Completed' && v.nota > 0);
    const avgScore = completedVisits.length > 0
      ? Math.round(completedVisits.reduce((sum, v) => sum + v.nota, 0) / completedVisits.length)
      : 0;

    return { total, completed, pending, completionRate, avgScore };
  }, [filteredVisits]);


  const handleSort = (key: keyof VisitListItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      time: d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      full: d.toLocaleString()
    };
  };

  const TabButton = ({ label, count, active, onClick }: { label: string; count?: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center py-4 px-6 transition-all duration-200 rounded-lg ${active
        ? 'bg-slate-50/80'
        : 'hover:bg-slate-50/50'
        }`}
    >
      {count !== undefined && <span className={`text-2xl font-bold leading-none mb-1.5 tracking-tight ${active ? 'text-slate-900' : 'text-slate-500'}`}>{count}</span>}
      <span className={`text-xs font-semibold whitespace-nowrap ${active ? 'text-blue-600' : 'text-slate-500'}`}>{label}</span>
      {active && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-full" />}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">

      {/* Header Area */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Administración de visitas</h1>
            <p className="text-slate-500 text-sm mt-1 capitalize">
              {activeTab === 'Esta semana' ? 'Visitas de la semana' : activeDateInfo.fullDisplay}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 border border-slate-200 transition-all"
              >
                <MoreHorizontal size={18} />
                <span className="hidden sm:inline">Acciones</span>
                <ChevronDown size={16} className={`transition - transform ${actionsOpen ? 'rotate-180' : ''} `} />
              </button>

              {/* Dropdown Menu */}
              {actionsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActionsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <Download size={16} className="text-slate-400" />
                      Exportar a Excel
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <FileText size={16} className="text-slate-400" />
                      Generar reporte PDF
                    </button>
                    <div className="h-px bg-slate-100 my-2" />
                    <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                      <Users size={16} className="text-slate-400" />
                      Asignación masiva
                    </button>
                  </div>
                </>
              )}
            </div>

            <button className="bg-[#2B57F5] hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-95">
              <Plus size={18} strokeWidth={2.5} />
              <span className="hidden sm:inline">Nueva visita</span>
            </button>
          </div>
        </div>

        {/* KPI Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Total Visits Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Visitas</span>
              <Store size={18} className="text-slate-400" />
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900 tracking-tight">{kpis.total}</p>
              <p className="text-xs text-slate-500 font-medium">Programadas</p>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completadas</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline gap-2">
                <p className={`text-3xl font-bold tracking-tight ${kpis.completionRate === 100 ? 'text-emerald-600' :
                  kpis.completionRate >= 50 ? 'text-slate-900' :
                    'text-red-600'
                  }`}>{kpis.completionRate}<span className="text-xl opacity-70">%</span></p>
                <span className="text-xs text-slate-400 font-medium">({kpis.completed}/{kpis.total})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${kpis.completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promedio</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1.5">
                <p className={`text-3xl font-bold tracking-tight ${kpis.avgScore >= 75 ? 'text-emerald-600' :
                  kpis.avgScore >= 50 ? 'text-orange-600' :
                    'text-red-600'
                  }`}>{kpis.avgScore}</p>
                <span className="text-sm font-medium text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Puntuación</p>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pendientes</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              {kpis.pending > 0 ? (
                <>
                  <p className="text-3xl font-bold text-orange-600 tracking-tight">{kpis.pending}</p>
                  <p className="text-xs text-orange-600 font-medium">Por completar</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-emerald-600 tracking-tight">0</p>
                  <p className="text-xs text-emerald-600 font-medium">Todo completo</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Tabs, Filters & Table - White Container */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
        <div className="flex flex-col gap-6">

          {/* Navigation Tabs */}
          <div className="flex items-stretch gap-3 w-full md:w-auto">
            <TabButton
              label="Hoy"
              count={counts.hoy}
              active={activeTab === 'Hoy'}
              onClick={() => { setActiveTab('Hoy'); setBaseDate(new Date(2025, 11, 30)); }}
            />
            <TabButton
              label="Mañana"
              count={counts.manana}
              active={activeTab === 'Mañana'}
              onClick={() => { setActiveTab('Mañana'); setBaseDate(new Date(2025, 11, 30)); }}
            />
            <TabButton
              label="Esta semana"
              count={counts.semana}
              active={activeTab === 'Esta semana'}
              onClick={() => setActiveTab('Esta semana')}
            />
            <TabButton
              label="Este mes"
              count={counts.mes}
              active={activeTab === 'Este mes'}
              onClick={() => setActiveTab('Este mes')}
            />

            <div className="w-px bg-slate-200/60 mx-1" />

            <div className="relative">
              <button
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className={`h-full flex flex-col items-center justify-center px-6 rounded-lg transition-all duration-200 ${activeTab === 'Otro día'
                  ? 'bg-slate-50/80'
                  : 'hover:bg-slate-50/50'
                  }`}
                title="Seleccionar fecha base"
              >
                <div className="flex items-center gap-2 mb-1">
                  <CalendarIcon size={16} className={activeTab === 'Otro día' ? 'text-blue-600' : 'text-slate-400'} />
                  {activeTab === 'Otro día' && (
                    <span className="text-xs font-bold text-slate-900">{activeDateInfo.displayDate}</span>
                  )}
                </div>
                <span className={`text-xs font-semibold ${activeTab === 'Otro día' ? 'text-blue-600' : 'text-slate-500'}`}>Otro día</span>
                {activeTab === 'Otro día' && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-full" />}
              </button>

              {/* Simplified Date Picker Popover */}
              {isDatePickerOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-slate-800">
                      Seleccionar fecha
                    </span>
                    <button
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <Plus size={18} className="rotate-45" />
                    </button>
                  </div>

                  <DateCalendar
                    selectedDate={baseDate}
                    onSelect={(date) => {
                      setBaseDate(date);
                      setActiveTab('Otro día');
                      setIsDatePickerOpen(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Filter Toolbar */}
          <FilterBar
            onSearch={setSearchTerm}
            onFilterChange={setActiveFilters}
            availableFilters={dynamicFilters}
            className="w-full"
          />

        </div>

        {/* Main Table Card */}
        <div className="border border-slate-200/60 rounded-xl overflow-hidden flex flex-col mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200/60 group">
                  {/* Manual Th Implementation for Sorting */}
                  {[
                    { label: 'Tienda / Detalles', key: 'tienda', width: 'w-[30%]' },
                    { label: 'Tareas', key: 'tareas', width: 'w-[10%]' },
                    { label: 'Usuario', key: 'asignadoA', width: 'w-[18%]' },
                    { label: 'Fecha', key: 'fechaInicio', width: 'w-[12%]' },
                    { label: 'Nota', key: 'nota', width: 'w-[12%]' },
                    { label: 'Estado', key: 'estado', width: 'w-[13%]' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-blue-50 hover:text-slate-700 transition-colors select-none ${col.width} ${col.key === 'tienda' ? 'pl-6' : ''}`}
                      onClick={() => handleSort(col.key as any)}
                    >
                      <div className="flex items-center gap-2">
                        {sortConfig?.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ArrowUp size={13} className="text-blue-600" /> : <ArrowDown size={13} className="text-blue-600" />
                        ) : (
                          <ArrowUpDown size={13} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
                        )}
                        {col.label}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right w-[5%]"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/60">
                {paginatedVisits.length > 0 ? paginatedVisits.map((item, idx) => {
                  const { date, time } = formatDateDisplay(item.fechaInicio);
                  const routeInfo = parseRouteKey(item.routeKey);

                  return (
                    <tr
                      key={idx}
                      onClick={() => onVisitSelect(item.id)}
                      className="hover:bg-slate-50/80 hover:border-l-2 hover:border-l-blue-500 transition-all group cursor-pointer border-l-2 border-l-transparent"
                    >
                      {/* Tienda Column (Consolidated) */}
                      <td className="pl-6 pr-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg text-slate-400 flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <Store size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight mb-1.5">
                              {item.tienda}
                            </p>

                            <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs">
                              {/* ID Badge */}
                              <span className="font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                {item.id}
                              </span>

                              <span className="text-slate-300">|</span>

                              {/* Segment */}
                              <span className="text-slate-600 font-medium">{item.tipo}</span>

                              {/* Route Info (if exists) */}
                              {routeInfo && (
                                <>
                                  <span className="text-slate-300">|</span>
                                  <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[10px]">
                                    <MapPin size={10} className="text-slate-400" />
                                    <span className="font-semibold text-slate-700">{routeInfo.region}</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="font-medium text-slate-600">{routeInfo.route}</span>
                                    <span className="text-slate-400 font-medium">({routeInfo.days})</span>
                                  </div>
                                </>
                              )}

                              {/* Distance - only show if > 0 */}
                              {item.distancia && parseFloat(item.distancia) > 0 && (
                                <>
                                  <span className="text-slate-300">|</span>
                                  <span className="text-slate-400 text-[10px]">{item.distancia}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Tareas Column */}
                      <td className="px-4 py-4 align-middle">
                        <div className="relative group/tasks inline-block">
                          <div className="flex items-center gap-2 cursor-help">
                            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-sm transition-all group-hover/tasks:bg-blue-50 group-hover/tasks:border-blue-100 group-hover/tasks:text-blue-600 group-hover/tasks:shadow-sm">
                              {item.tareas}
                            </div>
                            {item.taskNames && item.taskNames.length > 0 && (
                              <svg className="w-3 h-3 text-slate-400 group-hover/tasks:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>

                          {/* Tooltip - only show if taskNames exists */}
                          {item.taskNames && item.taskNames.length > 0 && (
                            <div className="absolute left-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 p-3 opacity-0 invisible group-hover/tasks:opacity-100 group-hover/tasks:visible transition-all duration-200 z-50">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Encuestas asignadas ({item.taskNames.length})</p>
                              <ul className="space-y-1">
                                {item.taskNames.map((task, i) => (
                                  <li key={i} className="text-xs text-slate-700 font-medium flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                    {task}
                                  </li>
                                ))}
                              </ul>
                              {/* Arrow */}
                              <div className="absolute left-4 bottom-full w-2 h-2 bg-white border-t border-l border-slate-100 transform rotate-45 mb-[-5px] shadow-sm"></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Usuario Column */}
                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold border border-blue-200 shrink-0">
                            {item.asignadoA.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-none">
                              {item.asignadoA}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Sup: {item.supervisor}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Fecha Column */}
                      <td className="px-4 py-4 align-middle">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">{date}</span>
                          <span className="text-xs text-slate-400">{time}</span>
                        </div>
                      </td>

                      {/* Nota Column */}
                      <td className="px-4 py-4 align-middle">
                        {item.estado === 'Pending' ? (
                          <span className="text-sm font-medium text-slate-400">— pts</span>
                        ) : item.executionStatus === 'No Visitada' ? (
                          <span className="text-[10px] font-bold text-blue-600 whitespace-nowrap bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 inline-block">
                            No Visitada
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold whitespace-nowrap ${item.nota >= 75 ? 'text-emerald-700 bg-emerald-50/50' :
                            item.nota >= 50 ? 'text-orange-700 bg-orange-50/50' :
                              'text-red-700 bg-red-50/50'
                            }`}>
                            {item.nota} pts
                          </span>
                        )}
                      </td>

                      {/* Estado Column */}
                      <td className="px-4 py-4 align-middle">
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${item.estado === 'Completed' ? 'text-emerald-700' :
                          item.estado === 'Pending' ? 'text-orange-700' :
                            'text-slate-600'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item.estado === 'Completed' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' :
                            item.estado === 'Pending' ? 'bg-orange-500 shadow-sm shadow-orange-500/20' :
                              'bg-slate-400'
                            }`} />
                          {item.estado === 'Completed' ? 'Completada' : 'Pendiente'}
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="pl-4 pr-6 py-4 text-right align-middle">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-5">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200">
                            <Search size={36} className="text-slate-400" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center">
                            <span className="text-slate-500 text-xs font-bold">0</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-900 font-semibold text-lg">No se encontraron visitas</p>
                          <p className="text-slate-500 text-sm mt-1.5">No hay resultados para <span className="font-medium text-slate-700">{activeTab}</span></p>
                          <p className="text-slate-400 text-xs mt-1">Intenta seleccionar otra fecha o borrar filtros</p>
                        </div>
                        <button
                          onClick={() => { setActiveFilters([]); setSearchTerm(''); }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Limpiar todos los filtros
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-bold text-slate-900">{paginatedVisits.length > 0 ? ((currentPage - 1) * ITEMS_PER_PAGE + 1) : 0}</span> - <span className="font-bold text-slate-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredVisits.length)}</span> de <span className="font-bold text-slate-900">{filteredVisits.length}</span> resultados
            </p>
            <div className="flex items-center gap-2">
              {totalPages > 3 && (
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Primera página"
                >
                  Primera
                </button>
              )}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Anterior
              </button>
              <span className="text-sm text-slate-600 min-w-[100px] text-center">
                Página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold text-slate-900">{totalPages || 1}</span>
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Siguiente
              </button>
              {totalPages > 3 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Última página"
                >
                  Última
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
