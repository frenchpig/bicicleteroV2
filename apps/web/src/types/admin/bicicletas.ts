export type TipoBicicleta = 'urbana' | 'montaña' | 'ruta' | 'electrica' | 'plegable';

export type EstadoBicicleta = 'activa' | 'inactiva';

export interface Bicicleta {
  id: number;
  marca: string;
  tipo: TipoBicicleta;
  color: string;
  numeroSerie?: string;
  descripcion?: string;
  estado: EstadoBicicleta;
  propietarioId: number;
}
