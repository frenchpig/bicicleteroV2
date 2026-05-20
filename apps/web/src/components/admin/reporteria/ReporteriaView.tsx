'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, cn } from '@app/ui';
import { AdminPageHeader } from '@/components/admin/shared/AdminPageHeader';
import { useAdminToast } from '@/components/admin/shared/AdminToast';
import type {
  ActividadCiclista,
  AlertaReporte,
  JornadaResumen,
  ReporteKpi,
  ReporteTab,
} from '@/types/admin/reporteria';
import type { DistribucionEstado, OcupacionDia, OcupacionHorario } from '@/types/admin/dashboard';

const REPORTES: { key: ReporteTab; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'ocupacion', label: 'Ocupación' },
  { key: 'horarios', label: 'Horarios / jornada' },
  { key: 'usuarios', label: 'Usuarios' },
  { key: 'alertas', label: 'Alertas y bloqueos' },
];

interface ReporteriaViewProps {
  kpis: ReporteKpi[];
  ocupacionPorDia: OcupacionDia[];
  ocupacionPorHorario: OcupacionHorario[];
  distribucionEstados: DistribucionEstado[];
  jornadas: JornadaResumen[];
  actividadCiclistas: ActividadCiclista[];
  alertasReporte: AlertaReporte[];
}

function estadoAlertaClasses(estado: string) {
  if (estado === 'Activa') return 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300';
  if (estado === 'Resuelta') return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
  return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
}

export function ReporteriaView({
  kpis,
  ocupacionPorDia,
  ocupacionPorHorario,
  distribucionEstados,
  jornadas,
  actividadCiclistas,
  alertasReporte,
}: ReporteriaViewProps) {
  const { showSuccess } = useAdminToast();
  const [reporte, setReporte] = useState<ReporteTab>('general');
  const [periodo, setPeriodo] = useState('semana');

  return (
    <div>
      <AdminPageHeader
        title="Reportería"
        description="Sede Central · Informes de uso del bicicletero"
        actions={
          <div className="flex gap-2">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="semana">Esta semana</option>
              <option value="mes">Este mes</option>
              <option value="trimestre">Trimestre</option>
            </select>
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              onClick={() => showSuccess('Exportación iniciada (simulado).')}
            >
              <Download className="size-4" />
              Exportar
            </Button>
          </div>
        }
      />

      <div className="mb-6 inline-flex rounded-[10px] bg-[#EBF1F7] p-1 dark:bg-zinc-800">
        {REPORTES.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setReporte(r.key)}
            className={cn(
              'rounded-lg px-4 py-1.5 text-sm transition-colors',
              reporte === r.key
                ? 'bg-white font-semibold text-[#1E4C7C] shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
                : 'text-[#616161] dark:text-zinc-400',
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {reporte === 'general' && (
        <>
          <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            {kpis.map((k) => (
              <article
                key={k.label}
                className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-xs text-[#616161]">{k.label}</p>
                <p className="mt-1.5 text-3xl font-bold text-[#1B1B1B] dark:text-zinc-50">{k.value}</p>
              </article>
            ))}
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-xl border border-black/10 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-4 text-base font-semibold dark:text-zinc-50">Ingresos vs. retiros diarios</h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={ocupacionPorDia}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100 dark:stroke-zinc-800" />
                  <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="ocupacion" name="Ingresos" stroke="#1E4C7C" fill="#1E4C7C33" />
                  <Area type="monotone" dataKey="capacidad" name="Capacidad" stroke="#0288D1" fill="none" strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </article>
            <article className="rounded-xl border border-black/10 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="mb-4 text-base font-semibold dark:text-zinc-50">Distribución de estados</h2>
              <div className="flex items-center gap-5">
                <PieChart width={160} height={160}>
                  <Pie data={distribucionEstados} innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {distribucionEstados.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <div className="space-y-2">
                  {distribucionEstados.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span className="size-2.5 rounded-full" style={{ background: d.color }} />
                      <span className="flex-1 text-[#616161] dark:text-zinc-400">{d.name}</span>
                      <span className="font-semibold dark:text-zinc-50">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </>
      )}

      {reporte === 'ocupacion' && (
        <article className="rounded-xl border border-black/10 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="mb-4 text-base font-semibold dark:text-zinc-50">Tasa de ocupación semanal</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ocupacionPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis domain={[0, 30]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="ocupacion" name="Ocupados" fill="#1E4C7C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="capacidad" name="Capacidad" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      )}

      {reporte === 'horarios' && (
        <>
          <article className="mb-5 rounded-xl border border-black/10 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-4 text-base font-semibold dark:text-zinc-50">Ingresos por horario (hoy)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ocupacionPorHorario}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="horario" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ingresos" fill="#0288D1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <p className="border-b border-black/5 px-5 py-4 font-semibold dark:text-zinc-50">
              Resumen por jornada
            </p>
            <table className="w-full text-sm">
              <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
                <tr>
                  {['Jornada', 'Ingresos', 'Retiros', '% Ocupación'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-[#616161]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jornadas.map((j) => (
                  <tr key={j.jornada} className="border-b border-black/5 dark:border-zinc-800">
                    <td className="px-5 py-3 font-medium dark:text-zinc-50">{j.jornada}</td>
                    <td className="px-5 py-3 font-semibold text-green-600">{j.ingresos}</td>
                    <td className="px-5 py-3 font-semibold text-[#0288D1]">{j.retiros}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-zinc-800">
                          <div className="h-full rounded-full bg-[#1E4C7C]" style={{ width: `${j.pct}%` }} />
                        </div>
                        <span className="min-w-9 text-right font-semibold dark:text-zinc-50">{j.pct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {reporte === 'usuarios' && (
        <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <p className="border-b px-5 py-4 font-semibold dark:text-zinc-50">
            Actividad de ciclistas — {periodo === 'semana' ? 'esta semana' : 'este mes'}
          </p>
          <table className="w-full text-sm">
            <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
              <tr>
                {['Ciclista', 'Tipo', 'Ingresos', 'Retiros', 'Alertas', 'Último ingreso'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#616161]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {actividadCiclistas.map((u) => (
                <tr key={u.nombre} className="border-b border-black/5 dark:border-zinc-800">
                  <td className="px-4 py-3 font-semibold dark:text-zinc-50">{u.nombre}</td>
                  <td className="px-4 py-3 text-[#616161]">{u.tipo}</td>
                  <td className="px-4 py-3 font-semibold text-green-600">{u.ingresos}</td>
                  <td className="px-4 py-3 font-semibold text-[#0288D1]">{u.retiros}</td>
                  <td
                    className={cn(
                      'px-4 py-3',
                      u.alertas > 0 ? 'font-bold text-amber-600' : 'text-[#616161]',
                    )}
                  >
                    {u.alertas || '—'}
                  </td>
                  <td className="px-4 py-3 text-[#616161]">{u.ultimo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reporte === 'alertas' && (
        <>
          <div className="mb-5 grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
            {[
              { label: 'Total alertas (mes)', value: '8', color: '#d97706' },
              { label: 'Resueltas', value: '5', color: '#16a34a' },
              { label: 'Activas', value: '2', color: '#dc2626' },
              { label: 'Bloqueados', value: '1', color: '#7c3aed' },
            ].map((k) => (
              <article
                key={k.label}
                className="rounded-xl border border-black/10 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-xs text-[#616161]">{k.label}</p>
                <p className="text-3xl font-bold" style={{ color: k.color }}>
                  {k.value}
                </p>
              </article>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <p className="border-b px-5 py-4 font-semibold dark:text-zinc-50">Historial de alertas</p>
            <table className="w-full text-sm">
              <thead className="bg-[#F6F8FA] dark:bg-zinc-900">
                <tr>
                  {['Usuario', 'Tipo', 'Fecha', 'Estado', 'Correo enviado'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#616161]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertasReporte.map((a) => (
                  <tr key={`${a.usuario}-${a.fecha}`} className="border-b border-black/5 dark:border-zinc-800">
                    <td className="px-4 py-3 font-semibold dark:text-zinc-50">{a.usuario}</td>
                    <td className="px-4 py-3 text-[#616161]">{a.tipo}</td>
                    <td className="px-4 py-3 text-[#616161]">{a.fecha}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          estadoAlertaClasses(a.estado),
                        )}
                      >
                        {a.estado}
                      </span>
                    </td>
                    <td className={cn('px-4 py-3', a.correo ? 'text-green-600' : 'text-[#616161]')}>
                      {a.correo ? 'Sí' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
