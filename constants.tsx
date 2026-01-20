
import React from 'react';
import { LayoutDashboard, Store, ClipboardList, BarChart3, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { VisitData } from './types';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'pos', label: 'Puntos de Venta', icon: <Store size={20} /> },
  { id: 'visits', label: 'Visitas', icon: <ClipboardList size={20} /> },
  { id: 'reports', label: 'Reportes', icon: <BarChart3 size={20} /> },
  { id: 'config', label: 'Configuración', icon: <Settings size={20} /> },
];

export const MOCK_VISIT: VisitData = {
  id: 'AA42937',
  customer: 'GENOVEVA ADASME MEJIAS',
  score: 50,
  date: '30/10/2025 11:00 p.m.',
  supervisor: 'SUPERVISOR WISY - 01',
  location: 'Av. Providencia 1266, Piso 4, Providencia, Región Metropolitana, Santiago, Chile',
  status: 'Completed',
  surveys: [
    {
      id: 'beer',
      title: 'Cervezas',
      // Fix: score must be a number as defined in types.ts (was previously '50/100')
      score: 50,
      status: 'DONE',
      validCount: 24,
      totalTarget: 3,
      invalidCount: 1,
      taskCount: 4,
      metrics: [
        { label: 'Contaminación interna', value: 1 },
        { label: 'Contaminación externa', value: 1 },
        { label: 'Contaminación mixta', value: 1 },
      ],
      // Structural fields for detailed breakdown as defined in updated SurveySection type
      layout: { valid: 73, total: 100, invalid: 27 },
      contaminacion: { valid: 24, total: 24, invalid: 0 },
      priceTags: { valid: 38, total: 38, invalid: 0 }
    }
  ]
};