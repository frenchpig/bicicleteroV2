'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@app/ui';
import { useTheme } from '@/components/providers/ThemeProvider';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={cn('inline-block size-8 rounded-lg', className)}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg p-1.5 text-[#616161] transition-colors',
        'hover:bg-[#EBF1F7] dark:text-zinc-400 dark:hover:bg-zinc-800',
        className,
      )}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      {showLabel && (
        <span className="text-sm">{isDark ? 'Tema claro' : 'Tema oscuro'}</span>
      )}
    </button>
  );
}
