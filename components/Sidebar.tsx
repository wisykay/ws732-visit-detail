
import React, { useState } from 'react';
import { ChevronLeft, LogOut, PanelLeftClose, PanelLeftOpen, LayoutGrid, Store, Briefcase, BarChart2, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  variant?: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, variant = 'light' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDark = variant === 'dark';

  const menuItems = [
    { id: 'overview', icon: <LayoutGrid size={20} />, label: 'Overview' },
    { id: 'puntos', icon: <Store size={20} />, label: 'Puntos de Venta' },
    { id: 'visits', icon: <Briefcase size={20} />, label: 'Visitas' },
    { id: 'reportes', icon: <BarChart2 size={20} />, label: 'Reportes' },
    { id: 'config', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  const baseClasses = isDark
    ? `h-screen bg-[#0B1120] text-slate-400 border-r border-[#1E293B] transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`
    : `h-screen bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'}`;

  const logoClasses = isDark
    ? "flex items-center gap-3 text-white"
    : "flex items-center gap-3 text-slate-800";

  const logoBoxClasses = "w-8 h-8 bg-blue-600 rounded-[6px] flex items-center justify-center flex-shrink-0";

  return (
    <div className={baseClasses}>
      <div className="p-6 flex items-center gap-3">
        <div className={logoBoxClasses}>
          <span className="text-white font-bold text-lg">W</span>
        </div>
        {!isCollapsed && <span className={`font-bold text-xl tracking-tight ${logoClasses}`}>WISY</span>}
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          // Dark mode item styles
          if (isDark) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group ${isActive
                    ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-900/20 font-medium'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-medium text-[13px]">{item.label}</span>}
              </button>
            );
          }
          // Light mode item styles (default)
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors relative ${isActive
                ? 'text-blue-600 bg-blue-50/50'
                : 'text-slate-500 hover:bg-slate-50'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
              )}
              <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.icon}
              </div>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className={`mt-auto border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} p-4 space-y-2`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-4 px-2 py-3 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-50'
            }`}
        >
          {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          {!isCollapsed && <span className="font-medium">Collapse</span>}
        </button>
        <button className={`w-full flex items-center gap-4 px-2 py-3 text-red-500 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800' : 'hover:bg-red-50'
          }`}>
          <LogOut size={20} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
