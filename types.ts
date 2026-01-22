
export interface MetricItem {
  label: string;
  value: number;
  status?: 'passed' | 'failed' | 'neutral';
}

export interface ProductItem {
  name: string;
  sku: string;
  facings: number | string;
  image: string;
}

export interface SOSCategory {
  label: string;
  percentage: number;
}

export interface SurveySection {
  id: string;
  title: string;
  score: number;
  status: 'DONE' | 'PENDING';
  validCount: number;
  totalTarget: number;
  invalidCount: number;
  taskCount: number;
  metrics: MetricItem[];
  layout: { valid: number; total: number; invalid: number };
  contaminacion: { valid: number; total: number; invalid: number };
  priceTags: { valid: number; total: number; invalid: number };
}

export interface VisitData {
  id: string;
  customer: string;
  score: number;
  date: string;
  supervisor: string;
  location: string;
  status: 'Completed' | 'Pending' | 'In Progress';
  surveys: SurveySection[];
}

export interface VisitListItem {
  id: string;
  tienda: string;
  nota: number;
  fechaInicio: string;
  fechaFin: string;
  tareas: number;
  asignadoA: string;
  realizadoPor?: string;
  estado: string;
  // Extended fields
  supervisorId?: string;
  supervisor?: string;
  statusId?: string;
  distancia?: string;
  routeKey?: string;
  tipo?: string;
  executionStatus?: 'Ejecutada' | 'No Visitada';
  taskNames?: string[];
}
