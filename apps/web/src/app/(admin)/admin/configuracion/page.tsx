'use client';

import { ConfiguracionView } from '@/components/admin/configuracion/ConfiguracionView';
import {
  mockConfiguracionAlertas,
  mockConfiguracionBloqueos,
  mockConfiguracionCorreos,
  mockConfiguracionGeneral,
  mockConfiguracionIdentificacion,
  mockConfiguracionVisitas,
  mockTerminos,
  mockVistaPreviaCorreos,
} from '@/lib/mock/admin/configuracion';

export default function AdminConfiguracionPage() {
  return (
    <ConfiguracionView
      general={mockConfiguracionGeneral}
      identificacion={mockConfiguracionIdentificacion}
      visitas={mockConfiguracionVisitas}
      correos={mockConfiguracionCorreos}
      alertas={mockConfiguracionAlertas}
      bloqueos={mockConfiguracionBloqueos}
      terminos={mockTerminos}
      vistaPreviaCorreos={mockVistaPreviaCorreos}
    />
  );
}
