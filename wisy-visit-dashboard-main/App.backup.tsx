
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VisitHeader from './components/VisitHeader';
import CircularProgress from './components/CircularProgress';
import PhotoGallery from './components/PhotoGallery';
import StatusCard from './components/StatusCard';
import DetailedRules, { Rule } from './components/DetailedRules';
import VisitList from './components/VisitList';
import DistributionList from './components/DistributionList';
import SOSAnalysis from './components/SOSAnalysis';
import KeyMetricList from './components/KeyMetricList';
import { MOCK_VISIT } from './constants';
import RightPanel, { CategoryOption } from './components/RightPanel';
import {
  Menu, Search, Bell, Filter, MoreVertical, MapPin, Calendar, Clock, ChevronRight, ChevronLeft,
  Camera, BarChart3, FileText, CheckCircle, CheckCircle2, XCircle, AlertTriangle, X, Image as ImageIcon, Maximize2,
  Settings, ChevronDown, User, LogOut, LayoutGrid, PieChart, ClipboardList, List, ArrowRight, PanelLeftClose,
  Zap, ShieldAlert, Tag as TagIcon, ListChecks, Beer, GlassWater, Wine, Layers, ShoppingBag, Eye, MinusCircle
} from 'lucide-react';

const MANUAL_QUESTIONS = [
  { question: '¿Cliente trabaja esta categoría?', answer: 'Sí' },
  { question: '¿Se puede ejecutar el cooler de cervezas?', answer: 'Sí' },
  { question: '¿Se realizó limpieza en el cooler?', answer: 'No, faltan implementos de limpieza' },
  { question: '¿Realiza reposición?', answer: 'Sí' },
  { question: '¿Cuál es la cantidad de puertas de la categoría? (CCU + Competencia)', answer: '3' }
];

interface SubNavTabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const SubNavTab: React.FC<SubNavTabProps> = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-1 py-3 font-bold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap border-b-2 ${active
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-slate-400 hover:border-slate-200 hover:text-slate-600'
      }`}
  >
    <span className={active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}>
      {/* Fix: cast icon to React.ReactElement<any> to resolve TS error where 'size' is not found in unknown props */}
      {React.cloneElement(icon as React.ReactElement<any>, { size: 16, strokeWidth: active ? 2.5 : 2 })}
    </span>
    {label}
  </button>
);

const AA42937_LAYOUT_RULES: (Rule & { source?: 'CCU' | 'CLIENTE' })[] = [
  { id: 1, label: '1 Bandeja Longneck bandeja 4 o 5 (o superior)', status: 'failed', source: 'CCU' },
  { id: 2, label: '1 Bandeja Familiar/Mediana bandeja 1', status: 'passed', source: 'CCU' },
  { id: 3, label: '1 Bandeja Estratégica bandeja 1, 2 o 3', status: 'passed', source: 'CCU' },
  { id: 4, label: '2 bandejas con mismo formato', status: 'passed', source: 'CLIENTE' }
];

const MOCK_CONTAMINATION_RULES = [
  { id: 200, label: 'Descontaminadas', count: 1, status: 'passed' as const },
  { id: 201, label: 'Contaminación interna', count: 0, status: 'neutral' as const },
  { id: 202, label: 'Contaminación externa', count: 0, status: 'neutral' as const },
  { id: 203, label: 'Contaminación Interna y Externa', count: 0, status: 'neutral' as const },
];

const MOCK_CCU_DOORS_CONTAMINATION = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/contaminacion_interna.png',
    boxes: [
      { x: 9, y: 5, w: 18, h: 22, label: '1 Bandeja  Longneck bandeja 4 o 5 (o superior)', status: 'passed' as const },
      { x: 32, y: 5, w: 28, h: 22, label: '2 BANDEJA MEDIANA BANDEJA 1', status: 'passed' as const },
      { x: 65, y: 5, w: 25, h: 22, label: '3 PUERTA PREMIUM/CRAFT BANDEJA 1', status: 'passed' as const },
      { x: 35, y: 35, w: 20, h: 8, label: 'PRECIO $2500', status: 'warning' as const },
      { x: 32, y: 45, w: 28, h: 22, label: '4 BANDEJAS RETORNABLE MASIVA BANDEJA 1', status: 'failed' as const },
      { x: 65, y: 45, w: 25, h: 22, label: '5 BANDEJA CRAFT LATA BANDEJA 1', status: 'passed' as const },
    ]
  }
];

const MOCK_CCU_DOORS_DESCONTAMINACION = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/descontaminacion.png',
    boxes: [
      { x: 9, y: 5, w: 18, h: 22, label: '1 Bandeja  Longneck bandeja 4 o 5 (o superior)', status: 'passed' as const },
      { x: 32, y: 5, w: 28, h: 22, label: '2 BANDEJA MEDIANA BANDEJA 1', status: 'passed' as const },
      { x: 65, y: 5, w: 25, h: 22, label: '3 PUERTA PREMIUM/CRAFT BANDEJA 1', status: 'passed' as const },
      { x: 35, y: 35, w: 20, h: 8, label: 'PRECIO $2500', status: 'warning' as const },
      { x: 32, y: 45, w: 28, h: 22, label: '4 BANDEJAS RETORNABLE MASIVA BANDEJA 1', status: 'failed' as const },
      { x: 65, y: 45, w: 25, h: 22, label: '5 BANDEJA CRAFT LATA BANDEJA 1', status: 'passed' as const },
    ]
  }
];

const MOCK_CCU_DOORS_LAYOUT = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/layout_fridge.png',
    boxes: [
      { x: 9, y: 5, w: 18, h: 22, label: '1 Bandeja  Longneck bandeja 4 o 5 (o superior)', status: 'failed' as const },
      { x: 32, y: 5, w: 28, h: 22, label: '2 BANDEJA MEDIANA BANDEJA 1', status: 'passed' as const },
      { x: 65, y: 5, w: 25, h: 22, label: '3 PUERTA PREMIUM/CRAFT BANDEJA 1', status: 'passed' as const },
      { x: 35, y: 35, w: 20, h: 8, label: 'PRECIO $2500', status: 'warning' as const },
      { x: 32, y: 45, w: 28, h: 22, label: '4 BANDEJAS RETORNABLE MASIVA BANDEJA 1', status: 'failed' as const },
      { x: 65, y: 45, w: 25, h: 22, label: '5 BANDEJA CRAFT LATA BANDEJA 1', status: 'passed' as const },
    ]
  }
];

const MOCK_CCU_DOORS_LAYOUT_2 = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/layout_fridge_2.png',
    boxes: [
      { x: 9, y: 5, w: 18, h: 22, label: '1 Bandeja  Longneck bandeja 4 o 5 (o superior)', status: 'passed' as const },
      { x: 32, y: 5, w: 28, h: 22, label: '2 BANDEJA MEDIANA BANDEJA 1', status: 'passed' as const },
      { x: 65, y: 5, w: 25, h: 22, label: '3 PUERTA PREMIUM/CRAFT BANDEJA 1', status: 'passed' as const },
      { x: 35, y: 35, w: 20, h: 8, label: 'PRECIO $2500', status: 'warning' as const },
      { x: 32, y: 45, w: 28, h: 22, label: '4 BANDEJAS RETORNABLE MASIVA BANDEJA 1', status: 'failed' as const },
      { x: 65, y: 45, w: 25, h: 22, label: '5 BANDEJA CRAFT LATA BANDEJA 1', status: 'passed' as const },
    ]
  }
];

const MOCK_PRICETAG_ITEMS = [
  { id: 301, label: 'Bandeja con precio', count: 3, status: 'passed' },
  { id: 302, label: 'Bandeja sin precio', count: 1, status: 'failed' }
];

const MOCK_CCU_DOORS_LAYOUT_3 = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/layout_fridge_3.png',
    boxes: [
      { x: 9, y: 5, w: 18, h: 22, label: '1 Bandeja  Longneck bandeja 4 o 5 (o superior)', status: 'passed' as const },
      { x: 32, y: 5, w: 28, h: 22, label: '2 BANDEJA MEDIANA BANDEJA 1', status: 'passed' as const },
      { x: 65, y: 5, w: 25, h: 22, label: '3 PUERTA PREMIUM/CRAFT BANDEJA 1', status: 'passed' as const },
      { x: 35, y: 35, w: 20, h: 8, label: 'PRECIO $2500', status: 'warning' as const },
      { x: 32, y: 45, w: 28, h: 22, label: '4 BANDEJAS RETORNABLE MASIVA BANDEJA 1', status: 'failed' as const },
      { x: 65, y: 45, w: 25, h: 22, label: '5 BANDEJA CRAFT LATA BANDEJA 1', status: 'passed' as const },
    ]
  }
];

const MOCK_CCU_DOORS_ETIQUETAS = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/etiquetas_con_precio.png',
    boxes: []
  }
];

const MOCK_CCU_DOORS_ETIQUETAS_SIN_PRECIO = [
  {
    id: 'door-1', label: 'Puerta 1',
    url: '/etiquetas_sin_precio.png',
    boxes: []
  }
];

const MOCK_CCU_DOORS = MOCK_CCU_DOORS_LAYOUT;

const BB2010_RULES: Rule[] = [
  { id: 1, label: '4 ESTANTES COLAS BLANCAS Y SABORES', status: 'passed' },
  { id: 2, label: '4 ESTANTES COLAS NEGRAS', status: 'passed' },
  { id: 3, label: '4 ESTANTES REFRESCOS', status: 'failed' }
];

const CATEGORIES: CategoryOption[] = [
  { id: 'overview', label: 'Overview General', status: 'DONE', icon: <LayoutGrid size={16} /> },
  { id: 'cervezas', label: 'Cervezas', pts: 50, total: 100, status: 'DONE', icon: <Beer size={16} />, imageUrl: '/heineken.jpg' },
  { id: 'analcoholicos', label: 'Analcohólicos', pts: 85, total: 100, status: 'DONE', icon: <GlassWater size={16} />, imageUrl: '/pepsi.jpg' },
  { id: 'vinos', label: 'Vinos y Licores', pts: 100, total: 100, status: 'DONE', icon: <Wine size={16} />, imageUrl: '/brand_logo.png' },
  { id: 'pop', label: 'Material POP', pts: 100, total: 100, status: 'DONE', icon: <Layers size={16} />, imageUrl: '/brand_logo.png' },
  { id: 'licores', label: 'Licores Premium', status: 'PENDING', icon: <ShoppingBag size={16} />, imageUrl: '/brand_logo.png' }
];

const REAL_CASE_CATEGORIES: CategoryOption[] = [
  { id: 'aceite', label: 'Aceite', pts: 8, total: 8, status: 'DONE', icon: <ShoppingBag size={16} />, group: 'ALIMENTOS BASICOS' },
  { id: 'arroz', label: 'Arroz', pts: 15, total: 15, status: 'DONE', icon: <ShoppingBag size={16} />, group: 'ALIMENTOS BASICOS' },
  { id: 'atunes', label: 'Atunes', pts: 12, total: 12, status: 'DONE', icon: <ShoppingBag size={16} />, group: 'ALIMENTOS BASICOS' },
  { id: 'avenas', label: 'Avenas', pts: 6, total: 6, status: 'DONE', icon: <ShoppingBag size={16} />, group: 'ALIMENTOS BASICOS' },
  { id: 'agua', label: 'Agua', pts: 4, total: 4, status: 'DONE', icon: <GlassWater size={16} />, group: 'BEBIDAS' },
  { id: 'bebidas', label: 'Bebidas Deportivas', pts: 2, total: 2, status: 'DONE', icon: <Zap size={16} />, group: 'BEBIDAS' },
  { id: 'aguardiente', label: 'Aguardiente', pts: 1, total: 1, status: 'DONE', icon: <Wine size={16} />, group: 'LICORES' },
  { id: 'anis', label: 'Anis', pts: 1, total: 1, status: 'DONE', icon: <Wine size={16} />, group: 'LICORES' },
];

// MOCK PRODUCTS FOR AA40258 (POLAR VISIT)
const MOCK_PRODUCTS_POLAR = [
  { id: 'pol-1', name: 'Agua blanca 1Kg', sku: 'SKU: AG-BL-1000', price: '2.50 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', categoryId: 'aceite' },
  { id: 'pol-2', name: 'Doña Emilia 1Kg', sku: 'SKU: DE-1000', price: '2.80 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', categoryId: 'aceite' },
  { id: 'pol-3', name: 'Gran Marques 1Kg', sku: 'SKU: GM-1000', price: '3.00 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', categoryId: 'arroz' },
  { id: 'pol-4', name: 'Corina 1kg', sku: 'SKU: CR-1000', price: '2.40 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', categoryId: 'arroz' },
  { id: 'pol-5', name: 'Santoni Premiun (Rojo) 900 grs', sku: 'SKU: SP-900', price: '3.20 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', categoryId: 'atunes' },
  { id: 'pol-6', name: 'Arroz Mary 1kg', sku: 'SKU: AM-1000', price: '2.10 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', categoryId: 'avenas' },
  { id: 'pol-7', name: 'Arroz Primor 1kg', sku: 'SKU: AP-1000', price: '2.15 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', categoryId: 'agua' },
  { id: 'pol-8', name: 'Bebida Deportiva A', sku: 'SKU: BDA-500', price: '1.50 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', categoryId: 'bebidas' },
  { id: 'pol-9', name: 'Aguardiente X', sku: 'SKU: AGX-750', price: '10.00 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', categoryId: 'aguardiente' },
  { id: 'pol-10', name: 'Anis Y', sku: 'SKU: ANY-700', price: '8.00 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', categoryId: 'anis' },
  { name: 'Anis Y', sku: 'SKU: ANY-700', price: '8.00 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', categoryId: 'anis' },
  { name: 'Anis Y', sku: 'SKU: ANY-700', price: '8.00 USD', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', categoryId: 'anis' },
];

// MOCK DATA FOR DISTRIBUTION CATEGORIES (New Request)
const MOCK_DIST_CATEGORIES: any[] = [
  { id: 'refrescos-anaquel', label: 'Refrescos - Anaquel', status: 'DONE', count: 85, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066' },
  { id: 'refrescos-exhibicion-anaquel', label: 'Refrescos - Exhibición Adicional (Anaquel)', status: 'DONE', count: 92, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { id: 'refrescos-exhibicion-colas', label: 'Refrescos - Exhibición Adicional (Colas Negras)', status: 'DONE', count: 78, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717' },
  { id: 'refrescos-exhibicion-nevera', label: 'Refrescos - Exhibición Adicional (Nevera)', status: 'DONE', count: 45, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066' },
  { id: 'refrescos-nevera-cliente', label: 'Refrescos - Nevera Cliente', status: 'DONE', count: 100, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { id: 'refrescos-nevera-propia', label: 'Refrescos - Nevera Propia', status: 'DONE', count: 88, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717' },
  { id: 'refrescos-inventario', label: 'Refrescos - Inventario en PDV', status: 'DONE', count: 65, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066' },
  { id: 'harinas-anaquel', label: 'Harinas - Anaquel', status: 'DONE', count: 72, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
  { id: 'harinas-exhibicion', label: 'Harinas - Exhibición Adicional', status: 'DONE', count: 55, thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717' },
  { id: 'precios', label: 'Refresco - Nevera Propia', status: 'PENDING', thumbnail: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728' },
];

const INVENTORY_QUESTIONS = [
  { question: '¿Cuántas cajas comercializa de Colas Negras PCV Mensualmente?', answer: '10' },
  { question: '¿Cuántas cajas comercializa de Colas Negras de Coke Mensualmente?', answer: '40' },
  { question: '¿Cuántas cajas comercializa de Colas Blancas PCV Mensualmente?', answer: '--' },
  { question: '¿Cuántas cajas comercializa de Colas Blancas de Coke Mensualmente?', answer: '10' },
  { question: '¿Cuántas cajas comercializa de Sabores PCV Mensualmente?', answer: '--' },
  { question: '¿Cuántas cajas comercializa de Sabores de Coke Mensualmente?', answer: '--' }
];

const MOCK_SOS_CATEGORIES = [
  { id: 'colas-negras', label: 'COLAS NEGRAS', percentage: 55.2, status: 'DONE' },
  { id: 'colas-blancas', label: 'COLAS BLANCAS', percentage: 12.2, status: 'DONE' },
  { id: 'sabores', label: 'SABORES', percentage: 32.5, status: 'DONE' },
  { id: 'todos', label: 'TODOS LOS REFRESCOS', percentage: 100, status: 'DONE' },
];

const MOCK_DIST_PRODUCTS_POLAR = [
  // Refrescos - Anaquel (Visible Faces)
  { id: 'p1', label: 'Pepsi Botella RET 1250 ML Familiar', sku: 'SKU: PEP-RET-1250', image: '/product-1.png', status: 'DONE', count: 11, categoryId: 'refrescos-anaquel' },
  { id: 'p2', label: 'Pepsi Botella PET 1,5 LT Familiar', sku: 'SKU: PEP-PET-1500', image: '/product-2.png', status: 'DONE', count: 5, categoryId: 'refrescos-anaquel' },
  { id: 'p3', label: '7Up Botella RET 1250 ML Familiar', sku: 'SKU: 7UP-RET-1250', image: '/product-3.png', status: 'DONE', count: 4, categoryId: 'refrescos-anaquel' },
  { id: 'p4', label: 'Golden Manzana Botella RET 1250 ML Familiar', sku: 'SKU: GOL-MAN-1250', image: '/product-4.png', status: 'DONE', count: 3, categoryId: 'refrescos-anaquel' },

  // Refrescos - No Facings (Distributed across categories)
  { id: 'p5', label: 'Pepsi Light Botella PET 2 LT Familiar', sku: 'SKU: PEP-LGT-2000', image: '/product-5.png', status: 'PENDING', count: 0, categoryId: 'refrescos-anaquel' },
  { id: 'p6', label: '7Up Botella PET 1,5 LT Familiar', sku: 'SKU: 7UP-PET-1500', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-anaquel' },
  { id: 'p7', label: 'Golden Narajana Botella PET 2 LT Familiar', sku: 'SKU: GOL-NAR-2000', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-anaquel' },
  { id: 'p8', label: 'Golden Piña Botella RET 350 ML Individual', sku: 'SKU: GOL-PIN-350', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-colas' },
  { id: 'p9', label: 'Golden Piña Botella PET 1,5 LT Familiar', sku: 'SKU: GOL-PIN-1500', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-colas' },
  { id: 'p10', label: 'Golden Kola Botella RET 350 ML Individual', sku: 'SKU: GOL-KOL-350', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-nevera' },
  { id: 'p11', label: 'Golden Piña Botella PET 2 LT Familiar', sku: 'SKU: GOL-PIN-2000', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-nevera' },
  { id: 'p12', label: 'Pepsi Zero Lata 355 ML Individual', sku: 'SKU: PEP-ZER-355', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-cliente' },
  { id: 'p13', label: 'Golden Kola Lata 355 ML Individual', sku: 'SKU: GOL-KOL-355', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-cliente' },
  { id: 'p14', label: 'Golden Manzana Botella RET 350 ML Individual', sku: 'SKU: GOL-MAN-350', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-propia' },
  { id: 'p15', label: 'Pepsi Zero Botella PET 1 LT Familiar', sku: 'SKU: PEP-ZER-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-propia' },
  { id: 'p16', label: 'Golden Manzana Botella PET 2 LT Familiar', sku: 'SKU: GOL-MAN-2000', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-inventario' },
  { id: 'p17', label: '7Up Lata 355 ML Individual', sku: 'SKU: 7UP-355', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-inventario' },
  { id: 'p18', label: 'Golden Piña Botella PET 1 LT Familiar', sku: 'SKU: GOL-PIN-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-anaquel' },
  { id: 'p19', label: 'Pepsi Light Lata 355 ML Individual', sku: 'SKU: PEP-LGT-355', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-colas' },
  { id: 'p20', label: 'Golden Naranja Botella PET 1,5 LT Familiar', sku: 'SKU: GOL-NAR-1500', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-exhibicion-nevera' },
  { id: 'p21', label: 'Pepsi Botella PET 2 LT Familiar', sku: 'SKU: PEP-2000', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-cliente' },
  { id: 'p22', label: 'Golden Kola Botella PET 2 LT Familiar', sku: 'SKU: GOL-KOL-2000', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'PENDING', count: 0, categoryId: 'refrescos-nevera-propia' },
  { id: 'p23', label: 'Golden Manzana Botella PET 1 LT Familiar', sku: 'SKU: GOL-MAN-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'PENDING', count: 0, categoryId: 'refrescos-inventario' },


  // Harinas - Anaquel
  { id: 'p25', label: 'Harina PAN 1Kg', sku: 'SKU: HAR-PAN-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'DONE', count: 6, categoryId: 'harinas-anaquel' },
  { id: 'p26', label: 'Harina Juana 500g', sku: 'SKU: HAR-JUA-500', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'DONE', count: 3, categoryId: 'harinas-anaquel' },
  { id: 'p27', label: 'Harina Selecta 1Kg', sku: 'SKU: HAR-SEL-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/898d9494-118e-4a69-805c-3f7495819717', status: 'DONE', count: 4, categoryId: 'harinas-anaquel' },

  // Harinas - Exhibición Adicional
  { id: 'p28', label: 'Harina PAN Dulce 500g', sku: 'SKU: HAR-PAN-DUL-500', image: 'https://raw.githubusercontent.com/user-attachments/assets/75949e29-6511-40be-ba39-16016e047728', status: 'DONE', count: 2, categoryId: 'harinas-exhibicion' },
  { id: 'p29', label: 'Harina Integral 1Kg', sku: 'SKU: HAR-INT-1000', image: 'https://raw.githubusercontent.com/user-attachments/assets/802df91e-436d-495f-9ce0-4df234f9a066', status: 'DONE', count: 3, categoryId: 'harinas-exhibicion' },

  // Recolección de precios - EMPTY (Pending survey)
];



// SOS Area Component - Restructured to match Distribution layout
// SOS Area Content Component (Right Panel Only)
// Rules Content Component (Mimicking SOS Layout)
const RulesContent = () => {
  const [localSelectedId, setLocalSelectedId] = useState<number>(BB2010_RULES[0].id);

  return (
    <div className="h-full flex flex-row bg-white shadow-sm overflow-hidden">
      {/* Left Column: Rules List */}
      <div className="w-1/2 flex flex-col h-full">
        <div className="px-6 py-4 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">Reglas de Validación</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {BB2010_RULES.map((rule) => {
            const isSelected = localSelectedId === rule.id;
            const isPassed = rule.status === 'passed';

            return (
              <button
                key={rule.id}
                onClick={() => setLocalSelectedId(rule.id)}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-lg text-sm transition-all border group ${isSelected
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-0.5 ${isPassed ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                    {isPassed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  </div>
                  <span className={`font-semibold text-left ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{rule.label}</span>
                </div>
                <ChevronRight size={16} className={`${isSelected ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Photo Evidence */}
      <div className="w-1/2 flex flex-col h-full bg-slate-50">
        <div className="px-6 py-4 bg-white flex justify-between items-center shrink-0">
          <h3 className="font-semibold text-slate-800">Evidencia Fotográfica</h3>
        </div>
        <div className="flex-1 overflow-hidden p-4 flex items-center justify-center">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            {localSelectedId === 1 ? (
              <img
                src="/regla-colas-blancas-sabores.jpg"
                className="w-full h-full object-contain"
                alt="4 Estantes Colas Blancas y Sabores"
              />
            ) : localSelectedId === 2 ? (
              <img
                src="/regla-colas-negras.jpg"
                className="w-full h-full object-contain"
                alt="4 Estantes Colas Negras"
              />
            ) : (
              <img
                src="/regla-colas-blancas-sabores.jpg"
                className="w-full h-full object-contain"
                alt="4 Estantes Refrescos"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SOSContent = ({ selectedCategoryId }: { selectedCategoryId: string }) => {
  const [localSelectedId, setLocalSelectedId] = useState(selectedCategoryId || 'colas-negras');
  const currentCategory = MOCK_SOS_CATEGORIES.find(c => c.id === localSelectedId) || MOCK_SOS_CATEGORIES[0];

  return (
    <div className="h-full flex flex-row bg-white border border-slate-200 shadow-sm overflow-hidden">
      {/* Left Column: SOS Metrics List */}
      <div className="w-1/2 flex flex-col border-r border-slate-200 h-full">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="font-semibold text-slate-800">Métricas SOS</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MOCK_SOS_CATEGORIES.map((cat, idx) => {
            const isSelected = localSelectedId === cat.id;
            const barColor = isSelected ? 'bg-blue-100' : 'bg-slate-100';

            return (
              <button
                key={cat.id}
                onClick={() => setLocalSelectedId(cat.id)}
                className={`group relative w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all overflow-hidden border ${isSelected
                  ? 'border-blue-500 shadow-md bg-white'
                  : 'border-transparent hover:bg-slate-50 bg-white'
                  }`}
              >
                {/* Progress Bar Background */}
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out opacity-60 ${barColor}`}
                  style={{ width: `${cat.percentage}%` }}
                />

                {/* Content */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className={`font-medium ${isSelected ? 'font-bold text-slate-900 shadow-sm' : 'text-slate-700'}`}>{cat.label}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-base font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>{cat.percentage}%</span>
                    <ChevronRight size={16} className={`${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Photo Evidence */}
      <div className="w-1/2 flex flex-col h-full bg-slate-50">
        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Evidencia Fotográfica</h3>

        </div>
        <div className="flex-1 overflow-hidden p-4 flex items-center justify-center">
          <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
            <img
              src={
                localSelectedId === 'colas-blancas' ? '/colas-blancas.jpg' :
                  localSelectedId === 'colas-negras' ? '/colas-negras.jpg' :
                    localSelectedId === 'sabores' ? '/sabores.jpg' :
                      '/sos-fridge.jpg'
              }
              className="w-full h-full object-contain"
              alt="SOS Evidence"
            />

          </div>
        </div>
      </div>
    </div>
  );
};

const SaaSDistributionList = ({ category, onProductClick, selectedProductId, onBack, products, hideHeader, showPrice, searchTerm = '' }: { category: any, onProductClick: (prod: any) => void, selectedProductId?: string | null, onBack?: () => void, products?: any[], hideHeader?: boolean, showPrice?: boolean, searchTerm?: string }) => {
  const [facingFilter, setFacingFilter] = useState<'all' | 'with' | 'without'>('all');
  const dataSource = products || MOCK_DIST_PRODUCTS_POLAR;

  const baseFiltered = (category.id === 'overview' || searchTerm) ? dataSource : dataSource.filter((p: any) => p.categoryId === category.id);

  const counts = {
    all: baseFiltered.length,
    with: baseFiltered.filter((p: any) => showPrice ? (p.price && p.price !== '-- Bs.') : (p.count || 0) > 0).length,
    without: baseFiltered.filter((p: any) => showPrice ? (!p.price || p.price === '-- Bs.') : (!p.count || p.count === 0)).length
  };

  const filteredProducts = baseFiltered.filter((p: any) => {
    const matchesSearch = !searchTerm || (p.label || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (facingFilter === 'with') return showPrice ? (p.price && p.price !== '-- Bs.') : (p.count || 0) > 0;
    if (facingFilter === 'without') return showPrice ? (!p.price || p.price === '-- Bs.') : (p.count || 0) === 0;
    return true;
  });
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setPage(1);
  }, [category, facingFilter]);

  return (
    <div className="bg-white h-full flex flex-col w-full">
      {!hideHeader && (
        <div className="px-6 py-4 flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 p-1 rounded-full transition-colors">
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="text-base font-semibold text-slate-900">{category.label}</h2>
        </div>
      )}




      <div className="px-6 py-3 flex items-center gap-4 bg-white overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Filtrar:</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFacingFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${facingFilter === 'all'
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'}`}
          >
            Todas ({counts.all})
          </button>
          <button
            onClick={() => setFacingFilter('with')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${facingFilter === 'with'
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {showPrice ? 'Con precio' : 'Con facings'} ({counts.with})
          </button>
          <button
            onClick={() => setFacingFilter('without')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${facingFilter === 'without'
              ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm'
              : 'bg-white border-slate-200 text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'}`}
          >
            {showPrice ? 'Sin precio' : 'Sin facings'} ({counts.without})
          </button>
        </div>
      </div>

      <div className={`px-6 py-[18px] bg-slate-50/50 flex items-center ${showPrice ? 'justify-between' : 'justify-between'}`}>
        {showPrice ? (
          <>
            <div className="w-14 font-semibold text-slate-700 text-xs">Foto</div>
            <div className="flex-1 font-semibold text-slate-700 text-xs pl-2">Producto</div>
            <div className="font-semibold text-slate-700 text-xs w-20 text-right">Precio</div>
          </>
        ) : (
          <>
            <div className="w-14 font-semibold text-slate-700 text-xs">Foto</div>
            <div className="flex-1 flex items-center gap-2 pl-2">
              <h3 className="font-semibold text-slate-700 text-xs">Producto</h3>
              <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{filteredProducts.length}</span>
            </div>
            <h3 className="font-semibold text-slate-700 text-xs">Facings</h3>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {paginatedProducts.map((prod: any, idx: number) => (
          <button key={idx} onClick={() => onProductClick(prod)} className={`w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-all group text-left ${selectedProductId === (prod.id || prod.sku) ? 'bg-blue-50/50' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-0.5 overflow-hidden">
                <img src={prod.image} className="w-full h-full object-contain" alt="product" />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${selectedProductId === prod.id ? 'text-blue-700' : 'text-slate-900'}`}>{prod.label || prod.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">{prod.sku}</p>
              </div>
            </div>
            <div className="pl-2">
              <div className={`h-10 rounded-lg border flex items-center justify-center px-3 min-w-[48px] ${selectedProductId === (prod.id || prod.sku) ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <span className="text-sm font-bold whitespace-nowrap">{showPrice ? (prod.price || '-- Bs.') : (prod.count || 0)}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {/* Simple Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-2 bg-white flex justify-between items-center text-xs">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="disabled:opacity-30 hover:bg-slate-50 p-1 rounded"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-slate-500 font-medium">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="disabled:opacity-30 hover:bg-slate-50 p-1 rounded"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const NEW_DESIGN_VISIT = {
  ...MOCK_VISIT,
  id: 'NEW-DESIGN-01',
  customer: 'NUEVO DISEÑO (COLLAPSIBLE)',
};

const NEW_DESIGN_VISIT_2 = {
  ...MOCK_VISIT,
  id: 'NEW-DESIGN-02',
  customer: 'NUEVO DISEÑO (TABBED)',
};

const REAL_CASE_VISIT = {
  ...MOCK_VISIT,
  id: 'AA40258',
  customer: 'INVERSIONES DON MANUEL 1959, CA',
  subtitle: 'Polar',
  location: 'Caracas, Venezuela',
  date: '30/12/2025',
  supervisor: 'Nadja A Belgrave',
  status: 'COMPLETED',
  score: 100
};

const CCU_VISIT = {
  ...MOCK_VISIT,
  id: 'AA40299',
  customer: 'GENOVEVA ADASME MEJIAS Supermercado',
  subtitle: 'CCU',
  location: 'Av. Providencia 1266, Piso 4, Providencia, Región Metropolitana, Santiago, Chile',
  date: '30/12/2025',
  supervisor: 'SUPERVISOR WISY - 01',
  status: 'COMPLETED',
  score: 100
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('visits');
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  // Extended state to include 'price_collections' for AA40258 default
  const [detailSubTab, setDetailSubTab] = useState<'distribution' | 'sos' | 'rules' | 'price_collections'>('distribution');
  const [activeRightViewMode, setActiveRightViewMode] = useState<'list' | 'detail'>('list');
  const [surveyViewMode, setSurveyViewMode] = useState<'distribution' | 'sos' | 'rules'>('distribution'); // Local view mode for master-detail
  const [surveyListMode, setSurveyListMode] = useState<'grid' | 'list'>('grid'); // New state for Survey List (Grid vs List)
  const [rulesFilter, setRulesFilter] = useState('all'); // State for Rules Filter
  const [selectedSOSCategoryId, setSelectedSOSCategoryId] = useState<string>('colas-negras');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [sidebarSearchTerm, setSidebarSearchTerm] = useState('');
  const itemsPerSidebarPage = 10;

  // Move Layout Helpers here to ensure availability
  const isNewLayout = selectedVisitId === 'NEW-DESIGN-01' || selectedVisitId === 'NEW-DESIGN-02';
  const isLayout2 = selectedVisitId === 'NEW-DESIGN-02';


  // Reset pagination when category changes
  useEffect(() => {
    setSidebarPage(1);
  }, [detailSubTab]);

  const categories = (selectedVisitId === 'AA40258') ? REAL_CASE_CATEGORIES : CATEGORIES;

  // States for AA42937 sectional view filters
  const [layoutFilter, setLayoutFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [ruleSourceFilter, setRuleSourceFilter] = useState<'all' | 'CCU' | 'CLIENTE'>('all');
  const [contaminacionFilter, setContaminacionFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [priceTagFilter, setPriceTagFilter] = useState<'all' | 'passed' | 'failed'>('all');

  // Current active section for AA42937 anchors
  const [activeAnchor, setActiveAnchor] = useState('layout');

  const [galleryIndex, setGalleryIndex] = useState(0);
  const [activeRuleId, setActiveRuleId] = useState<number | null>(null);


  const [isInnerSidebarCollapsed, setIsInnerSidebarCollapsed] = useState(false);
  const [ccuSection, setCcuSection] = useState<'layout' | 'contaminacion' | 'etiquetas' | 'manuales'>('layout');
  const [ccuCategory, setCcuCategory] = useState<string>('cervezas');
  const [ccuDesignMode, setCcuDesignMode] = useState<'scroll' | 'sidebar'>('scroll');

  const visit = selectedVisitId === 'NEW-DESIGN-01' ? NEW_DESIGN_VISIT :
    selectedVisitId === 'NEW-DESIGN-02' ? NEW_DESIGN_VISIT_2 :
      (selectedVisitId === 'AA40258' || selectedVisitId === 'AA40299') ? (selectedVisitId === 'AA40299' ? CCU_VISIT : REAL_CASE_VISIT) : MOCK_VISIT;

  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    if (id === 'overview') setActiveTab('overview');
  };

  const handleVisitSelection = (id: string) => {
    setSelectedVisitId(id);
    setActiveTab('overview');
    setSelectedCategoryId('overview');
    // Set default tab based on visit ID
    setDetailSubTab((id === 'AA40258') ? 'price_collections' : 'distribution');
    setActiveRuleId(null);
    setGalleryIndex(0);
    setActiveAnchor('layout');
    setActiveRightViewMode('list');
    // Reset filters
    setLayoutFilter('all');
    setContaminacionFilter('all');
    setPriceTagFilter('all');
  };

  const handleRuleClick = (rule: any) => {
    setActiveRuleId(rule.id);
    setGalleryIndex((rule.id - 1) % 3);
    if (selectedVisitId === 'NEW-DESIGN-02' || selectedVisitId === 'AA40258') {
      setActiveRightViewMode('detail');
    }
  };

  const handleProductClick = (prod: any) => {
    setSelectedProductId(prod.id);
  };



  const scrollToSection = (id: string) => {
    setActiveAnchor(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const AutomaticBadge = () => (
    <div className="ml-3 px-2 py-0.5 bg-slate-100 text-slate-400 rounded-[4px] text-[9px] font-bold uppercase tracking-widest border border-slate-200">
      AUTOMÁTICO
    </div>
  );

  const getGaugeProps = (filter: 'all' | 'passed' | 'failed', valid: number, total: number, invalid: number) => {
    if (filter === 'failed') {
      return { current: invalid, total: total, color: 'red' as const };
    }
    return { current: valid, total: total, color: 'green' as const };
  };

  // RENDER FOR AA42937 (SECTIONAL LAYOUT)
  const renderSectionalDetail = () => {
    const layoutGauge = getGaugeProps(layoutFilter, 73, 100, 27);
    const contaminacionGauge = getGaugeProps(contaminacionFilter, 24, 24, 0);
    const priceGauge = getGaugeProps(priceTagFilter, 38, 38, 0);

    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <VisitHeader
          visit={visit}
          onBack={() => setActiveTab('visits')}
        />

        {/* Anchor Navigation Menu - Compact Version */}
        <div className="sticky top-0 z-40 bg-[#FDFEFE]/95 backdrop-blur-sm py-3 border-b border-slate-100 -mx-4 px-4">
          <div className="flex gap-8 overflow-x-auto no-scrollbar max-w-max">
            <SubNavTab
              id="layout"
              label="Layout"
              icon={<LayoutGrid />}
              active={activeAnchor === 'layout'}
              onClick={() => scrollToSection('layout')}
            />
            <SubNavTab
              id="contaminacion"
              label="Contaminación"
              icon={<ShieldAlert />}
              active={activeAnchor === 'contaminacion'}
              onClick={() => scrollToSection('contaminacion')}
            />
            <SubNavTab
              id="etiquetas"
              label="Etiquetas"
              icon={<TagIcon />}
              active={activeAnchor === 'etiquetas'}
              onClick={() => scrollToSection('etiquetas')}
            />
            <SubNavTab
              id="manuales"
              label="Respuestas"
              icon={<ClipboardList />}
              active={activeAnchor === 'manuales'}
              onClick={() => scrollToSection('manuales')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 xl:col-span-8 space-y-20 pb-12">

            {/* Section: Layout */}
            <div id="layout" className="space-y-6 scroll-mt-24">
              <div className="flex items-center"><h2 className="text-xl font-bold text-slate-900 tracking-tight">Layout</h2><AutomaticBadge /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={73} active={layoutFilter === 'passed'} onClick={() => setLayoutFilter(layoutFilter === 'passed' ? 'all' : 'passed')} />
                <StatusCard type="score" label="SCORE" value={`${layoutGauge.current}/${layoutGauge.total}`}>
                  <CircularProgress current={layoutGauge.current} total={layoutGauge.total} size={88} color={layoutGauge.color} showText={true} />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={27} active={layoutFilter === 'failed'} onClick={() => setLayoutFilter(layoutFilter === 'failed' ? 'all' : 'failed')} />
              </div>
              <DetailedRules forcedFilter={layoutFilter} onFilterChange={setLayoutFilter} onRuleClick={handleRuleClick} activeRuleId={activeRuleId} customRules={AA42937_LAYOUT_RULES} />
            </div>

            {/* Section: Contaminación */}
            <div id="contaminacion" className="space-y-6 pt-12 border-t border-slate-100 scroll-mt-24">
              <div className="flex items-center"><h2 className="text-xl font-bold text-slate-900 tracking-tight">Contaminación</h2><AutomaticBadge /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={24} active={contaminacionFilter === 'passed'} onClick={() => setContaminacionFilter(contaminacionFilter === 'passed' ? 'all' : 'passed')} />
                <StatusCard type="score" label="SCORE" value={`${contaminacionGauge.current}/${contaminacionGauge.total}`}>
                  <CircularProgress current={contaminacionGauge.current} total={contaminacionGauge.total} size={88} color={contaminacionGauge.color} showText={true} />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={0} active={contaminacionFilter === 'failed'} onClick={() => setContaminacionFilter(contaminacionFilter === 'failed' ? 'all' : 'failed')} />
              </div>
              <KeyMetricList metrics={[{ label: 'Contaminación interna', value: 1 }, { label: 'Contaminación externa', value: 1 }, { label: 'Contaminación mixta', value: 1 }]} />
            </div>

            {/* Section: Etiquetas de Precio */}
            <div id="etiquetas" className="space-y-6 pt-12 border-t border-slate-100 scroll-mt-24">
              <div className="flex items-center"><h2 className="text-xl font-bold text-slate-900 tracking-tight">Etiquetas de Precio</h2><AutomaticBadge /></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={38} active={priceTagFilter === 'passed'} onClick={() => setPriceTagFilter(priceTagFilter === 'passed' ? 'all' : 'passed')} />
                <StatusCard type="score" label="SCORE" value={`${priceGauge.current}/${priceGauge.total}`}>
                  <CircularProgress current={priceGauge.current} total={priceGauge.total} size={88} color={priceGauge.color} showText={true} />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={0} active={priceTagFilter === 'failed'} onClick={() => setPriceTagFilter(priceTagFilter === 'failed' ? 'all' : 'failed')} />
              </div>
              <KeyMetricList title="Key Metric" metrics={[{ label: 'N° Etiquetas Detectadas', value: 38 }, { label: 'N° Bandejas con Precio', value: 24 }]} />
            </div>

            <div id="manuales" className="pt-12 border-t border-slate-100 scroll-mt-24">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 uppercase">Respuestas Manuales</h3>
              <div className="w-full">
                {MANUAL_QUESTIONS.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2">
                    <span className="text-slate-600 font-medium text-sm max-w-[70%]">{item.question}</span>
                    <span className="text-slate-900 font-bold text-sm text-right">{item.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* For Layout 2 (Tabbed), we DO NOT render the visible PhotoGallery here. It goes to the Right Panel. */}
          {/* For Layout 1 (Collapsible) and normal, we render it here */}
          {selectedVisitId !== 'NEW-DESIGN-02' && (
            <div className="hidden xl:block xl:col-span-4 h-[calc(100vh-180px)] min-h-[600px] sticky top-24">
              <PhotoGallery selectedIndex={galleryIndex} />
            </div>
          )}
        </div>
      </div>
    );
  };



  // RENDER FOR AA40299 (CCU Sectional Layout with Search Header)
  const renderCCUDetail = () => {
    const layoutGauge = getGaugeProps(layoutFilter, 73, 100, 27);
    const contaminacionGauge = getGaugeProps(contaminacionFilter, 24, 24, 0);
    const priceGauge = getGaugeProps(priceTagFilter, 38, 38, 0);

    const SECTIONS = [
      { id: 'layout', label: 'Layout', shortLabel: 'Layout', icon: <LayoutGrid size={18} /> },
      { id: 'contaminacion', label: 'Contaminación', shortLabel: 'Contaminación', icon: <ShieldAlert size={18} /> },
      { id: 'etiquetas', label: 'Etiquetas de Precio', shortLabel: 'Etiquetas', icon: <TagIcon size={18} /> },
      { id: 'manuales', label: 'Respuestas Manuales', shortLabel: 'Manuales', icon: <ClipboardList size={18} /> }
    ];

    const CCU_CATEGORIES = [
      { id: 'cervezas', label: 'Cervezas', subtitle: '5 Productos', count: 5, status: 'Listo' },
      { id: 'analcoholicos', label: 'Analcohólicos', subtitle: '3 Productos', count: 3, status: 'Listo' },
      { id: 'vinos', label: 'Vinos', subtitle: '2 Productos', count: 2, status: 'Pendiente' },
      { id: 'licores', label: 'Licores', subtitle: '4 Productos', count: 4, status: 'Pendiente' },
      { id: 'pop', label: 'Material POP', subtitle: '1 Item', count: 1, status: 'Listo' }
    ];

    const RenderSection = ({ sectionId, showHeader = true }: { sectionId: string, showHeader?: boolean }) => {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {showHeader && (
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{SECTIONS.find(s => s.id === sectionId)?.label}</h2>
              {sectionId !== 'manuales' && <AutomaticBadge />}
            </div>
          )}

          {sectionId === 'layout' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={3} active={layoutFilter === 'passed'} onClick={() => setLayoutFilter(layoutFilter === 'passed' ? 'all' : 'passed')} size="small" />
                <StatusCard type="score" label="SCORE" value={layoutFilter === 'failed' ? '1/4' : '3/4'} size="small">
                  <CircularProgress
                    current={layoutFilter === 'failed' ? 1 : 3}
                    total={4}
                    size={60}
                    color={layoutFilter === 'failed' ? 'red' : (layoutFilter === 'passed' ? 'green' : 'orange')}
                    showText={true}
                  />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={1} active={layoutFilter === 'failed'} onClick={() => setLayoutFilter(layoutFilter === 'failed' ? 'all' : 'failed')} size="small" />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-sm font-bold text-slate-900">Reglas de Validación</h3>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                    {(['all', 'CCU', 'CLIENTE'] as const).map(filter => (
                      <button
                        key={filter}
                        onClick={() => setRuleSourceFilter(filter)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase ${ruleSourceFilter === filter
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        {filter === 'all' ? 'Todos' : filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {AA42937_LAYOUT_RULES.filter(rule => {
                    if (ruleSourceFilter !== 'all' && rule.source !== ruleSourceFilter) return false;
                    if (layoutFilter === 'passed') return rule.status === 'passed';
                    if (layoutFilter === 'failed') return rule.status === 'failed';
                    return true;
                  }).map((rule: any) => {
                    const isSelected = activeRuleId === rule.id;
                    const isPassed = rule.status === 'passed';

                    return (
                      <button
                        key={rule.id}
                        onClick={() => handleRuleClick(rule)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all border group ${isSelected
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-transparent hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`rounded-full p-0.5 ${isPassed ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                            {isPassed ? <CheckCircle size={18} /> : <XCircle size={18} />}
                          </div>
                          <span className={`font-semibold text-left ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{rule.label}</span>
                        </div>
                        <ChevronRight size={16} className={`${isSelected ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {sectionId === 'contaminacion' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={4} active={contaminacionFilter === 'passed'} onClick={() => setContaminacionFilter(contaminacionFilter === 'passed' ? 'all' : 'passed')} size="small" />
                <StatusCard type="score" label="SCORE" value="4/4" size="small">
                  <CircularProgress current={4} total={4} size={60} color="green" showText={true} />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={0} active={contaminacionFilter === 'failed'} onClick={() => setContaminacionFilter(contaminacionFilter === 'failed' ? 'all' : 'failed')} size="small" />
              </div>
              <div className="mt-6 space-y-2 px-0">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-sm font-bold text-slate-900">Reglas de Validación</h3>
                </div>
                {MOCK_CONTAMINATION_RULES.map((item: any) => {
                  const isSelected = activeRuleId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRuleClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all border group ${isSelected
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 ${item.status === 'passed' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
                          {item.status === 'passed' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className={`font-semibold text-left ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{item.label}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{item.count}</span>
                        <ChevronRight size={16} className={`${isSelected ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {sectionId === 'etiquetas' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard type="valid" label="VÁLIDAS" value={38} active={priceTagFilter === 'passed'} onClick={() => setPriceTagFilter(priceTagFilter === 'passed' ? 'all' : 'passed')} size="small" />
                <StatusCard type="score" label="SCORE" value="38/38" size="small">
                  <CircularProgress current={38} total={38} size={60} color="green" showText={true} />
                </StatusCard>
                <StatusCard type="invalid" label="INVÁLIDAS" value={0} active={priceTagFilter === 'failed'} onClick={() => setPriceTagFilter(priceTagFilter === 'failed' ? 'all' : 'failed')} size="small" />
              </div>
              <div className="mt-6 space-y-2 px-0">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h3 className="text-sm font-bold text-slate-900">Reglas de Validación</h3>
                </div>
                {MOCK_PRICETAG_ITEMS.map((item: any) => {
                  const isSelected = activeRuleId === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleRuleClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all border group ${isSelected
                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                        : 'bg-white border-transparent hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full p-0.5 ${item.status === 'neutral' ? 'text-slate-400 bg-slate-100' : (item.status === 'passed' ? 'text-emerald-500 bg-emerald-50' : 'text-red-500 bg-red-50')}`}>
                          {item.status === 'neutral' ? <MinusCircle size={18} /> : (item.status === 'passed' ? <CheckCircle size={18} /> : <XCircle size={18} />)}
                        </div>
                        <span className={`font-semibold text-left ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                          {item.count}
                        </span>
                        <ChevronRight size={16} className={`${isSelected ? 'text-blue-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
                      </div>
                    </button>
                  );
                })}
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-2">Respuestas manuales</h3>
                  <div className="p-0">
                    <div className="flex justify-between items-start py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2">
                      <span className="text-slate-600 font-medium text-sm max-w-[70%]">Motivo de no ejecución</span>
                      <span className="text-slate-900 font-bold text-sm text-right">Precios en parte superior/inferior de la puerta</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {sectionId === 'manuales' && (
            <div className="w-full pt-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-6">Respuestas manuales</h3>
              {MANUAL_QUESTIONS.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors px-2">
                  <span className="text-slate-600 font-medium text-sm max-w-[70%]">{item.question}</span>
                  <span className="text-slate-900 font-bold text-sm text-right">{item.answer}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Modern Enterprise SaaS Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200/60">
          {/* Top Bar: Search + Controls */}
          <div className="px-8 py-3 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900"
                value={sidebarSearchTerm}
                onChange={(e) => setSidebarSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-all">
                  <span>{ccuDesignMode === 'scroll' ? 'Scroll View' : 'Sidebar View'}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden hidden group-hover:block">
                  <button onClick={() => setCcuDesignMode('scroll')} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${ccuDesignMode === 'scroll' ? 'font-medium text-blue-600 bg-blue-50' : 'text-slate-700'}`}>Scroll View</button>
                  <button onClick={() => setCcuDesignMode('sidebar')} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-50 transition-colors ${ccuDesignMode === 'sidebar' ? 'font-medium text-blue-600 bg-blue-50' : 'text-slate-700'}`}>Sidebar View</button>
                </div>
              </div>
            </div>
          </div>

          {/* Visit Info Section */}
          <div className="px-8 pb-4">
            <VisitHeader
              visit={visit}
              onBack={() => setActiveTab('visits')}
              hideScore={true}
              hideTasks={true}
            />
          </div>
        </div>

        {/* Content Body Based on Mode */}
        <div className="h-full">

          {/* MODE: SCROLL (Anchor Navigation) */}
          {ccuDesignMode === 'scroll' && (
            <div className="px-6 h-full">
              <div className="sticky top-0 z-40 bg-[#FDFEFE]/95 backdrop-blur-sm py-3 border-b border-slate-100 -mx-4 px-4 mb-6">
                <div className="flex gap-8 overflow-x-auto no-scrollbar max-w-max">
                  {SECTIONS.map(section => (
                    <SubNavTab
                      key={section.id}
                      id={section.id}
                      label={section.label}
                      icon={section.icon}
                      active={activeAnchor === section.id}
                      onClick={() => scrollToSection(section.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
                <div className="lg:col-span-12 xl:col-span-8 space-y-16">
                  {SECTIONS.map(section => (
                    <div key={section.id} id={section.id} className="scroll-mt-24 pt-4 border-t border-slate-100 first:border-0 first:pt-0">
                      <RenderSection sectionId={section.id} showHeader={false} />
                    </div>
                  ))}
                </div>
                <div className="hidden xl:block xl:col-span-4 h-[calc(100vh-250px)] min-h-[600px] sticky top-32">
                  <PhotoGallery selectedIndex={galleryIndex} />
                </div>
              </div>
            </div>
          )}

          {/* MODE: SIDEBAR (Master-Detail with Shared Header) */}
          {ccuDesignMode === 'sidebar' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-220px)]">
              {/* Left Sidebar: CATEGORY List */}
              <div className="lg:col-span-3 h-full overflow-hidden flex flex-col bg-white shadow-sm z-10">
                <div className="px-6 py-[18px] bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 text-xs">Lista de encuestas</h3>
                  <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{CCU_CATEGORIES.length}</span>
                </div>
                <div className="overflow-y-auto flex-1 p-2 space-y-1">
                  {CCU_CATEGORIES.map(category => {
                    const isActive = ccuCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setCcuCategory(category.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all group border ${isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm border-blue-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'
                          }`}
                      >
                        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                          <span className={`truncate leading-tight w-full text-left text-sm ${isActive ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{category.label}</span>
                          <span className="text-xs font-medium text-slate-500">{category.subtitle}</span>
                          <span className="mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border bg-emerald-100 text-emerald-700 border-emerald-200">
                            {category.status}
                          </span>
                        </div>
                        <ChevronRight size={16} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail Wrapper (Spans 9 cols) */}
              <div className="lg:col-span-9 h-full flex flex-col bg-white">
                {/* HEADLINE + TABS (Shared Header) */}
                <div className="px-6 py-4 flex items-center justify-between gap-3 shrink-0 bg-white">
                  <h2 className="text-base font-semibold text-slate-900 truncate">{CCU_CATEGORIES.find(c => c.id === ccuCategory)?.label}</h2>
                  <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                    {SECTIONS.map(section => (
                      <button
                        key={section.id}
                        onClick={() => setCcuSection(section.id as any)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${ccuSection === section.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                          }`}
                      >
                        {section.shortLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inner Content Grid (Content + Photo) */}
                <div className="flex-1 overflow-hidden grid grid-cols-9 gap-0">
                  {/* Middle: Content */}
                  <div className="col-span-6 h-full overflow-y-auto bg-white">
                    <div className="p-6">
                      <RenderSection sectionId={ccuSection} showHeader={false} />
                    </div>
                  </div>

                  {/* Right: Photo Gallery */}
                  <div className="col-span-3 h-full overflow-hidden flex flex-col bg-white">
                    <div className="px-6 py-4 bg-white">
                      <h3 className="text-sm font-bold text-slate-900">Evidencia Fotográfica</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <PhotoGallery
                        selectedIndex={galleryIndex}
                        doors={
                          ccuSection === 'layout'
                            ? (activeRuleId === 4 ? MOCK_CCU_DOORS_LAYOUT_3 : (activeRuleId === 2 || activeRuleId === 3) ? MOCK_CCU_DOORS_LAYOUT_2 : MOCK_CCU_DOORS_LAYOUT)
                            : ccuSection === 'etiquetas'
                              ? (activeRuleId === 302 ? MOCK_CCU_DOORS_ETIQUETAS_SIN_PRECIO : MOCK_CCU_DOORS_ETIQUETAS)
                              : (activeRuleId === 200 ? MOCK_CCU_DOORS_DESCONTAMINACION : MOCK_CCU_DOORS_CONTAMINATION)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };
  // RENDER FOR AA40258 (SAAS STYLE)
  const renderPriceCollectionDetail = () => {
    // Determine which list to use based on the active sub-tab
    const isDistribution = detailSubTab === 'distribution';

    // Select items for the sidebar based on mode
    // distribution: MOCK_DIST_CATEGORIES (categories, not products)
    // price_collections: REAL_CASE_CATEGORIES
    const allSidebarItems: any[] = isDistribution
      ? MOCK_DIST_CATEGORIES
      : detailSubTab === 'sos'
        ? MOCK_SOS_CATEGORIES
        : REAL_CASE_CATEGORIES;

    const sidebarItems = allSidebarItems.filter(item =>
      !sidebarSearchTerm || item.label.toLowerCase().includes(sidebarSearchTerm.toLowerCase())
    );

    // Ensure selected item is valid
    const currentItem = sidebarItems.find(c => c.id === selectedCategoryId) || sidebarItems[0];

    const getCategoryStats = (catId: string) => {
      const dataSource = isDistribution ? MOCK_DIST_PRODUCTS_POLAR : MOCK_PRODUCTS_POLAR;
      const prod = dataSource.filter((p: any) => p.categoryId === catId);
      return { count: prod.length, tags: prod.length };
    };

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Modern Enterprise SaaS Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200/60">
          {/* Top Bar: Search */}
          <div className="px-8 py-3 flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-400 text-slate-900"
                value={sidebarSearchTerm}
                onChange={(e) => setSidebarSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Visit Info Section */}
          <div className="px-8 pb-4">
            <VisitHeader
              visit={visit}
              onBack={() => setActiveTab('visits')}
              hideScore={true}
              hideTasks={true}
            />
          </div>

          {/* Tab Bar Switcher */}
          <div className="flex gap-6 border-t border-slate-100 px-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setDetailSubTab('distribution'); setSelectedCategoryId(MOCK_DIST_CATEGORIES[0].id); setActiveRightViewMode('list'); setSurveyViewMode('distribution'); }}
              className={`flex items-center gap-2 px-1 py-3 font-semibold text-sm transition-all whitespace-nowrap border-b-2 ${detailSubTab === 'distribution' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <PieChart size={16} strokeWidth={detailSubTab === 'distribution' ? 2.5 : 2} /> Encuestas ({MOCK_DIST_CATEGORIES.length})
            </button>

            <button
              onClick={() => { setDetailSubTab('price_collections'); setSelectedCategoryId(REAL_CASE_CATEGORIES[0].id); setActiveRightViewMode('list'); }}
              className={`flex items-center gap-2 px-1 py-3 font-semibold text-sm transition-all whitespace-nowrap border-b-2 ${detailSubTab === 'price_collections' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={16} strokeWidth={detailSubTab === 'price_collections' ? 2.5 : 2} /> Recolección de Precios (40)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
          {/* Left Column: List (Category or Survey) - NO BORDER */}
          <div className="lg:col-span-3 flex flex-col h-[calc(100vh-250px)]">
            <div className="bg-white flex flex-col overflow-hidden h-full">
              <div className="px-6 py-[18px] bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 text-xs">{isDistribution ? 'Lista de encuestas' : detailSubTab === 'sos' ? 'Categorías' : 'Categoría'}</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-semibold px-2 py-0.5 rounded-full">{sidebarItems.length}</span>
              </div>

              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {sidebarItems.slice((sidebarPage - 1) * itemsPerSidebarPage, sidebarPage * itemsPerSidebarPage).map(item => {
                  const isActive = isDistribution
                    ? selectedCategoryId === item.id
                    : detailSubTab === 'sos'
                      ? selectedSOSCategoryId === item.id
                      : selectedCategoryId === item.id;

                  // Logic for Price Collection Categories
                  const showStats = detailSubTab !== 'sos';
                  const stats = showStats ? getCategoryStats(item.id) : null;

                  // Special styling for SOS items
                  if (detailSubTab === 'sos') {
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSOSCategoryId(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all group ${isActive
                          ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isActive ? 'font-semibold' : ''}>{item.label}:</span>
                          <span className="font-bold text-blue-600">{item.percentage}%</span>
                        </div>
                        <ArrowRight size={16} className={isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'} />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (isDistribution) {
                          setSelectedCategoryId(item.id);
                          setDetailSubTab('distribution');
                          // setActiveRightViewMode('list'); // Keep it stable? 
                          setSelectedProductId(null);
                        } else if (detailSubTab === 'sos') {
                          setSelectedSOSCategoryId(item.id);
                        } else {
                          setSelectedCategoryId(item.id);
                          setActiveRightViewMode('list');
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all group ${isActive
                        ? (isDistribution ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100') // Keep same styling for active
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                        }`}
                    >
                      {detailSubTab === 'sos' ? (
                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex-1 min-w-0 text-left">
                            <div className="font-semibold text-sm text-slate-900 truncate">
                              {item.label} <span className="text-blue-600 ml-1">{(item as any).percentage}%</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${(item as any).status === 'DONE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {(item as any).status === 'DONE' ? 'Listo' : 'Pendiente'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="flex flex-col items-start gap-0.5 min-w-0">
                            <span className="truncate leading-tight w-full text-left text-sm font-semibold text-slate-900">{item.label}</span>

                            {showStats && stats && (
                              <span className="text-xs font-medium text-slate-500">
                                {stats.count} Products
                              </span>
                            )}

                            {isDistribution && (
                              <div className="flex items-center gap-2 mt-0.5">
                                {(item as any).status && (item as any).id !== 'precios' && (
                                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border ${item.status === 'DONE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                    {item.status === 'DONE' ? 'Listo' : 'Pendiente'}
                                  </span>
                                )}

                                {(item as any).id === 'precios' && (
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] border bg-slate-100 text-slate-500 border-slate-200">
                                    Pendiente
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <ChevronRight size={14} className={`opacity-50 transition-opacity flex-shrink-0 ${isActive ? 'opacity-100' : 'group-hover:opacity-75'}`} />
                    </button>
                  )
                })}
              </div>

              {/* Sidebar Pagination Footer */}
              {Math.ceil(sidebarItems.length / itemsPerSidebarPage) > 1 && (
                <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-slate-500">
                    {sidebarPage} / {Math.ceil(sidebarItems.length / itemsPerSidebarPage)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSidebarPage(p => Math.max(1, p - 1))}
                      disabled={sidebarPage === 1}
                      className="p-1 rounded hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={14} className="text-slate-600" />
                    </button>
                    <button
                      onClick={() => setSidebarPage(p => Math.min(Math.ceil(sidebarItems.length / itemsPerSidebarPage), p + 1))}
                      disabled={sidebarPage === Math.ceil(sidebarItems.length / itemsPerSidebarPage)}
                      className="p-1 rounded hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={14} className="text-slate-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detail Panel - NO BORDER */}
          <div className="lg:col-span-9 h-[calc(100vh-250px)]">
            {/* DETAIL VIEW FOR SELECTED SURVEY (Distribution or Price Collections) */}
            {/* Note: distribution now auto-selects, so we always show this view */}
            <div className="h-full flex flex-col bg-white overflow-hidden">
              {/* Custom Header with Toggle if not 'precios' */}
              {isDistribution && (
                <div className="px-6 py-4 flex items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    {/* Removed Back Button as per Price Collection Layout (Sidebar navigation primarily) */}
                    <h2 className="text-base font-semibold text-slate-900">{currentItem.label}</h2>
                  </div>
                  {currentItem.id !== 'precios' && ( // Only show toggle for Distribution surveys (not Price Collections)
                    <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                      <button
                        onClick={() => setSurveyViewMode('distribution')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${surveyViewMode === 'distribution' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Distribución
                      </button>
                      <button
                        onClick={() => setSurveyViewMode('sos')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${surveyViewMode === 'sos' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        SOS
                      </button>
                      <button
                        onClick={() => setSurveyViewMode('rules')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${surveyViewMode === 'rules' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Reglas
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 flex flex-row overflow-hidden">
                {(isDistribution && currentItem.id === 'precios') ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-sm">
                      <AlertTriangle size={32} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Refresco - Nevera Propia no iniciado</h3>
                    <p className="text-sm text-slate-500 max-w-sm">Esta encuesta se encuentra en estado pendiente. No hay datos ni evidencia fotográfica disponible para mostrar.</p>
                  </div>
                ) : surveyViewMode === 'sos' && isDistribution ? ( // If Distribution survey and SOS mode
                  <div className="w-full h-full overflow-hidden">
                    <SOSContent selectedCategoryId={currentItem.id === 'refrescos-anaquel' ? 'colas-negras' : 'colas-negras'} />
                  </div>
                ) : surveyViewMode === 'rules' && isDistribution ? (
                  <div className="w-full h-full overflow-hidden">
                    <RulesContent />
                  </div>
                ) : (isDistribution && currentItem.id === 'refrescos-inventario') ? (
                  <>
                    <div className="w-1/2 h-full flex flex-col bg-white">
                      <div className="px-6 py-4">
                        <h2 className="text-base font-semibold text-slate-900">{currentItem.label}</h2>
                      </div>
                      <div className="p-8 overflow-y-auto flex-1">
                        <h3 className="text-sm font-bold text-slate-900 uppercase mb-6 tracking-wide">RESPUESTAS MANUALES</h3>
                        <div className="space-y-0 divide-y divide-slate-100">
                          {INVENTORY_QUESTIONS.map((q, idx) => (
                            <div key={idx} className="flex justify-between items-start py-6">
                              <span className="text-slate-600 font-medium text-sm w-3/4 pr-4">{q.question}</span>
                              <span className="text-slate-900 font-bold">{q.answer}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 h-full flex flex-col bg-slate-50">
                      <div className="px-6 py-4 bg-white flex justify-between items-center shrink-0">
                        <h3 className="font-semibold text-slate-800">Evidencia Fotográfica</h3>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <PhotoGallery
                          products={MOCK_DIST_PRODUCTS_POLAR.filter(p => p.categoryId === currentItem.id)}
                          categoryId={currentItem.id}
                          selectedProductId={selectedProductId}
                        />
                      </div>
                    </div>
                  </>
                ) : ( // Default: Distribution mode for surveys, or Price Collections
                  <>
                    <div className={`${isDistribution ? 'w-1/2' : 'w-full'} h-full overflow-hidden`}>
                      <SaaSDistributionList
                        category={currentItem}
                        onProductClick={handleProductClick}
                        selectedProductId={selectedProductId}
                        // onBack is handled by the custom header above for distribution
                        // We hide the internal header if we are in Distribution mode (because we show the custom one with toggle)
                        hideHeader={isDistribution}
                        onBack={undefined}
                        products={isDistribution ? MOCK_DIST_PRODUCTS_POLAR : MOCK_PRODUCTS_POLAR}
                        showPrice={!isDistribution}
                        searchTerm={sidebarSearchTerm}
                      />
                    </div>
                    {isDistribution && (
                      <div className="w-1/2 h-full flex flex-col bg-slate-50">
                        <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
                          <h3 className="font-semibold text-slate-800">Evidencia Fotográfica</h3>

                        </div>
                        <div className="flex-1 overflow-y-auto">
                          <PhotoGallery
                            products={currentItem.id === 'overview'
                              ? (isDistribution ? MOCK_DIST_PRODUCTS_POLAR : MOCK_PRODUCTS_POLAR)
                              : (isDistribution ? MOCK_DIST_PRODUCTS_POLAR : MOCK_PRODUCTS_POLAR).filter(p => p.categoryId === currentItem.id)}
                            categoryId={currentItem.id}
                            selectedProductId={selectedProductId}
                            imageSrc={
                              currentItem.id === 'refrescos-anaquel'
                                ? (() => {
                                  switch (selectedProductId) {
                                    case 'p1': return '/fridge-boxes.jpg';
                                    case 'p2': return '/fridge-pepsi-1-5.jpg';
                                    case 'p3': return '/fridge-7up.jpg';
                                    case 'p4': return '/fridge-golden.jpg';
                                    default: return '/fridge-clean.jpg';
                                  }
                                })()
                                : undefined
                            }
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SaaSProductList_REMOVED = () => null; // Placeholder to remove old SaaSDistributionList if needed, I just removed the call.

  // RENDER FOR BB2010 / AA42938 (TABBED LAYOUT)
  const renderTabbedDetail = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <VisitHeader
        visit={{ ...visit, id: selectedVisitId || 'BB2010', customer: selectedVisitId === 'BB2010' ? 'SUPER 10 - BUCARAMANGA 10' : 'Comercializadora Rosal' }}
        onBack={() => setActiveTab('visits')}
        hideScore={true}
        hideTasks={true}
        facingsCount={40}
      />
      <div className="flex gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar pt-2">
        <SubNavTab id="distribution" label="Distribution" icon={<LayoutGrid />} active={detailSubTab === 'distribution'} onClick={() => { setDetailSubTab('distribution'); setActiveRuleId(null); setGalleryIndex(0); }} />
        <SubNavTab id="sos" label="SOS Area" icon={<PieChart />} active={detailSubTab === 'sos'} onClick={() => { setDetailSubTab('sos'); setActiveRuleId(null); setGalleryIndex(1); }} />
        <SubNavTab id="rules" label="Rules" icon={<ClipboardList />} active={detailSubTab === 'rules'} onClick={() => { setDetailSubTab('rules'); setActiveRuleId(null); setGalleryIndex(0); }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          {detailSubTab === 'distribution' && <DistributionList />}
          {detailSubTab === 'sos' && <SOSAnalysis />}
          {detailSubTab === 'rules' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
              <div className="flex items-end justify-between border-b border-slate-100 pb-2">
                <div className="flex flex-col"><span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Audit Overview</span><h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase">Validation Metrics</h3></div>
                <div className="flex items-center gap-2"><span className="text-2xl font-black text-slate-300 tracking-tighter">03</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Checks</span></div>
              </div>
              <DetailedRules customRules={BB2010_RULES} onRuleClick={handleRuleClick} activeRuleId={activeRuleId} />
            </div>
          )}
        </div>
        <div className="lg:col-span-5 h-[calc(100vh-220px)] min-h-[650px] sticky top-8"><PhotoGallery selectedIndex={galleryIndex} /></div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#FDFEFE] overflow-hidden text-sm">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        variant="dark"
      />

      {/* NEW LAYOUT 2: Inner Left Sidebar for Surveys - Only in Detail View */}
      {isLayout2 && activeTab === 'overview' && (
        <aside className={`${isInnerSidebarCollapsed ? 'w-[72px]' : 'w-[320px]'} bg-white border-r border-slate-200 h-full flex flex-col z-20 animate-in slide-in-from-left duration-300 transition-all`}>
          <RightPanel
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={handleCategoryChange}
            withTabs={false}
            collapsible={true}
            isCollapsed={isInnerSidebarCollapsed}
            onCollapseChange={setIsInnerSidebarCollapsed}
          />
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative bg-slate-50">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-[1440px] mx-auto p-4 lg:p-8">
            {activeTab === 'visits' && <VisitList onVisitSelect={handleVisitSelection} />}

            {activeTab === 'overview' && (
              selectedVisitId ? (
                (selectedVisitId === 'BB2010' || selectedVisitId === 'NEW-DESIGN-02') ? renderTabbedDetail() :
                  (selectedVisitId === 'AA40258') ? renderPriceCollectionDetail() :
                    (selectedVisitId === 'AA40299') ? renderCCUDetail() : renderSectionalDetail()
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-400 font-medium">Seleccione una visita para ver el detalle.</div>
              )
            )}

            {activeTab === 'puntos' && <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">Puntos de Venta</h1></div>}
            {activeTab === 'reportes' && <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">Reportes</h1></div>}
            {activeTab === 'config' && <div className="p-8"><h1 className="text-2xl font-bold text-slate-900">Configuración</h1></div>}
          </div>
        </div>

        {/* 
            OLD RIGHT PANEL LOCATION (Right Side)
            Only show if we are in 'overview' mode
          */}
        {activeTab === 'overview' && !isLayout2 && selectedVisitId !== 'AA40258' && selectedVisitId !== 'AA40299' && (
          <aside className="hidden xl:flex border-l border-slate-100 bg-white h-full z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] transition-all ease-in-out duration-300">
            <RightPanel
              categories={CATEGORIES}
              selectedId={selectedCategoryId}
              onSelect={handleCategoryChange}
              collapsible={selectedVisitId === 'NEW-DESIGN-01'}
            />
          </aside>
        )}

        {/* Evidence Panel (Floating) - Shared by Layout 2 and AA40258 Distribution */}
        {activeTab === 'overview' && (isLayout2 || (selectedVisitId === 'AA40258' && detailSubTab === 'distribution')) && activeRightViewMode === 'detail' && (
          <aside className="w-[450px] bg-white border-l border-slate-200 h-full flex flex-col z-30 shadow-2xl absolute right-0 top-0 bottom-0 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <button
                onClick={() => setActiveRightViewMode('list')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800"
              >
                <PanelLeftClose className="rotate-180" size={16} /> <span className="font-bold text-xs uppercase">Ocultar Evidencia</span>
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <PhotoGallery selectedIndex={galleryIndex} />
            </div>
          </aside>
        )}
      </main>
    </div>
  );
};

export default App;
