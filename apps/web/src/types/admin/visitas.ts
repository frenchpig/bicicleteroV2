export type EstadoVisita = 'activa' | 'bloqueada';

export interface Visita {
  id: number;
  run: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  estado: EstadoVisita;
  totalVisitas: number;
  ultimaVisita: string;
  esFrecuente: boolean;
}
