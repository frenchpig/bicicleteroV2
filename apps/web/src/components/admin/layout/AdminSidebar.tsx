'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bike,
  ChevronLeft,
  ChevronRight,
  Cog,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  Monitor,
  Shield,
  UserCog,
  Users,
} from 'lucide-react';
import { cn } from '@app/ui';
import { isSuperAdmin } from '@/lib/auth';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Ciclistas', icon: Users, path: '/admin/ciclistas' },
  { label: 'Visitas', icon: Eye, path: '/admin/visitas' },
  { label: 'Bicicletas', icon: Bike, path: '/admin/bicicletas' },
  { label: 'Cupos', icon: Home, path: '/admin/cupos' },
  { label: 'Dispositivos', icon: Monitor, path: '/admin/dispositivos' },
  { label: 'Reportería', icon: FileText, path: '/admin/reportes' },
  { label: 'Configuración', icon: Cog, path: '/admin/configuracion' },
];

const quickLinks = [
  { label: 'Vista Guardia', icon: Shield, path: '/operacion/guardia' },
  { label: 'Tótem', icon: Monitor, path: '/totem/inicio' },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function AdminSidebar({ collapsed, onToggleCollapse }: AdminSidebarProps) {
  const showUsuarios = isSuperAdmin();
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col border-r border-black/10 bg-white text-[#616161] transition-[width] duration-200',
        'dark:border-zinc-800 dark:bg-zinc-900 dark:text-slate-200',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2.5 border-b border-black/10 dark:border-zinc-800',
          collapsed ? 'px-3 py-4' : 'px-5 py-4',
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1E4C7C] dark:bg-cyan-600">
          <Bike className="size-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-tight text-[#1B1B1B] dark:text-white">
              Bicicletero
            </p>
            <p className="text-[0.7rem] text-[#616161] dark:text-slate-400">Sede Central</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-2">
          {!collapsed && (
            <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[#616161] dark:text-slate-500">
              Gestión
            </p>
          )}
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors',
                  collapsed && 'justify-center px-3',
                  active
                    ? 'bg-[#1E4C7C] text-white dark:bg-cyan-600'
                    : 'text-[#616161] hover:bg-[#EBF1F7] hover:text-[#1B1B1B] dark:text-slate-300 dark:hover:bg-zinc-800 dark:hover:text-white',
                )}
              >
                <item.icon className="size-[18px] shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
          {showUsuarios && (
            <Link
              href="/admin/usuarios"
              title={collapsed ? 'Usuarios' : undefined}
              className={cn(
                'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors',
                collapsed && 'justify-center px-3',
                isActive('/admin/usuarios')
                  ? 'bg-[#1E4C7C] text-white dark:bg-cyan-600'
                  : 'text-[#616161] hover:bg-[#EBF1F7] hover:text-[#1B1B1B] dark:text-slate-300 dark:hover:bg-zinc-800 dark:hover:text-white',
              )}
            >
              <UserCog className="size-[18px] shrink-0" />
              {!collapsed && 'Usuarios'}
            </Link>
          )}
        </div>

        <div className="mt-1 border-t border-black/10 pt-3 dark:border-zinc-800">
          {!collapsed && (
            <p className="px-2 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-[#616161] dark:text-slate-500">
              Operaciones
            </p>
          )}
          {quickLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.8125rem] transition-colors',
                  collapsed && 'justify-center',
                  active
                    ? 'bg-[#1E4C7C] text-white dark:bg-cyan-600'
                    : 'text-[#616161] hover:bg-[#EBF1F7] hover:text-[#1B1B1B] dark:text-slate-300 dark:hover:bg-zinc-800 dark:hover:text-white',
                )}
              >
                <item.icon className="size-[18px] shrink-0" />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-black/10 p-2 dark:border-zinc-800">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#616161] transition-colors',
            'hover:bg-[#EBF1F7] dark:text-slate-500 dark:hover:bg-zinc-800',
            collapsed ? 'justify-center' : 'justify-end',
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <>
              <span>Contraer</span>
              <ChevronLeft className="size-4" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
