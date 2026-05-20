'use client';

import { useState } from 'react';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminToastProvider } from '@/components/admin/shared/AdminToast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  return (
    <AdminToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#F6F8FA] dark:bg-zinc-950">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader search={search} onSearchChange={setSearch} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
