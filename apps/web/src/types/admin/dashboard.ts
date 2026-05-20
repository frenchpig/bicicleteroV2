import type { EstadoCumplimiento, TipoUsuario, ZonaCupo } from './shared';
import type { EstadoAlerta, TipoAlerta } from './shared';

export interface IngresoActivo {
  id: number;
  ciclista: string;
  run: string;
  tipo: TipoUsuario | 'visita';
  bicicleta: string;
  marca: string;
  color: string;
  cupo: number;
  zona: ZonaCupo;
  horaIngreso: string;
  minutosTranscurridos: number;
  estadoCumplimiento: EstadoCumplimiento;
}

export interface AlertaResumen {
  id: number;
  ciclistaId: number;
  ciclistaNombre: string;
  run: string;
  bicicletaDesc: string;
  cupo: number;
  tipo: TipoAlerta;
  estado: EstadoAlerta;
  fecha: string;
  motivo: string;
  correoEnviado: boolean;
}

export interface OcupacionDia {
  dia: string;
  ocupacion: number;
  capacidad: number;
}

export interface OcupacionHorario {
  horario: string;
  ingresos: number;
}

export interface DistribucionEstado {
  name: string;
  value: number;
  color: string;
}
