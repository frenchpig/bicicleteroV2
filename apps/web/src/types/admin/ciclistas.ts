import type { EstadoAlerta, EstadoCiclista, TipoAlerta, TipoUsuario } from './shared';

export interface Ciclista {
  id: number;
  run: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  tipo: TipoUsuario;
  estado: EstadoCiclista;
  alertas: number;
  fechaRegistro: string;
  ultimoIngreso?: string;
  bicicletaIds: number[];
  motivoBloqueo?: string;
}

export interface CiclistaHistorialItem {
  fecha: string;
  tipo: 'ingreso' | 'retiro';
  bici: string;
  cupo: number;
}

export interface CiclistaAlerta {
  id: number;
  ciclistaId: number;
  tipo: TipoAlerta;
  estado: EstadoAlerta;
  fecha: string;
  motivo: string;
  correoEnviado: boolean;
}
