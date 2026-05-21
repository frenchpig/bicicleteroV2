'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminToastProvider } from '@/components/admin/shared/AdminToast';
import { invalidateSession, refreshSession } from '@/lib/auth';
import { canAccessPath, isStaffRole } from '@/lib/route-access';
import type { User } from '@app/types';
import { sessionMessages } from '@/lib/session-messages';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  async function verifySession() {
    setApiUnavailable(false);
    setReady(false);

    const result = await refreshSession();

    if (result.status === 'unavailable') {
      setApiUnavailable(true);
      return;
    }

    if (result.status === 'unauthorized' || !isStaffRole(result.user.role)) {
      await invalidateSession();
      router.replace('/login');
      return;
    }

    if (!canAccessPath(pathname, result.user.role)) {
      router.replace('/admin/dashboard');
      return;
    }

    setUser(result.user);
    setReady(true);
  }

  useEffect(() => {
    void verifySession();
  }, [pathname, router]);

  const loadingMsg = sessionMessages.admin.loading();
  const apiDownMsg = sessionMessages.admin.apiUnavailable();

  if (apiUnavailable) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#F6F8FA] px-4 dark:bg-zinc-950">
        <p className="text-sm font-medium text-muted-foreground">{apiDownMsg.title}</p>
        {apiDownMsg.hint && (
          <p className="max-w-md text-center text-xs text-muted-foreground">{apiDownMsg.hint}</p>
        )}
        <button
          type="button"
          className="text-sm font-medium text-[#1E4C7C] hover:underline dark:text-cyan-400"
          onClick={() => void verifySession()}
        >
          {sessionMessages.admin.retryLabel}
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-[#F6F8FA] px-4 dark:bg-zinc-950">
        <p className="text-sm text-muted-foreground">{loadingMsg.title}</p>
        {loadingMsg.hint && (
          <p className="max-w-sm text-center text-xs text-muted-foreground">{loadingMsg.hint}</p>
        )}
      </div>
    );
  }

  return (
    <AdminToastProvider>
      <div className="flex h-screen overflow-hidden bg-[#F6F8FA] dark:bg-zinc-950">
        <AdminSidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
        />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminHeader search={search} onSearchChange={setSearch} user={user} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
