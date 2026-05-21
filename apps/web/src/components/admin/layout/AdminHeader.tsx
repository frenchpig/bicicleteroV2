'use client';

import { useRouter } from 'next/navigation';
import { Bell, LogOut, Search } from 'lucide-react';
import { Input } from '@app/ui';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { clearAuth } from '@/lib/auth';
import type { User } from '@app/types';

interface AdminHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  user?: User | null;
}

export function AdminHeader({ search, onSearchChange, user }: AdminHeaderProps) {
  const router = useRouter();
  const initials = user
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`
    : 'A';

  async function handleLogout() {
    await clearAuth();
    router.push('/login');
  }

  return (
    <header className="flex h-[60px] shrink-0 items-center gap-4 border-b border-black/10 bg-white px-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="relative max-w-sm flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#616161] dark:text-zinc-500" />
        <Input
          type="text"
          placeholder="Buscar por RUN, nombre, bicicleta..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-black/10 bg-[#F6F8FA] pl-9 focus-visible:border-[#1E4C7C] focus-visible:ring-[#5B8BBD] dark:border-zinc-800 dark:bg-zinc-900/30"
        />
      </div>

      <div className="flex-1" />

      <ThemeToggle />

      <button
        type="button"
        onClick={() => router.push('/admin/ciclistas')}
        className="relative rounded-lg p-1.5 text-[#616161] transition-colors hover:bg-[#EBF1F7] dark:text-zinc-400 dark:hover:bg-zinc-800"
        aria-label="Alertas"
      >
        <Bell className="size-5" />
        <span className="absolute right-1 top-1 size-2.5 rounded-full border-2 border-white bg-[#C62828] dark:border-zinc-950" />
      </button>

      <div className="flex items-center gap-2.5">
        <div className="flex size-[34px] items-center justify-center rounded-full bg-[#1E4C7C] text-sm font-semibold text-white dark:bg-zinc-700">
          {initials}
        </div>
        <div className="hidden md:block">
          <p className="text-[0.8125rem] font-semibold leading-tight text-[#1B1B1B] dark:text-zinc-50">
            {user ? `${user.nombre} ${user.apellido}` : 'Administrador'}
          </p>
          <p className="text-[0.6875rem] text-[#616161] dark:text-zinc-400">
            {user?.role ?? 'Sede Central'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handleLogout()}
        title="Cerrar sesión"
        className="rounded-lg p-1.5 text-[#616161] transition-colors hover:bg-[#EBF1F7] dark:text-zinc-400 dark:hover:bg-zinc-800"
      >
        <LogOut className="size-[18px]" />
      </button>
    </header>
  );
}
