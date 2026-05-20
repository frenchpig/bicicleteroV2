import type { LucideIcon } from 'lucide-react';
import { cn } from '@app/ui';

interface AdminKpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function AdminKpiCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
  onClick,
}: AdminKpiCardProps) {
  return (
    <article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={cn(
        'flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-6 shadow-sm',
        'transition-[transform,box-shadow] duration-150 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none',
        onClick && 'cursor-pointer hover:-translate-y-px hover:shadow-md dark:hover:bg-zinc-900',
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-[#616161] dark:text-zinc-400">{label}</span>
        <div
          className="rounded-[10px] p-2"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon className="size-5" style={{ color }} />
        </div>
      </div>
      <p className="text-3xl font-bold leading-none text-[#1B1B1B] dark:text-zinc-50">{value}</p>
      {sub && <p className="text-xs text-[#616161] dark:text-zinc-500">{sub}</p>}
    </article>
  );
}
