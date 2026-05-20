export type EstadoDispositivo = 'activo' | 'inactivo' | 'error';

export type MetodoIdentificacion = 'run' | 'qr' | 'biometria';

export interface Dispositivo {
  id: number;
  nombre: string;
  ubicacion: string;
  estado: EstadoDispositivo;
  ultimaConexion: string;
  ip: string;
  metodosHabilitados: MetodoIdentificacion[];
  sede: string;
}
