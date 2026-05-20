'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Plus, Star, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@app/ui';
import { AdminFilterBar } from '@/components/admin/shared/AdminFilterBar';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import type { Visita } from '@/types/admin/visitas';

const visitaSchema = z.object({
  run: z.string().min(8, 'RUN inválido'),
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  correo: z.string().email('Correo inválido'),
});

type VisitaFormData = z.infer<typeof visitaSchema>;

interface VisitasViewProps {
  visitas: Visita[];
}

export function VisitasView({ visitas }: VisitasViewProps) {
  const { showSuccess } = useAdminToast();
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitaFormData>({ resolver: zodResolver(visitaSchema) });

  const filtradas = useMemo(
    () =>
      visitas.filter((v) => {
        const matchSearch =
          search === '' ||
          `${v.nombre} ${v.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
          v.run.includes(search);
        const matchFiltro =
          filtro === 'todos' ||
          (filtro === 'frecuente' ? v.esFrecuente : v.estado === filtro);
        return matchSearch && matchFiltro;
      }),
    [visitas, search, filtro],
  );

  const frecuentes = visitas.filter((v) => v.esFrecuente).length;

  function onCreate(data: VisitaFormData) {
    void data;
    showSuccess('Visita registrada correctamente (simulado).');
    setCreateOpen(false);
    reset();
  }

  return (
    <div>
      <AdminPageHeader
        title="Visitas"
        description={`${visitas.length} visitas registradas · ${frecuentes} frecuentes`}
        actions={
          <Button
            type="button"
            className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
            Registrar visita
          </Button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre o RUN..."
      >
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
        >
          <option value="todos">Todas</option>
          <option value="frecuente">Frecuentes</option>
          <option value="activa">Activas</option>
          <option value="bloqueada">Bloqueadas</option>
        </select>
      </AdminFilterBar>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {filtradas.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto mb-3 size-10 text-neutral-200" />
            <p className="font-semibold text-[#616161] dark:text-zinc-400">
              No se encontraron visitas
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
              <tr>
                {['Visita', 'RUN', 'Estado', 'Visitas', 'Última visita', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#616161]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtradas.map((v) => (
                <tr
                  key={v.id}
                  className="cursor-pointer border-b border-black/5 hover:bg-[#EBF1F7] dark:border-zinc-800 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                        {v.nombre[0]}
                        {v.apellido[0]}
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 font-semibold dark:text-zinc-50">
                          {v.nombre} {v.apellido}
                          {v.esFrecuente && (
                            <Star className="size-3 fill-amber-500 text-amber-500" />
                          )}
                        </p>
                        <p className="text-[0.7rem] text-[#616161]">{v.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#616161]">{v.run}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={v.estado === 'activa' ? 'habilitado' : 'bloqueado'}
                      size="sm"
                      label={v.estado === 'activa' ? 'Activa' : 'Bloqueada'}
                    />
                    {v.esFrecuente && (
                      <span className="ml-1.5 inline-block">
                        <StatusBadge variant="frecuente" size="sm" />
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold dark:text-zinc-50">{v.totalVisitas}</td>
                  <td className="px-4 py-3 text-[#616161]">{v.ultimaVisita}</td>
                  <td className="px-4 py-3">
                    <ChevronRight className="size-4 text-neutral-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="dark:border-zinc-800 dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-50">Registrar visita</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="v-run">RUN</Label>
              <Input id="v-run" {...register('run')} />
              {errors.run && <p className="text-sm text-destructive">{errors.run.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="v-nombre">Nombre</Label>
                <Input id="v-nombre" {...register('nombre')} />
                {errors.nombre && (
                  <p className="text-sm text-destructive">{errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-apellido">Apellido</Label>
                <Input id="v-apellido" {...register('apellido')} />
                {errors.apellido && (
                  <p className="text-sm text-destructive">{errors.apellido.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-correo">Correo</Label>
              <Input id="v-correo" type="email" {...register('correo')} />
              {errors.correo && (
                <p className="text-sm text-destructive">{errors.correo.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
              >
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
