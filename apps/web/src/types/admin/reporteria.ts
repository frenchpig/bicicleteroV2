export type ReporteTab = 'general' | 'ocupacion' | 'horarios' | 'usuarios' | 'alertas';

export interface ReporteKpi {
  label: string;
  value: string;
}

export interface JornadaResumen {
  jornada: string;
  ingresos: number;
  retiros: number;
  pct: number;
}

export interface ActividadCiclista {
  nombre: string;
  tipo: string;
  ingresos: number;
  retiros: number;
  alertas: number;
  ultimo: string;
}

export interface AlertaReporte {
  usuario: string;
  tipo: string;
  fecha: string;
  estado: string;
  correo: boolean;
}
