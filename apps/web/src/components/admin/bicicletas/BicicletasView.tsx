'use client';

import { useMemo, useState } from 'react';
import { Bike, Plus } from 'lucide-react';
import { Button, cn } from '@app/ui';
import { AdminFilterBar } from '@/components/admin/shared/AdminFilterBar';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import type { Bicicleta, TipoBicicleta } from '@/types/admin/bicicletas';
import type { Ciclista } from '@/types/admin/ciclistas';

const TIPO_LABELS: Record<TipoBicicleta, string> = {
  urbana: 'Urbana',
  montaña: 'Montaña',
  ruta: 'Ruta',
  electrica: 'Eléctrica',
  plegable: 'Plegable',
};

const COLOR_BG: Record<string, string> = {
  Azul: 'bg-blue-50 dark:bg-blue-950',
  Rojo: 'bg-red-50 dark:bg-red-950',
  Negro: 'bg-neutral-100 dark:bg-zinc-800',
  Blanco: 'bg-neutral-50 dark:bg-zinc-900',
  Gris: 'bg-neutral-100 dark:bg-zinc-800',
  Verde: 'bg-green-50 dark:bg-green-950',
  Naranja: 'bg-orange-50 dark:bg-orange-950',
  'Azul marino': 'bg-blue-50 dark:bg-blue-950',
};

interface BicicletasViewProps {
  bicicletas: Bicicleta[];
  ciclistas: Ciclista[];
}

export function BicicletasView({ bicicletas, ciclistas }: BicicletasViewProps) {
  const [search, setSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const filtradas = useMemo(
    () =>
      bicicletas.filter((b) => {
        const owner = ciclistas.find((c) => c.id === b.propietarioId);
        const matchSearch =
          search === '' ||
          b.marca.toLowerCase().includes(search.toLowerCase()) ||
          b.color.toLowerCase().includes(search.toLowerCase()) ||
          (b.numeroSerie?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
          (owner &&
            `${owner.nombre} ${owner.apellido}`.toLowerCase().includes(search.toLowerCase()));
        const matchTipo = filtroTipo === 'todos' || b.tipo === filtroTipo;
        return matchSearch && matchTipo;
      }),
    [bicicletas, ciclistas, search, filtroTipo],
  );

  return (
    <div>
      <AdminPageHeader
        title="Bicicletas"
        description={`${bicicletas.length} bicicletas registradas`}
        actions={
          <Button
            type="button"
            className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
          >
            <Plus className="size-4" />
            Agregar bicicleta
          </Button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por marca, color, serie o propietario..."
      >
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
        >
          <option value="todos">Todos los tipos</option>
          {Object.entries(TIPO_LABELS).map(([t, label]) => (
            <option key={t} value={t}>
              {label}
            </option>
          ))}
        </select>
      </AdminFilterBar>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
        {filtradas.length === 0 && (
          <div className="col-span-full rounded-xl border border-black/10 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-950">
            <Bike className="mx-auto mb-3 size-10 text-neutral-200 dark:text-zinc-700" />
            <p className="font-semibold text-[#616161] dark:text-zinc-400">
              No se encontraron bicicletas
            </p>
          </div>
        )}
        {filtradas.map((b) => {
          const owner = ciclistas.find((c) => c.id === b.propietarioId);
          return (
            <article
              key={b.id}
              className="cursor-pointer overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
            >
              <div
                className={cn(
                  'flex h-[120px] items-center justify-center',
                  COLOR_BG[b.color] ?? 'bg-[#F6F8FA] dark:bg-zinc-900',
                )}
              >
                <Bike className="size-12 text-[#1E4C7C] opacity-30 dark:text-zinc-400" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[#1B1B1B] dark:text-zinc-50">{b.marca}</p>
                    <p className="text-sm text-[#616161]">
                      {TIPO_LABELS[b.tipo]} · {b.color}
                    </p>
                  </div>
                  <StatusBadge
                    variant={b.estado === 'activa' ? 'habilitado' : 'inactivo'}
                    size="sm"
                    label={b.estado}
                  />
                </div>
                {b.numeroSerie && (
                  <p className="mb-2 font-mono text-xs text-[#616161]">N° {b.numeroSerie}</p>
                )}
                {owner && (
                  <div className="flex items-center gap-2 rounded-lg bg-[#EBF1F7] px-2.5 py-2 dark:bg-zinc-900">
                    <div className="flex size-[22px] items-center justify-center rounded-full bg-[#1E4C7C] text-[0.6rem] font-bold text-white dark:bg-zinc-700">
                      {owner.nombre[0]}
                      {owner.apellido[0]}
                    </div>
                    <span className="text-xs text-[#616161] dark:text-zinc-400">
                      {owner.nombre} {owner.apellido}
                    </span>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
