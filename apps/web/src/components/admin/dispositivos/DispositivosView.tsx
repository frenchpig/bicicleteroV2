'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Monitor, Plus, Wifi } from 'lucide-react';
import Link from 'next/link';
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
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import type { Dispositivo } from '@/types/admin/dispositivos';

const totemSchema = z.object({
  nombre: z.string().min(3, 'Nombre requerido'),
  ubicacion: z.string().min(5, 'Ubicación requerida'),
  ip: z.string().ip('IP inválida'),
  usuario: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type TotemFormData = z.infer<typeof totemSchema>;

interface DispositivosViewProps {
  dispositivos: Dispositivo[];
}

export function DispositivosView({ dispositivos }: DispositivosViewProps) {
  const { showSuccess } = useAdminToast();
  const [showModal, setShowModal] = useState(false);
  const [metodos, setMetodos] = useState({ run: true, qr: true, bio: false });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TotemFormData>({ resolver: zodResolver(totemSchema) });

  function onCreate(data: TotemFormData) {
    void data;
    showSuccess('Tótem creado correctamente (simulado).');
    setShowModal(false);
    reset();
  }

  return (
    <div>
      <AdminPageHeader
        title="Dispositivos / Tótems"
        description={`${dispositivos.length} dispositivos registrados`}
        actions={
          <Button
            type="button"
            className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
            onClick={() => setShowModal(true)}
          >
            <Plus className="size-4" />
            Nuevo tótem
          </Button>
        }
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        {dispositivos.map((d) => {
          const isError = d.estado === 'error';
          const isActivo = d.estado === 'activo';
          return (
            <article
              key={d.id}
              className={
                isError
                  ? 'rounded-xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-zinc-950'
                  : 'rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950'
              }
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={
                      isError
                        ? 'flex size-11 items-center justify-center rounded-[10px] bg-red-50 dark:bg-red-950'
                        : isActivo
                          ? 'flex size-11 items-center justify-center rounded-[10px] bg-blue-50 dark:bg-blue-950'
                          : 'flex size-11 items-center justify-center rounded-[10px] bg-neutral-100 dark:bg-zinc-800'
                    }
                  >
                    <Monitor
                      className={
                        isError
                          ? 'size-5 text-red-600'
                          : isActivo
                            ? 'size-5 text-[#1E4C7C] dark:text-zinc-300'
                            : 'size-5 text-[#616161]'
                      }
                    />
                  </div>
                  <div>
                    <p className="font-bold text-[#1B1B1B] dark:text-zinc-50">{d.nombre}</p>
                    <p className="text-xs text-[#616161]">{d.ubicacion}</p>
                  </div>
                </div>
                <StatusBadge
                  variant={isError ? 'error' : isActivo ? 'activo' : 'inactivo'}
                  size="sm"
                  label={d.estado}
                />
              </div>

              {isError && (
                <div className="mb-3.5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  <AlertTriangle className="size-3.5 shrink-0" />
                  Dispositivo con error de conexión. Verificar estado físico.
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#616161]">Dirección IP</span>
                  <span className="font-mono dark:text-zinc-50">{d.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#616161]">Última conexión</span>
                  <span className="text-[#616161] dark:text-zinc-400">{d.ultimaConexion}</span>
                </div>
                <div>
                  <p className="mb-1.5 text-[#616161]">Métodos habilitados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(['run', 'qr', 'biometria'] as const).map((m) => (
                      <span
                        key={m}
                        className={
                          d.metodosHabilitados.includes(m)
                            ? 'rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'rounded-full border border-black/10 bg-neutral-100 px-2 py-0.5 text-xs text-[#616161] dark:border-zinc-700 dark:bg-zinc-800'
                        }
                      >
                        {m === 'run' ? 'RUN Manual' : m === 'qr' ? 'Carnet/QR' : 'Biométrico'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2 border-t border-black/5 pt-4 dark:border-zinc-800">
                <Button type="button" variant="outline" className="flex-1">
                  Editar
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
                  asChild
                >
                  <Link href="/totem/inicio" target="_blank" className="gap-1">
                    <Wifi className="size-3.5" />
                    Abrir tótem
                  </Link>
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg dark:border-zinc-800 dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="dark:text-zinc-50">Nuevo tótem</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onCreate)} className="space-y-3.5">
            <div className="space-y-2">
              <Label>Nombre del dispositivo</Label>
              <Input placeholder="Tótem Principal" {...register('nombre')} />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Ubicación física</Label>
              <Input placeholder="Entrada bicicletero - Zona A" {...register('ubicacion')} />
              {errors.ubicacion && (
                <p className="text-sm text-destructive">{errors.ubicacion.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Dirección IP</Label>
              <Input placeholder="192.168.10.103" {...register('ip')} />
              {errors.ip && <p className="text-sm text-destructive">{errors.ip.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Usuario (correo)</Label>
              <Input placeholder="totem3@sede.cl" {...register('usuario')} />
              {errors.usuario && (
                <p className="text-sm text-destructive">{errors.usuario.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Label className="mb-2 block">Métodos de identificación</Label>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    ['run', 'RUN Manual'],
                    ['qr', 'Carnet/QR'],
                    ['bio', 'Biométrico'],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={metodos[key]}
                      onChange={(e) => setMetodos((m) => ({ ...m, [key]: e.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
              >
                Crear tótem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
