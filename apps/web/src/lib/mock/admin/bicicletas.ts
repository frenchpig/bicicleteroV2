import type { Bicicleta } from '@/types/admin/bicicletas';

export const mockBicicletas: Bicicleta[] = [
  { id: 1, marca: 'Trek', tipo: 'urbana', color: 'Azul', numeroSerie: 'TRK-2023-4521', estado: 'activa', propietarioId: 1 },
  { id: 2, marca: 'Giant', tipo: 'ruta', color: 'Rojo', estado: 'activa', propietarioId: 1 },
  { id: 3, marca: 'Specialized', tipo: 'montaña', color: 'Negro', numeroSerie: 'SPZ-2022-8834', estado: 'activa', propietarioId: 2 },
  { id: 4, marca: 'Scott', tipo: 'urbana', color: 'Blanco', estado: 'activa', propietarioId: 3 },
  { id: 5, marca: 'Merida', tipo: 'urbana', color: 'Gris', numeroSerie: 'MRD-2024-1123', estado: 'activa', propietarioId: 4 },
  { id: 6, marca: 'Cannondale', tipo: 'ruta', color: 'Verde', estado: 'activa', propietarioId: 5 },
  { id: 7, marca: 'Trek', tipo: 'plegable', color: 'Negro', numeroSerie: 'TRK-2023-7890', estado: 'activa', propietarioId: 6 },
  { id: 8, marca: 'Cube', tipo: 'electrica', color: 'Azul marino', estado: 'inactiva', propietarioId: 7 },
  { id: 9, marca: 'Orbea', tipo: 'montaña', color: 'Naranja', numeroSerie: 'ORB-2025-3344', estado: 'activa', propietarioId: 8 },
  { id: 10, marca: 'BMC', tipo: 'ruta', color: 'Rojo', numeroSerie: 'BMC-2024-9012', estado: 'activa', propietarioId: 8 },
];
