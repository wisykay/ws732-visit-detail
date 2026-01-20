
import React, { useState, useMemo } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductItem } from '../types';

const MOCK_PRODUCTS: ProductItem[] = [
  { name: 'Pepsi Lata 355 ML Individual', sku: 'SKU: PEP-CAN-355', facings: 7, image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { name: 'Pepsi Botella PET 1,5 LT Familiar', sku: 'SKU: PEP-1500', facings: 14, image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { name: '7Up Botella PET 1,5 LT Familiar', sku: 'SKU: 7UP-1500', facings: 2, image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066' },
  { name: 'Golden Manzana Botella RET 1250 ML Familiar', sku: 'SKU: GOL-MAN-1250', facings: 1, image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717' },
  { name: 'Pepsi Botella RET 1250 ML Familiar', sku: 'SKU: PEP-1250', facings: 12, image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { name: 'Pepsi Botella PET 2 LT Familiar', sku: 'SKU: PEP-2000', facings: 4, image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { name: '7Up Botella PET 2 LT Familiar', sku: 'SKU: 7UP-2000', facings: '--', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066' },
  { name: 'Pepsi Light Botella PET 2 LT Familiar', sku: 'SKU: PEP-L-2000', facings: '--', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { name: 'Golden Piña Botella PET 1,5 LT Familiar', sku: 'SKU: GOL-P-1500', facings: '--', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717' }
];

const ITEMS_PER_PAGE = 6;

const DistributionList: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'facings' | 'no-facings'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      if (filter === 'all') return matchesSearch;
      if (filter === 'facings') return matchesSearch && typeof p.facings === 'number';
      if (filter === 'no-facings') return matchesSearch && typeof p.facings !== 'number';
      return matchesSearch;
    });
  }, [filter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-slate-100 p-1 rounded-[8px] gap-1">
          <button 
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-[12px] font-bold rounded-[6px] transition-all uppercase tracking-wide ${filter === 'all' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ALL
          </button>
          <button 
            onClick={() => { setFilter('facings'); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-[12px] font-bold rounded-[6px] transition-all uppercase tracking-wide ${filter === 'facings' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            DETECTED
          </button>
          <button 
            onClick={() => { setFilter('no-facings'); setCurrentPage(1); }}
            className={`px-4 py-1.5 text-[12px] font-bold rounded-[6px] transition-all uppercase tracking-wide ${filter === 'no-facings' ? 'bg-white shadow-sm text-blue-600 border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
          >
            NO FACINGS
          </button>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-[8px] text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[12px] shadow-sm overflow-hidden flex flex-col min-h-[480px]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PRODUCT</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">FACINGS</span>
        </div>
        <div className="divide-y divide-slate-50 flex-1">
          {paginatedItems.length > 0 ? paginatedItems.map((item, idx) => (
            <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/30 transition-all group">
              <div className="flex items-center gap-6">
                <div className="relative w-14 h-14 bg-white rounded-[10px] border border-blue-600/20 flex items-center justify-center p-1 group-hover:border-blue-600 transition-all overflow-hidden shadow-sm">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 shadow-sm">
                    <Eye size={10} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">{item.name}</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wide">{item.sku}</p>
                </div>
              </div>
              <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center border transition-all shadow-sm ${
                typeof item.facings === 'number' 
                  ? 'border-slate-200 text-blue-600 bg-slate-100' 
                  : 'border-slate-200 text-slate-400 bg-slate-100'
              }`}>
                <span className="text-xl font-bold tracking-tighter">{item.facings}</span>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center h-full py-20 text-slate-300">
               <Search size={40} className="mb-4 opacity-20" />
               <p className="font-bold italic text-sm">No results found</p>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/20 flex items-center justify-between">
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-slate-800">{paginatedItems.length}</span> / {filtered.length} products
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 border border-slate-200 rounded-[6px] hover:bg-white disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <div className="flex items-center gap-1.5 px-3 text-[13px] font-bold text-slate-600">
                <span>{currentPage}</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-400">{totalPages}</span>
              </div>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 border border-slate-200 rounded-[6px] hover:bg-white disabled:opacity-30 transition-all shadow-sm"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionList;
