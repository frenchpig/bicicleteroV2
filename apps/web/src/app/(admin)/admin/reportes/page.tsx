'use client';

import { ReporteriaView } from '@/components/admin/reporteria/ReporteriaView';
import { mockDistribucionEstados, mockOcupacionPorDia, mockOcupacionPorHorario } from '@/lib/mock/admin/dashboard';
import {
  mockActividadCiclistas,
  mockAlertasReporte,
  mockJornadas,
  mockReporteKpis,
} from '@/lib/mock/admin/reporteria';

export default function AdminReportesPage() {
  return (
    <ReporteriaView
      kpis={mockReporteKpis}
      ocupacionPorDia={mockOcupacionPorDia}
      ocupacionPorHorario={mockOcupacionPorHorario}
      distribucionEstados={mockDistribucionEstados}
      jornadas={mockJornadas}
      actividadCiclistas={mockActividadCiclistas}
      alertasReporte={mockAlertasReporte}
    />
  );
}
