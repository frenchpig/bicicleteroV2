'use client';

import { useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ChevronRight, Plus, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { CiclistaDetailModal } from '@/components/admin/ciclistas/CiclistaDetailModal';
import { AdminFilterBar } from '@/components/admin/shared/AdminFilterBar';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import { ciclistaFormSchema, type CiclistaFormData } from '@/lib/schemas/ciclista.schema';
import type { Bicicleta } from '@/types/admin/bicicletas';
import type { Ciclista, CiclistaAlerta, CiclistaHistorialItem } from '@/types/admin/ciclistas';

interface CiclistasViewProps {
  ciclistas: Ciclista[];
  bicicletas: Bicicleta[];
  historial: CiclistaHistorialItem[];
  alertas: CiclistaAlerta[];
}

export function CiclistasView({
  ciclistas,
  bicicletas,
  historial,
  alertas,
}: CiclistasViewProps) {
  const { showSuccess } = useAdminToast();
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [seleccionado, setSeleccionado] = useState<Ciclista | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CiclistaFormData>({
    resolver: zodResolver(ciclistaFormSchema),
    defaultValues: { tipo: 'estudiante' },
  });

  const filtrados = useMemo(
    () =>
      ciclistas.filter((c) => {
        const matchSearch =
          search === '' ||
          `${c.nombre} ${c.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
          c.run.includes(search) ||
          c.correo.toLowerCase().includes(search.toLowerCase());
        const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
        return matchSearch && matchEstado;
      }),
    [ciclistas, search, filtroEstado],
  );

  function onCreate(data: CiclistaFormData) {
    void data;
    showSuccess('Ciclista creado correctamente (simulado).');
    setCreateOpen(false);
    reset();
  }

  return (
    <div>
      <AdminPageHeader
        title="Ciclistas"
        description={`${ciclistas.length} ciclistas registrados en esta sede`}
        actions={
          <Button
            type="button"
            className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
            Crear ciclista
          </Button>
        }
      />

      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar por nombre, RUN o correo..."
        meta={`${filtrados.length} resultado${filtrados.length !== 1 ? 's' : ''}`}
      >
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm text-[#1B1B1B] dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
        >
          <option value="todos">Todos los estados</option>
          <option value="habilitado">Habilitados</option>
          <option value="alerta">Con alerta</option>
          <option value="bloqueado">Bloqueados</option>
          <option value="inactivo">Inactivos</option>
        </select>
      </AdminFilterBar>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
        {filtrados.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto mb-3 size-10 text-neutral-200 dark:text-zinc-700" />
            <p className="font-semibold text-[#616161] dark:text-zinc-400">
              No se encontraron ciclistas
            </p>
            <p className="text-sm text-[#616161]">Cambia los filtros o crea un nuevo ciclista.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
              <tr className="border-b border-black/10 dark:border-zinc-800">
                {['Ciclista', 'RUN', 'Tipo', 'Estado', 'Alertas', 'Último ingreso', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium text-[#616161] dark:text-zinc-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer border-b border-black/5 transition-colors hover:bg-[#EBF1F7] dark:border-zinc-800/50 dark:hover:bg-zinc-900"
                  onClick={() => setSeleccionado(c)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#1E4C7C] text-xs font-semibold text-white dark:bg-zinc-700">
                        {c.nombre[0]}
                        {c.apellido[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B1B1B] dark:text-zinc-50">
                          {c.nombre} {c.apellido}
                        </p>
                        <p className="text-[0.7rem] text-[#616161]">{c.correo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[#616161] dark:text-zinc-400">{c.run}</td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={c.tipo} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant={c.estado} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    {c.alertas > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="size-3.5" />
                        {c.alertas}
                      </span>
                    ) : (
                      <span className="text-[#616161]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#616161] dark:text-zinc-400">
                    {c.ultimoIngreso ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="size-4 text-neutral-300 dark:text-zinc-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {seleccionado && (
        <CiclistaDetailModal
          ciclista={seleccionado}
          bicicletas={bicicletas}
          historial={historial}
          alertas={alertas}
          open={!!seleccionado}
          onClose={() => setSeleccionado(null)}
        />
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="dark:border-zinc-800 dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-50">Crear ciclista</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="run">RUN</Label>
              <Input id="run" {...register('run')} />
              {errors.run && (
                <p className="text-sm text-destructive">{errors.run.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input id="nombre" {...register('nombre')} />
                {errors.nombre && (
                  <p className="text-sm text-destructive">{errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input id="apellido" {...register('apellido')} />
                {errors.apellido && (
                  <p className="text-sm text-destructive">{errors.apellido.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input id="correo" type="email" {...register('correo')} />
              {errors.correo && (
                <p className="text-sm text-destructive">{errors.correo.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" {...register('telefono')} />
              {errors.telefono && (
                <p className="text-sm text-destructive">{errors.telefono.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <select
                id="tipo"
                {...register('tipo')}
                className="flex h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
              >
                <option value="funcionario">Funcionario</option>
                <option value="estudiante">Estudiante</option>
              </select>
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
                Crear
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
