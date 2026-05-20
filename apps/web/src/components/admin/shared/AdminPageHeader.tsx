import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1B1B1B] dark:text-zinc-50">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#616161] dark:text-zinc-400">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
