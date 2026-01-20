
import React, { useState, useMemo, useRef } from 'react';
import { Search, Plus, Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Filter, Store, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { VisitListItem } from '../types';

interface VisitListProps {
  onVisitSelect: (id: string) => void;
}

const MOCK_LIST = [

  {
    id: 'AA40258',
    tienda: 'INVERSIONES DON MANUEL 1959, CA',
    tipo: 'Retailer',
    nota: 100,
    fechaInicio: '30/12/2025 11:11 a. m.',
    fechaFin: '30/12/2025 11:11 a. m.',
    tareas: 8,
    asignadoA: 'Nadja A Belgrave',
    estado: 'Completed',
    distancia: '0.0 Km'
  },
  {
    id: 'AA40299',
    tienda: 'GENOVEVA ADASME MEJIAS Supermercado',
    tipo: 'Retailer',
    nota: 100,
    fechaInicio: '30/12/2025 11:11 a. m.',
    fechaFin: '30/12/2025 11:11 a. m.',
    tareas: 8,
    asignadoA: 'SUPERVISOR WISY - 01',
    estado: 'Completed',
    distancia: '0.0 Km'
  }
];

const VisitList: React.FC<VisitListProps> = ({ onVisitSelect }) => {
  const [activeTab, setActiveTab] = useState('Hoy');
  const [baseDate, setBaseDate] = useState(new Date(2025, 11, 30)); // Dec 30, 2025
  const dateInputRef = useRef<HTMLInputElement>(null);

  const getDayData = (date: Date, offset: number) => {
    const d = new Date(date);
    d.setDate(date.getDate() + offset);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const mockFormat = `${day}/${month}/${year}`;
    return {
      mockFormat,
      fullDisplay: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const activeDateInfo = useMemo(() => {
    const offset = activeTab === 'Hoy' ? 0 : activeTab === 'Mañana' ? 1 : 0;
    return getDayData(baseDate, offset);
  }, [activeTab, baseDate]);

  const counts = useMemo(() => {
    const today = getDayData(baseDate, 0).mockFormat;
    const tomorrow = getDayData(baseDate, 1).mockFormat;
    return {
      hoy: MOCK_LIST.filter(v => v.fechaInicio.startsWith(today)).length,
      manana: MOCK_LIST.filter(v => v.fechaInicio.startsWith(tomorrow)).length,
      semana: MOCK_LIST.length
    };
  }, [baseDate]);

  const filteredVisits = useMemo(() => {
    if (activeTab === 'Esta semana') return MOCK_LIST;
    return MOCK_LIST.filter(visit => visit.fechaInicio.startsWith(activeDateInfo.mockFormat));
  }, [activeTab, activeDateInfo]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setBaseDate(new Date(e.target.value + 'T00:00:00'));
    }
  };

  const TabButton = ({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center py-2 px-6 transition-all duration-200 rounded-[8px] border ${active
        ? 'bg-white border-slate-200 shadow-sm'
        : 'bg-transparent border-transparent opacity-50 hover:opacity-80'
        }`}
    >
      <span className={`text-2xl font-bold leading-none mb-0.5 ${active ? 'text-blue-600' : 'text-slate-700'}`}>{count}</span>
      <span className={`text-[11px] font-semibold ${active ? 'text-blue-600' : 'text-slate-500'}`}>{label}</span>
    </button>
  );

  const FilterDropdown = ({ label }: { label: string }) => (
    <button className="flex items-center justify-between gap-3 px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-sm font-semibold text-slate-600 hover:border-slate-300 transition-all shadow-sm">
      {label}
      <ChevronDown size={14} className="text-slate-400" />
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Administración de visitas</h1>
          <p className="text-slate-400 text-sm font-medium mt-3">{activeDateInfo.fullDisplay}</p>
        </div>
        <button className="bg-[#2B57F5] hover:bg-blue-700 text-white px-6 py-2.5 rounded-[8px] font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/10 transition-all active:scale-95">
          <Plus size={18} strokeWidth={2} />
          Crear visita
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex bg-slate-100/60 p-1.5 rounded-[12px] gap-1.5 flex-grow lg:flex-grow-0 items-stretch">
          <TabButton label="Hoy" count={counts.hoy} active={activeTab === 'Hoy'} onClick={() => setActiveTab('Hoy')} />
          <TabButton label="Mañana" count={counts.manana} active={activeTab === 'Mañana'} onClick={() => setActiveTab('Mañana')} />
          <TabButton label="Esta semana" count={counts.semana} active={activeTab === 'Esta semana'} onClick={() => setActiveTab('Esta semana')} />

          <div className="w-[1px] bg-slate-300/40 my-2 mx-1" />

          <div className="relative">
            <button
              onClick={() => dateInputRef.current?.showPicker()}
              className="h-full flex flex-col items-center justify-center px-5 rounded-[8px] hover:bg-white/50 transition-all text-slate-500 hover:text-blue-600 group"
              title="Seleccionar fecha"
            >
              <CalendarIcon size={20} className="mb-0.5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase">{activeDateInfo.mockFormat.split('/').slice(0, 2).join('/')}</span>
            </button>
            <input type="date" ref={dateInputRef} onChange={handleDateChange} className="absolute opacity-0 pointer-events-none w-0 h-0" />
          </div>
        </div>

        <div className="flex-grow relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar por tienda, ID o supervisor..."
            className="w-full h-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[12px] text-base focus:outline-none focus:border-blue-500 shadow-sm transition-all min-h-[72px]"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[12px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Tienda / ID</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Nota</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Horario</th>
                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisits.length > 0 ? filteredVisits.map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => onVisitSelect(item.id)}
                  className="hover:bg-blue-50/20 transition-all group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Store size={20} />
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-900 leading-tight group-hover:text-blue-700">{item.tienda}</p>
                        <p className="text-[13px] font-medium text-slate-400 mt-1">{item.id} • {item.distancia}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[13px] font-bold px-3 py-0.5 rounded-[4px] ${item.nota === 0 ? 'text-rose-600 bg-rose-50 border border-rose-100' : 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                      }`}>
                      {item.nota} pts
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{item.fechaInicio.split(' ')[0]}</span>
                      <span className="text-xs font-medium text-slate-400 mt-0.5">{item.fechaInicio.split(' ').slice(1).join(' ')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-blue-600 p-2 hover:bg-blue-100 rounded-[8px] transition-all">
                      <ChevronRight size={18} strokeWidth={2.5} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <CalendarIcon size={40} className="text-slate-200" />
                      <p className="text-slate-400 italic text-base font-medium">No hay visitas agendadas.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VisitList;
