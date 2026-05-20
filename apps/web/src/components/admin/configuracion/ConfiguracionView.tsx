'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { Button, Input, Label, cn } from '@app/ui';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import type {
  ConfiguracionAlertas,
  ConfiguracionBloqueos,
  ConfiguracionCorreos,
  ConfiguracionGeneral,
  ConfiguracionIdentificacion,
  ConfiguracionVisitas,
  SeccionConfig,
} from '@/types/admin/configuracion';

const SECCIONES: { key: SeccionConfig; label: string }[] = [
  { key: 'general', label: 'Datos generales' },
  { key: 'identificacion', label: 'Métodos de identificación' },
  { key: 'visitas', label: 'Registro de visitas' },
  { key: 'correos', label: 'Correos automáticos' },
  { key: 'terminos', label: 'Términos y condiciones' },
  { key: 'alertas', label: 'Reglas de alerta' },
  { key: 'bloqueos', label: 'Reglas de bloqueo' },
];

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full border-none transition-colors duration-150',
        checked ? 'bg-[#1E4C7C] dark:bg-zinc-50' : 'bg-neutral-300 dark:bg-zinc-700',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[left] duration-150',
          checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  );
}

function FieldRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-black/5 py-4 dark:border-zinc-800">
      <div className="flex-1">
        <p className="text-sm font-medium text-[#1B1B1B] dark:text-zinc-50">{label}</p>
        {desc && <p className="mt-0.5 text-xs text-[#616161] dark:text-zinc-500">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

interface ConfiguracionViewProps {
  general: ConfiguracionGeneral;
  identificacion: ConfiguracionIdentificacion;
  visitas: ConfiguracionVisitas;
  correos: ConfiguracionCorreos;
  alertas: ConfiguracionAlertas;
  bloqueos: ConfiguracionBloqueos;
  terminos: string;
  vistaPreviaCorreos: { asunto: string; body: string }[];
}

export function ConfiguracionView({
  general: initialGeneral,
  identificacion: initialId,
  visitas: initialVisitas,
  correos: initialCorreos,
  alertas: initialAlertas,
  bloqueos: initialBloqueos,
  terminos: initialTerminos,
  vistaPreviaCorreos,
}: ConfiguracionViewProps) {
  const { showSuccess } = useAdminToast();
  const [seccion, setSeccion] = useState<SeccionConfig>('general');
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState(initialGeneral);
  const [enableRun, setEnableRun] = useState(initialId.enableRun);
  const [enableQr, setEnableQr] = useState(initialId.enableQr);
  const [enableBio, setEnableBio] = useState(initialId.enableBio);
  const [allowVisitas, setAllowVisitas] = useState(initialVisitas.allowVisitas);
  const [requireFotoVisita, setRequireFotoVisita] = useState(initialVisitas.requireFotoVisita);
  const [sendMailIngreso, setSendMailIngreso] = useState(initialCorreos.sendMailIngreso);
  const [sendMailRetiro, setSendMailRetiro] = useState(initialCorreos.sendMailRetiro);
  const [sendMailTerminos, setSendMailTerminos] = useState(initialCorreos.sendMailTerminos);
  const [sendMailAlerta, setSendMailAlerta] = useState(initialCorreos.sendMailAlerta);
  const [maxAlertas, setMaxAlertas] = useState(initialAlertas.maxAlertas);
  const [horaLimite, setHoraLimite] = useState(initialAlertas.horaLimite);
  const [autoBloqueo, setAutoBloqueo] = useState(initialBloqueos.autoBloqueo);
  const [terminos, setTerminos] = useState(initialTerminos);

  function handleSave() {
    setSaved(true);
    showSuccess('Configuración guardada correctamente (simulado).');
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <AdminPageHeader
        title="Configuración"
        description="Configura las reglas operativas de esta sede"
        actions={
          <Button
            type="button"
            onClick={handleSave}
            className={cn(
              'gap-1.5 text-white',
              saved
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900',
            )}
          >
            {saved ? <Check className="size-4" /> : <Save className="size-4" />}
            {saved ? 'Guardado' : 'Guardar cambios'}
          </Button>
        }
      />

      <div className="flex gap-5">
        <nav className="w-56 shrink-0">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            {SECCIONES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSeccion(s.key)}
                className={cn(
                  'block w-full border-l-[3px] px-4 py-2.5 text-left text-sm transition-colors',
                  seccion === s.key
                    ? 'border-l-[#1E4C7C] bg-[#EBF1F7] font-semibold text-[#1E4C7C] dark:border-l-zinc-50 dark:bg-zinc-900 dark:text-zinc-50'
                    : 'border-l-transparent text-[#616161] hover:bg-[#EBF1F7] dark:text-zinc-400 dark:hover:bg-zinc-900',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          {seccion === 'general' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Datos generales
              </h2>
              {(
                [
                  ['nombreSede', 'Nombre de la sede'],
                  ['direccion', 'Dirección'],
                  ['correoContacto', 'Correo de contacto'],
                  ['telefonoContacto', 'Teléfono de contacto'],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label>{label}</Label>
                  <Input
                    value={general[key]}
                    onChange={(e) => setGeneral((g) => ({ ...g, [key]: e.target.value }))}
                    className="bg-[#F6F8FA] dark:bg-zinc-900/30"
                  />
                </div>
              ))}
            </div>
          )}

          {seccion === 'identificacion' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Métodos de identificación
              </h2>
              <p className="mb-4 text-sm text-[#616161]">
                Configura qué métodos puede usar el ciclista en el tótem.
              </p>
              <FieldRow label="Ingreso por RUN manual" desc="El ciclista escribe su RUN en el tótem">
                <ToggleSwitch checked={enableRun} onChange={setEnableRun} />
              </FieldRow>
              <FieldRow label="Lectura de carnet / QR" desc="Escaneo de carnet o código QR">
                <ToggleSwitch checked={enableQr} onChange={setEnableQr} />
              </FieldRow>
              <FieldRow
                label="Verificación facial / biométrica"
                desc="Requiere cámara compatible en el tótem"
              >
                <ToggleSwitch checked={enableBio} onChange={setEnableBio} />
              </FieldRow>
              {!enableRun && !enableQr && !enableBio && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                  Debes habilitar al menos un método de identificación.
                </p>
              )}
            </div>
          )}

          {seccion === 'visitas' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Registro de visitas
              </h2>
              <FieldRow
                label="Permitir registro de visitas"
                desc="Usuarios no registrados pueden crear perfil de visita desde el tótem"
              >
                <ToggleSwitch checked={allowVisitas} onChange={setAllowVisitas} />
              </FieldRow>
              <FieldRow label="Requerir fotografía de visita" desc="La foto es obligatoria al registrar">
                <ToggleSwitch checked={requireFotoVisita} onChange={setRequireFotoVisita} />
              </FieldRow>
            </div>
          )}

          {seccion === 'correos' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Correos automáticos
              </h2>
              <FieldRow label="Correo al aceptar términos" desc="Envía copia del reglamento">
                <ToggleSwitch checked={sendMailTerminos} onChange={setSendMailTerminos} />
              </FieldRow>
              <FieldRow label="Correo al registrar ingreso" desc="Confirma ingreso y cupo">
                <ToggleSwitch checked={sendMailIngreso} onChange={setSendMailIngreso} />
              </FieldRow>
              <FieldRow label="Correo al registrar retiro" desc="Confirma retiro de bicicleta">
                <ToggleSwitch checked={sendMailRetiro} onChange={setSendMailRetiro} />
              </FieldRow>
              <FieldRow label="Correo por alerta de no retiro" desc="Notifica incumplimiento">
                <ToggleSwitch checked={sendMailAlerta} onChange={setSendMailAlerta} />
              </FieldRow>
              <h3 className="mb-3 mt-6 text-sm font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Vista previa de correos
              </h3>
              {vistaPreviaCorreos.map((m) => (
                <div
                  key={m.asunto}
                  className="mb-3 rounded-[10px] border border-black/10 bg-[#EBF1F7] p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <p className="text-sm font-semibold text-[#1B1B1B] dark:text-zinc-50">
                    Asunto: {m.asunto}
                  </p>
                  <p className="text-sm text-[#616161] dark:text-zinc-400">{m.body}</p>
                </div>
              ))}
            </div>
          )}

          {seccion === 'terminos' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Términos y condiciones
              </h2>
              <textarea
                value={terminos}
                onChange={(e) => setTerminos(e.target.value)}
                rows={12}
                className="mt-3 w-full resize-y rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm leading-relaxed dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
              />
              <p className="mt-2 text-xs text-[#616161]">
                Última actualización: 2026-05-01 · Los ciclistas deben aceptar los términos vigentes.
              </p>
            </div>
          )}

          {seccion === 'alertas' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Reglas de alerta
              </h2>
              <FieldRow label="Hora límite de retiro" desc="Genera alerta si no retira antes de esta hora">
                <Input
                  type="time"
                  value={horaLimite}
                  onChange={(e) => setHoraLimite(e.target.value)}
                  className="w-auto bg-[#F6F8FA] dark:bg-zinc-900/30"
                />
              </FieldRow>
              <FieldRow label="Máximo de alertas antes de bloqueo" desc="Al superar este número">
                <select
                  value={maxAlertas}
                  onChange={(e) => setMaxAlertas(e.target.value)}
                  className="rounded-md border border-black/10 bg-[#F6F8FA] px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50"
                >
                  {['2', '3', '4', '5'].map((n) => (
                    <option key={n} value={n}>
                      {n} alertas
                    </option>
                  ))}
                </select>
              </FieldRow>
              <p className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
                Con la configuración actual, un ciclista con {maxAlertas} alertas activas{' '}
                {autoBloqueo
                  ? 'será bloqueado automáticamente'
                  : 'quedará en revisión administrativa'}
                .
              </p>
            </div>
          )}

          {seccion === 'bloqueos' && (
            <div>
              <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
                Reglas de bloqueo
              </h2>
              <FieldRow
                label="Bloqueo automático"
                desc="Bloquea al usuario al superar el límite de alertas"
              >
                <ToggleSwitch checked={autoBloqueo} onChange={setAutoBloqueo} />
              </FieldRow>
              {!autoBloqueo ? (
                <p className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                  Modo revisión manual activo. El administrador revisará cada caso antes de bloquear.
                </p>
              ) : (
                <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                  Con esta configuración, los usuarios serán bloqueados automáticamente al alcanzar el
                  límite sin revisión manual.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
