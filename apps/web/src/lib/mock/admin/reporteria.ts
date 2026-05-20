import type {
  ActividadCiclista,
  AlertaReporte,
  JornadaResumen,
  ReporteKpi,
} from '@/types/admin/reporteria';

export const mockReporteKpis: ReporteKpi[] = [
  { label: 'Total ingresos (mes)', value: '387' },
  { label: 'Total retiros (mes)', value: '379' },
  { label: 'Promedio diario', value: '19.3' },
  { label: 'Tasa de ocupación', value: '66.7%' },
  { label: 'Alertas generadas', value: '8' },
  { label: 'Usuarios activos', value: '6' },
];

export const mockJornadas: JornadaResumen[] = [
  { jornada: 'Mañana (07:00–12:00)', ingresos: 45, retiros: 12, pct: 62 },
  { jornada: 'Tarde (12:00–17:00)', ingresos: 22, retiros: 35, pct: 45 },
  { jornada: 'Noche (17:00–19:00)', ingresos: 8, retiros: 28, pct: 28 },
];

export const mockActividadCiclistas: ActividadCiclista[] = [
  { nombre: 'María González', tipo: 'Funcionario', ingresos: 12, retiros: 12, alertas: 0, ultimo: '2026-05-20' },
  { nombre: 'Carlos Muñoz', tipo: 'Estudiante', ingresos: 8, retiros: 6, alertas: 2, ultimo: '2026-05-18' },
  { nombre: 'Luis Ramírez', tipo: 'Funcionario', ingresos: 10, retiros: 10, alertas: 0, ultimo: '2026-05-20' },
  { nombre: 'Sofía Espinoza', tipo: 'Estudiante', ingresos: 9, retiros: 8, alertas: 1, ultimo: '2026-05-20' },
  { nombre: 'Diego Hernández', tipo: 'Estudiante', ingresos: 6, retiros: 5, alertas: 0, ultimo: '2026-05-19' },
  { nombre: 'Andrés Fuentes', tipo: 'Estudiante', ingresos: 11, retiros: 11, alertas: 0, ultimo: '2026-05-20' },
  { nombre: 'Valentina Castro', tipo: 'Funcionario', ingresos: 4, retiros: 4, alertas: 0, ultimo: '2025-12-10' },
  { nombre: 'Ana Torres', tipo: 'Estudiante', ingresos: 3, retiros: 2, alertas: 3, ultimo: '2026-04-30' },
];

export const mockAlertasReporte: AlertaReporte[] = [
  { usuario: 'Carlos Muñoz', tipo: 'No retiro', fecha: '2026-05-19', estado: 'Activa', correo: true },
  { usuario: 'Sofía Espinoza', tipo: 'No retiro', fecha: '2026-05-18', estado: 'Notificada', correo: true },
  { usuario: 'Ana Torres', tipo: 'Incumplimiento', fecha: '2026-04-30', estado: 'Derivada a bloqueo', correo: true },
  { usuario: 'Carlos Muñoz', tipo: 'No retiro', fecha: '2026-04-15', estado: 'Resuelta', correo: true },
  { usuario: 'Ana Torres', tipo: 'No retiro', fecha: '2026-04-10', estado: 'Resuelta', correo: true },
  { usuario: 'Diego Hernández', tipo: 'Retiro tardío', fecha: '2026-05-10', estado: 'Resuelta', correo: true },
  { usuario: 'María González', tipo: 'No retiro', fecha: '2026-03-22', estado: 'Resuelta', correo: true },
  { usuario: 'Luis Ramírez', tipo: 'Retiro tardío', fecha: '2026-05-05', estado: 'Notificada', correo: true },
];
