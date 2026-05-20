'use client';

import { DashboardView } from '@/components/admin/dashboard/DashboardView';
import {
  mockAlertasResumen,
  mockDistribucionEstados,
  mockIngresosActivos,
  mockOcupacionPorDia,
  mockOcupacionPorHorario,
} from '@/lib/mock/admin/dashboard';
import { mockCupos } from '@/lib/mock/admin/cupos';

export default function AdminDashboardPage() {
  return (
    <DashboardView
      cupos={mockCupos}
      alertas={mockAlertasResumen}
      ingresosActivos={mockIngresosActivos}
      ocupacionPorDia={mockOcupacionPorDia}
      ocupacionPorHorario={mockOcupacionPorHorario}
      distribucionEstados={mockDistribucionEstados}
    />
  );
}
