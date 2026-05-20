import type { EstadoCupo, ZonaCupo } from './shared';

export interface Cupo {
  id: number;
  numero: number;
  estado: EstadoCupo;
  bicicletaId?: number;
  ciclistaId?: number;
  horaIngreso?: string;
  zona: ZonaCupo;
}
