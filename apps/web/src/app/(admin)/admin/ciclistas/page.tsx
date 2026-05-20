'use client';

import { CiclistasView } from '@/components/admin/ciclistas/CiclistasView';
import { mockBicicletas } from '@/lib/mock/admin/bicicletas';
import {
  mockCiclistaAlertas,
  mockCiclistaHistorial,
  mockCiclistas,
} from '@/lib/mock/admin/ciclistas';

export default function AdminCiclistasPage() {
  return (
    <CiclistasView
      ciclistas={mockCiclistas}
      bicicletas={mockBicicletas}
      historial={mockCiclistaHistorial}
      alertas={mockCiclistaAlertas}
    />
  );
}
