'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  Bike,
  CheckCircle,
  Shield,
  Zap,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, cn } from '@app/ui';
import { AdminKpiCard } from '@/components/admin/shared/AdminKpiCard';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import type { Cupo } from '@/types/admin/cupos';
import type {
  AlertaResumen,
  DistribucionEstado,
  IngresoActivo,
  OcupacionDia,
  OcupacionHorario,
} from '@/types/admin/dashboard';

interface DashboardViewProps {
  cupos: Cupo[];
  alertas: AlertaResumen[];
  ingresosActivos: IngresoActivo[];
  ocupacionPorDia: OcupacionDia[];
  ocupacionPorHorario: OcupacionHorario[];
  distribucionEstados: DistribucionEstado[];
}

function maskRun(run: string) {
  return run.replace(/\d(?=\d{4})/g, '•');
}

export function DashboardView({
  cupos,
  alertas,
  ingresosActivos,
  ocupacionPorDia,
  ocupacionPorHorario,
  distribucionEstados,
}: DashboardViewProps) {
  const libres = cupos.filter((c) => c.estado === 'libre').length;
  const ocupados = cupos.filter((c) => c.estado === 'ocupado' || c.estado === 'alerta').length;
  const total = cupos.length;
  const pct = Math.round((ocupados / total) * 100);
  const alertasActivas = alertas.filter((a) => a.estado === 'activa').length;
  const incumplidos = ingresosActivos.filter((i) => i.estadoCumplimiento === 'incumplido').length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1B1B1B] dark:text-zinc-50">Dashboard</h1>
        <p className="mt-1 text-sm text-[#616161] dark:text-zinc-400">
          Sede Central · Miércoles 20 de mayo, 2026 · 12:00 hrs
        </p>
      </div>

      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
        <AdminKpiCard label="Total de cupos" value={total} sub="Capacidad del bicicletero" color="#1E4C7C" icon={Shield} />
        <AdminKpiCard
          label="Cupos libres"
          value={libres}
          sub={`${Math.round((libres / total) * 100)}% disponibles`}
          color="#16a34a"
          icon={CheckCircle}
          onClick={() => window.location.assign('/admin/cupos')}
        />
        <AdminKpiCard
          label="Cupos ocupados"
          value={ocupados}
          sub={`${pct}% de ocupación`}
          color="#0288D1"
          icon={Bike}
          onClick={() => window.location.assign('/admin/cupos')}
        />
        <AdminKpiCard
          label="Bicicletas dentro"
          value={ingresosActivos.length}
          sub="Ingresos activos ahora"
          color="#1E4C7C"
          icon={Bike}
        />
        <AdminKpiCard
          label="Alertas activas"
          value={alertasActivas}
          sub="Requieren atención"
          color="#d97706"
          icon={AlertTriangle}
          onClick={() => window.location.assign('/admin/ciclistas')}
        />
        <AdminKpiCard
          label="Incumplidos hoy"
          value={incumplidos}
          sub="No retiraron a tiempo"
          color="#dc2626"
          icon={Zap}
          onClick={() => window.location.assign('/admin/ciclistas')}
        />
      </div>

      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">Ocupación semanal</h2>
          <p className="mb-4 text-xs text-[#616161] dark:text-zinc-500">
            Bicicletas dentro por día (últimos 6 días)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={ocupacionPorDia} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradOcup" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E4C7C" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E4C7C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100 dark:stroke-zinc-800" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="ocupacion"
                stroke="#1E4C7C"
                strokeWidth={2}
                fill="url(#gradOcup)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="capacidad"
                stroke="#e2e8f0"
                strokeWidth={1}
                strokeDasharray="4 2"
                fill="none"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">Estado de ciclistas</h2>
          <p className="mb-4 text-xs text-[#616161] dark:text-zinc-500">Distribución actual de estados</p>
          <div className="flex items-center gap-6">
            <PieChart width={160} height={160}>
              <Pie
                data={distribucionEstados}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {distribucionEstados.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
            <div className="flex-1 space-y-2">
              {distribucionEstados.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: d.color }} />
                  <span className="flex-1 text-sm text-[#616161] dark:text-zinc-400">{d.name}</span>
                  <span className="text-sm font-semibold text-[#1B1B1B] dark:text-zinc-50">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">Ingresos por horario</h2>
          <p className="mb-4 text-xs text-[#616161] dark:text-zinc-500">Acumulado de hoy</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ocupacionPorHorario} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-100 dark:stroke-zinc-800" />
              <XAxis dataKey="horario" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="ingresos" fill="#0288D1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">Alertas recientes</h2>
            <Link
              href="/admin/ciclistas"
              className="text-xs text-[#1E4C7C] underline dark:text-cyan-400"
            >
              Ver todo
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {alertas.map((a) => (
              <div
                key={a.id}
                className={cn(
                  'rounded-[10px] border p-3',
                  a.estado === 'activa'
                    ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
                    : 'border-black/10 bg-[#F6F8FA] dark:border-zinc-800 dark:bg-zinc-900',
                )}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold text-[#1B1B1B] dark:text-zinc-50">
                    {a.ciclistaNombre}
                  </span>
                  <StatusBadge
                    variant={
                      a.estado === 'activa'
                        ? 'alerta'
                        : a.estado === 'derivada-bloqueo'
                          ? 'derivada-bloqueo'
                          : 'notificada'
                    }
                    size="sm"
                  />
                </div>
                <p className="text-xs text-[#616161] dark:text-zinc-400">{a.motivo}</p>
                <p className="mt-1 text-[0.7rem] text-[#616161] dark:text-zinc-500">{a.fecha}</p>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="mt-5 rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#1B1B1B] dark:text-zinc-50">
              Bicicletas dentro ahora
            </h2>
            <p className="text-xs text-[#616161] dark:text-zinc-500">
              {ingresosActivos.length} ingresos activos
            </p>
          </div>
          <Button
            className="bg-[#1E4C7C] hover:bg-[#15365A] dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            asChild
          >
            <Link href="/operacion/guardia" className="gap-1.5">
              <Shield className="size-3.5" />
              Vista Guardia
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-[#F6F8FA] dark:border-zinc-800 dark:bg-zinc-900">
              <tr>
                {['Ciclista', 'RUN', 'Bicicleta', 'Cupo', 'Ingreso', 'Tiempo', 'Estado'].map((h) => (
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
              {ingresosActivos.map((i) => (
                <tr
                  key={i.id}
                  className="border-b border-black/5 transition-colors hover:bg-[#EBF1F7] dark:border-zinc-800/50 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 font-medium text-[#1B1B1B] dark:text-zinc-50">
                    {i.ciclista}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#616161] dark:text-zinc-400">
                    {maskRun(i.run)}
                  </td>
                  <td className="px-4 py-3 text-[#616161] dark:text-zinc-300">{i.bicicleta}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-[#1E4C7C] dark:text-cyan-400">#{i.cupo}</span>
                    <span className="ml-1 text-[0.7rem] text-[#616161]">Zona {i.zona}</span>
                  </td>
                  <td className="px-4 py-3 text-[#616161] dark:text-zinc-400">{i.horaIngreso}</td>
                  <td className="px-4 py-3 text-[#616161] dark:text-zinc-400">
                    {Math.floor(i.minutosTranscurridos / 60)}h {i.minutosTranscurridos % 60}m
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        i.estadoCumplimiento === 'normal'
                          ? 'habilitado'
                          : i.estadoCumplimiento === 'proximo'
                            ? 'alerta'
                            : 'incumplido'
                      }
                      size="sm"
                      label={
                        i.estadoCumplimiento === 'normal'
                          ? 'Normal'
                          : i.estadoCumplimiento === 'proximo'
                            ? 'Próximo'
                            : 'Incumplido'
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
}
