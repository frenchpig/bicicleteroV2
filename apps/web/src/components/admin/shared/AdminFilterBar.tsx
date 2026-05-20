import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { Input, cn } from '@app/ui';

interface AdminFilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: ReactNode;
  meta?: ReactNode;
  className?: string;
}

export function AdminFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  children,
  meta,
  className,
}: AdminFilterBarProps) {
  return (
    <div
      className={cn(
        'mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950',
        className,
      )}
    >
      {onSearchChange !== undefined && (
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#616161] dark:text-zinc-500" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={search ?? ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-black/10 bg-[#F6F8FA] pl-9 focus-visible:border-[#1E4C7C] focus-visible:ring-[#5B8BBD] dark:border-zinc-800 dark:bg-zinc-900/30"
          />
        </div>
      )}
      {children}
      {meta && <span className="text-sm text-[#616161] dark:text-zinc-500">{meta}</span>}
    </div>
  );
}
