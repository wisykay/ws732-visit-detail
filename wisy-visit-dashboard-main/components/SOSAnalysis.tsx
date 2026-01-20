
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import CircularProgress from './CircularProgress';

interface SOSCategory {
  label: string;
  value: string;
  percent: number;
}

const CATEGORIES: SOSCategory[] = [
  { label: 'COLAS NEGRAS', value: '55.2%', percent: 55.2 },
  { label: 'COLAS BLANCAS', value: '12.2%', percent: 12.2 },
  { label: 'SABORES', value: '32.5%', percent: 32.5 },
  { label: 'TODOS LOS REFRESCOS', value: '100%', percent: 100 },
];

const SOSAnalysis: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<SOSCategory>(CATEGORIES[3]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col items-center">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">
          Participación Interna: <span className="text-blue-600">{selectedCat.label}</span>
        </h3>
        <div className="relative cursor-pointer transition-transform hover:scale-[1.02]">
          <CircularProgress 
            current={Math.round(selectedCat.percent)} 
            total={100} 
            size={220} 
            color="blue" 
            showText={false}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             <span className="text-4xl font-bold text-blue-600 tracking-tighter">{selectedCat.value}</span>
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{selectedCat.label}</span>
          </div>
        </div>
        <p className="text-[13px] font-semibold text-slate-400 mt-6 text-center italic">
          Seleccione una categoría para actualizar el gráfico.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-w-lg mx-auto">
        {CATEGORIES.map((cat, idx) => {
          const isSelected = selectedCat.label === cat.label;
          return (
            <button 
              key={idx}
              onClick={() => setSelectedCat(cat)}
              className={`w-full flex items-center justify-between px-6 py-5 border rounded-[16px] transition-all group ${
                isSelected 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-[#EEFDF6] border-[#BCF5D9] text-[#064E3B] hover:opacity-90'
              }`}
            >
              <span className={`text-[15px] font-bold uppercase tracking-tight ${isSelected ? 'text-white' : 'text-[#064E3B]'}`}>
                {cat.label}: <span className={isSelected ? 'text-white/90' : 'text-[#10B981]'}>{cat.value}</span>
              </span>
              <ArrowRight size={18} className={`${isSelected ? 'text-white' : 'text-[#064E3B]'} group-hover:translate-x-1 transition-transform`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SOSAnalysis;
