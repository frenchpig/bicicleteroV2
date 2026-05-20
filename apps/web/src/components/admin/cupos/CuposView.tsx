'use client';

import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  cn,
} from '@app/ui';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import type { Bicicleta } from '@/types/admin/bicicletas';
import type { Ciclista } from '@/types/admin/ciclistas';
import type { Cupo } from '@/types/admin/cupos';
import type { EstadoCupo, ZonaCupo } from '@/types/admin/shared';

type Vista = 'mapa' | 'lista';

const ESTADO_STYLES: Record<
  EstadoCupo,
  { bg: string; border: string; text: string; label: string }
> = {
  libre: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-300 dark:border-green-700',
    text: 'text-green-800 dark:text-green-300',
    label: 'Libre',
  },
  ocupado: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-300 dark:border-blue-700',
    text: 'text-blue-800 dark:text-blue-300',
    label: 'Ocupado',
  },
  alerta: {
    bg: 'bg-amber-50 dark:bg-amber-950',
    border: 'border-amber-300 dark:border-amber-700',
    text: 'text-amber-800 dark:text-amber-300',
    label: 'Alerta',
  },
  'no-disponible': {
    bg: 'bg-neutral-100 dark:bg-zinc-800',
    border: 'border-neutral-300 dark:border-zinc-600',
    text: 'text-[#616161] dark:text-zinc-400',
    label: 'No disponible',
  },
};

const ZONAS: ZonaCupo[] = ['A', 'B', 'C'];

interface CuposViewProps {
  cupos: Cupo[];
  ciclistas: Ciclista[];
  bicicletas: Bicicleta[];
}

export function CuposView({ cupos, ciclistas, bicicletas }: CuposViewProps) {
  const { showSuccess } = useAdminToast();
  const [vista, setVista] = useState<Vista>('mapa');
  const [detalle, setDetalle] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const stats = useMemo(() => {
    const libres = cupos.filter((c) => c.estado === 'libre').length;
    const ocupados = cupos.filter((c) => c.estado === 'ocupado' || c.estado === 'alerta').length;
    const alertas = cupos.filter((c) => c.estado === 'alerta').length;
    const noDisp = cupos.filter((c) => c.estado === 'no-disponible').length;
    return { libres, ocupados, alertas, noDisp };
  }, [cupos]);

  const cupoDetalle = detalle !== null ? cupos.find((c) => c.id === detalle) : null;
  const ciclistaDetalle = cupoDetalle?.ciclistaId
    ? ciclistas.find((c) => c.id === cupoDetalle.ciclistaId)
    : null;
  const biciDetalle = cupoDetalle?.bicicletaId
    ? bicicletas.find((b) => b.id === cupoDetalle.bicicletaId)
    : null;

  return (
    <div>
      <AdminPageHeader
        title="Cupos"
        description={`${stats.libres} libres · ${stats.ocupados} ocupados · ${stats.alertas} con alerta · ${stats.noDisp} no disponibles`}
        actions={
          <div className="flex gap-2">
            <div className="flex rounded-lg bg-[#EBF1F7] p-0.5 dark:bg-zinc-800">
              {(['mapa', 'lista'] as Vista[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVista(v)}
                  className={cn(
                    'rounded-md px-3.5 py-1.5 text-sm transition-colors',
                    vista === v
                      ? 'bg-[#1E4C7C] text-white dark:bg-zinc-50 dark:text-zinc-900'
                      : 'text-[#616161] dark:text-zinc-400',
                  )}
                >
                  {v === 'mapa' ? 'Mapa' : 'Lista'}
                </button>
              ))}
            </div>
            <Button
              type="button"
              className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
              onClick={() => setShowModal(true)}
            >
              <Plus className="size-4" />
              Crear cupos
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap gap-4">
        {Object.entries(ESTADO_STYLES).map(([estado, cfg]) => (
          <div key={estado} className="flex items-center gap-2 text-sm text-[#616161] dark:text-zinc-400">
            <span className={cn('size-3 rounded-sm border', cfg.bg, cfg.border)} />
            {cfg.label}
          </div>
        ))}
      </div>

      {vista === 'mapa' && (
        <div className="space-y-4">
          {ZONAS.map((zona) => {
            const zonasCupos = cupos.filter((c) => c.zona === zona);
            return (
              <article
                key={zona}
                className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex items-center justify-between border-b border-black/5 bg-[#EBF1F7] px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <div>
                    <span className="font-bold text-[#1B1B1B] dark:text-zinc-50">Zona {zona}</span>
                    <span className="ml-2 text-sm text-[#616161]">
                      {zonasCupos.filter((c) => c.estado === 'libre').length} libres de{' '}
                      {zonasCupos.length}
                    </span>
                  </div>
                  {zona === 'A' && (
                    <span className="rounded-full bg-[#E1F5FE] px-2 py-0.5 text-xs text-[#0288D1] dark:bg-cyan-950 dark:text-cyan-300">
                      Más cercana a guardia
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2.5 p-5">
                  {zonasCupos.map((c) => {
                    const cfg = ESTADO_STYLES[c.estado];
                    const isSelected = detalle === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setDetalle(isSelected ? null : c.id)}
                        className={cn(
                          'flex h-[72px] flex-col items-center justify-center gap-1 rounded-[10px] border-2 transition-all',
                          isSelected
                            ? 'border-[#1E4C7C] bg-[#1E4C7C] dark:border-zinc-50 dark:bg-zinc-50'
                            : cn(cfg.bg, cfg.border),
                        )}
                      >
                        <span
                          className={cn(
                            'text-lg font-bold',
                            isSelected ? 'text-white dark:text-zinc-900' : cfg.text,
                          )}
                        >
                          {c.numero}
                        </span>
                        <span
                          className={cn(
                            'text-[0.6rem] font-medium uppercase tracking-wide',
                            isSelected ? 'text-[#C5D9E8] dark:text-zinc-600' : cfg.text,
                          )}
                        >
                          {cfg.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {vista === 'lista' && (
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
              <tr>
                {['Cupo', 'Zona', 'Estado', 'Ciclista', 'Bicicleta', 'Hora ingreso', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#616161]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cupos.map((c) => {
                const owner = c.ciclistaId ? ciclistas.find((ci) => ci.id === c.ciclistaId) : null;
                const bici = c.bicicletaId ? bicicletas.find((b) => b.id === c.bicicletaId) : null;
                const cfg = ESTADO_STYLES[c.estado];
                return (
                  <tr
                    key={c.id}
                    className="border-b border-black/5 hover:bg-[#EBF1F7] dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <td className="px-4 py-3 font-bold dark:text-zinc-50">#{c.numero}</td>
                    <td className="px-4 py-3 text-[#616161]">Zona {c.zona}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium',
                          cfg.bg,
                          cfg.border,
                          cfg.text,
                        )}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#616161] dark:text-zinc-300">
                      {owner ? `${owner.nombre} ${owner.apellido}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#616161] dark:text-zinc-300">
                      {bici ? `${bici.marca} - ${bici.color}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-[#616161]">{c.horaIngreso ?? '—'}</td>
                    <td className="px-4 py-3">
                      {c.estado === 'libre' && (
                        <button
                          type="button"
                          className="text-xs text-red-600 underline dark:text-red-400"
                          onClick={() => showSuccess('Cupo eliminado (simulado).')}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {cupoDetalle && (
        <aside className="fixed right-6 top-24 z-40 w-72 rounded-xl border border-black/10 bg-white p-5 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold dark:text-zinc-50">Cupo #{cupoDetalle.numero}</h3>
            <button type="button" onClick={() => setDetalle(null)} className="text-[#616161]">
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#616161]">Zona</span>
              <span className="font-semibold dark:text-zinc-50">{cupoDetalle.zona}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#616161]">Estado</span>
              <span className={cn('font-semibold', ESTADO_STYLES[cupoDetalle.estado].text)}>
                {ESTADO_STYLES[cupoDetalle.estado].label}
              </span>
            </div>
            {ciclistaDetalle && (
              <div className="border-t border-black/5 pt-2.5 dark:border-zinc-800">
                <p className="text-[#616161]">Ciclista</p>
                <p className="font-semibold dark:text-zinc-50">
                  {ciclistaDetalle.nombre} {ciclistaDetalle.apellido}
                </p>
                <p className="font-mono text-xs text-[#616161]">{ciclistaDetalle.run}</p>
              </div>
            )}
            {biciDetalle && (
              <div>
                <p className="text-[#616161]">Bicicleta</p>
                <p className="font-semibold dark:text-zinc-50">
                  {biciDetalle.marca} — {biciDetalle.color}
                </p>
              </div>
            )}
            {cupoDetalle.estado === 'libre' && (
              <Button
                type="button"
                variant="outline"
                className="mt-2 w-full border-red-200 text-red-700 dark:border-red-900 dark:text-red-400"
                onClick={() => showSuccess('Cupo eliminado (simulado).')}
              >
                Eliminar cupo
              </Button>
            )}
            {cupoDetalle.estado === 'ocupado' && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                No puedes eliminar un cupo ocupado. Libera el cupo antes de continuar.
              </p>
            )}
          </div>
        </aside>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="dark:border-zinc-800 dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-50">Crear cupos</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#616161]">Define los nuevos cupos a agregar al bicicletero.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Zona</Label>
              <select className="flex h-10 w-full rounded-md border border-black/10 bg-[#F6F8FA] px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50">
                <option value="A">Zona A</option>
                <option value="B">Zona B</option>
                <option value="C">Zona C</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Cantidad de cupos</Label>
              <input
                type="number"
                min={1}
                max={20}
                defaultValue={5}
                className="flex h-10 w-full rounded-md border border-black/10 bg-[#F6F8FA] px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
              onClick={() => {
                setShowModal(false);
                showSuccess('Cupos creados correctamente (simulado).');
              }}
            >
              Crear cupos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
