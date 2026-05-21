'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { invalidateSession, refreshSession } from '@/lib/auth';
import { isStaffRole } from '@/lib/route-access';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function guard() {
      const result = await refreshSession();
      if (result.status === 'ok' && isStaffRole(result.user.role)) return;
      if (result.status === 'unauthorized') {
        await invalidateSession();
      }
      router.replace('/login');
    }
    void guard();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
