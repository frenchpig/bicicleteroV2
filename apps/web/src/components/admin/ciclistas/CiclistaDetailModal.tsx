'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Ban,
  Bike,
  CheckCircle,
  X,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogContent,
  Label,
  cn,
} from '@app/ui';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import type { Bicicleta } from '@/types/admin/bicicletas';
import type { Ciclista, CiclistaAlerta, CiclistaHistorialItem } from '@/types/admin/ciclistas';
import type { EstadoCiclista } from '@/types/admin/shared';

type Tab = 'perfil' | 'bicicletas' | 'historial' | 'alertas';

interface CiclistaDetailModalProps {
  ciclista: Ciclista;
  bicicletas: Bicicleta[];
  historial: CiclistaHistorialItem[];
  alertas: CiclistaAlerta[];
  open: boolean;
  onClose: () => void;
}

export function CiclistaDetailModal({
  ciclista,
  bicicletas,
  historial,
  alertas,
  open,
  onClose,
}: CiclistaDetailModalProps) {
  const [tab, setTab] = useState<Tab>('perfil');
  const [showBloqueo, setShowBloqueo] = useState(false);
  const [motivoBloqueo, setMotivoBloqueo] = useState('');
  const [estado, setEstado] = useState<EstadoCiclista>(ciclista.estado);

  const bikes = bicicletas.filter((b) => ciclista.bicicletaIds.includes(b.id));
  const cicAlerts = alertas.filter((a) => a.ciclistaId === ciclista.id);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'perfil', label: 'Perfil' },
    { key: 'bicicletas', label: `Bicicletas (${bikes.length})` },
    { key: 'historial', label: 'Historial' },
    { key: 'alertas', label: `Alertas (${cicAlerts.length})` },
  ];

  function handleBloquear() {
    if (!motivoBloqueo.trim()) return;
    setEstado('bloqueado');
    setShowBloqueo(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="relative flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#1E4C7C] text-lg font-bold text-white dark:bg-zinc-700">
              {ciclista.nombre[0]}
              {ciclista.apellido[0]}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                {ciclista.nombre} {ciclista.apellido}
              </h2>
              <div className="mt-1 flex gap-2">
                <StatusBadge variant={estado} size="sm" />
                <StatusBadge variant={ciclista.tipo} size="sm" />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#616161] hover:text-[#616161] dark:hover:text-zinc-300"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex border-b border-black/10 px-6 dark:border-zinc-800">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                'border-b-2 px-4 py-3 text-sm transition-colors',
                tab === t.key
                  ? 'border-[#1E4C7C] font-semibold text-[#1E4C7C] dark:border-zinc-50 dark:text-zinc-50'
                  : 'border-transparent text-[#616161] dark:text-zinc-400',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'perfil' && (
            <div>
              {estado === 'bloqueado' && (
                <div className="mb-4 rounded-[10px] border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  <p className="font-semibold">Usuario bloqueado</p>
                  <p>{ciclista.motivoBloqueo || motivoBloqueo || 'Sin detalle de motivo.'}</p>
                </div>
              )}
              {ciclista.alertas > 0 && estado !== 'bloqueado' && (
                <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  Este usuario tiene {ciclista.alertas} alerta
                  {ciclista.alertas > 1 ? 's' : ''} activa
                  {ciclista.alertas > 1 ? 's' : ''}.
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'RUN', value: ciclista.run, mono: true },
                  { label: 'Correo', value: ciclista.correo },
                  { label: 'Teléfono', value: ciclista.telefono },
                  {
                    label: 'Tipo',
                    value: ciclista.tipo === 'funcionario' ? 'Funcionario' : 'Estudiante',
                  },
                  { label: 'Fecha registro', value: ciclista.fechaRegistro },
                  { label: 'Último ingreso', value: ciclista.ultimoIngreso ?? '—' },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-[#616161] dark:text-zinc-500">{f.label}</p>
                    <p
                      className={cn(
                        'text-sm text-[#1B1B1B] dark:text-zinc-50',
                        f.mono && 'font-mono',
                      )}
                    >
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'bicicletas' && (
            <div className="space-y-2.5">
              {bikes.length === 0 && (
                <p className="py-8 text-center text-[#616161]">Sin bicicletas registradas.</p>
              )}
              {bikes.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center gap-3 rounded-[10px] border border-black/10 p-4 dark:border-zinc-800"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-[#F6F8FA] dark:bg-zinc-900">
                    <Bike className="size-5 text-[#1E4C7C] dark:text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1B1B1B] dark:text-zinc-50">
                      {b.marca} — {b.color}
                    </p>
                    <p className="text-xs text-[#616161] dark:text-zinc-400">
                      {b.tipo} {b.numeroSerie ? `· N° ${b.numeroSerie}` : ''}
                    </p>
                  </div>
                  <StatusBadge
                    variant={b.estado === 'activa' ? 'habilitado' : 'inactivo'}
                    size="sm"
                    label={b.estado === 'activa' ? 'Activa' : 'Inactiva'}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'historial' && (
            <div className="space-y-2">
              {historial.map((h, i) => (
                <div
                  key={`${h.fecha}-${i}`}
                  className="flex items-center gap-3 border-b border-black/5 py-2.5 dark:border-zinc-800"
                >
                  <span
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      h.tipo === 'ingreso' ? 'bg-[#2E7D32]' : 'bg-[#0288D1]',
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1B1B1B] dark:text-zinc-50">
                      {h.tipo === 'ingreso' ? 'Ingreso' : 'Retiro'} — {h.bici}
                    </p>
                    <p className="text-xs text-[#616161]">
                      Cupo #{h.cupo} · {h.fecha}
                    </p>
                  </div>
                  <StatusBadge
                    variant={h.tipo === 'ingreso' ? 'ocupado' : 'libre'}
                    size="sm"
                    label={h.tipo === 'ingreso' ? 'Ingreso' : 'Retiro'}
                  />
                </div>
              ))}
            </div>
          )}

          {tab === 'alertas' && (
            <div className="space-y-2.5">
              {cicAlerts.length === 0 && (
                <p className="py-8 text-center text-[#616161]">Sin alertas registradas.</p>
              )}
              {cicAlerts.map((a) => (
                <div
                  key={a.id}
                  className="rounded-[10px] border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950"
                >
                  <div className="mb-1.5 flex justify-between">
                    <span className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                      {a.tipo === 'no-retiro'
                        ? 'No retiro'
                        : a.tipo === 'retiro-tardio'
                          ? 'Retiro tardío'
                          : 'Incumplimiento'}
                    </span>
                    <StatusBadge variant={a.estado} size="sm" />
                  </div>
                  <p className="text-xs text-[#616161] dark:text-zinc-400">{a.motivo}</p>
                  <p className="mt-1 text-[0.7rem] text-[#616161]">
                    {a.fecha} · Correo {a.correoEnviado ? 'enviado' : 'pendiente'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-black/10 px-6 py-4 dark:border-zinc-800">
          <span className="text-xs text-[#616161]">ID interno: #{ciclista.id}</span>
          <div className="flex gap-2">
            {estado === 'bloqueado' ? (
              <Button
                type="button"
                variant="outline"
                className="border-green-600 text-green-700 dark:border-green-700 dark:text-green-400"
                onClick={() => setEstado('habilitado')}
              >
                <CheckCircle className="size-3.5" />
                Habilitar usuario
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="border-red-300 text-red-700 dark:border-red-800 dark:text-red-400"
                onClick={() => setShowBloqueo(true)}
              >
                <Ban className="size-3.5" />
                Bloquear usuario
              </Button>
            )}
            <Button
              type="button"
              className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900"
            >
              Editar
            </Button>
          </div>
        </div>

        {showBloqueo && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/30 p-6">
            <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <h3 className="font-semibold text-[#1B1B1B] dark:text-zinc-50">Bloquear usuario</h3>
              <p className="mt-2 text-sm text-[#616161] dark:text-zinc-400">
                Ingresa el motivo del bloqueo. Este quedará registrado en el historial del usuario.
              </p>
              <div className="my-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                El motivo de bloqueo quedará registrado en el historial.
              </div>
              <Label htmlFor="motivo-bloqueo" className="sr-only">
                Motivo
              </Label>
              <textarea
                id="motivo-bloqueo"
                value={motivoBloqueo}
                onChange={(e) => setMotivoBloqueo(e.target.value)}
                placeholder="Describe el motivo del bloqueo..."
                className="min-h-20 w-full rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
              />
              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowBloqueo(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  disabled={!motivoBloqueo.trim()}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-900/60"
                  onClick={handleBloquear}
                >
                  Confirmar bloqueo
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
