'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, Users, FileText, FolderTree, Mail, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@app/ui';
import { Button } from '@app/ui';
import { clearAuth, getUser, isSuperAdmin } from '@/lib/auth';
import type { User } from '@app/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/categories', label: 'Categories', icon: FolderTree },
];

const adminItems = [
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/email', label: 'Email Config', icon: Mail },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [superAdmin, setSuperAdmin] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setSuperAdmin(isSuperAdmin());
  }, []);

  function handleLogout() {
    clearAuth();
    router.push('/login');
  }

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-[#E5E5E5] dark:border-[#2A2A2A] bg-[#F9F9F9] dark:bg-[#171717] px-3 py-4">
      <div className="mb-6 px-2">
        <h1 className="text-base font-semibold tracking-tight text-[#0D0D0D] dark:text-white">AppName</h1>
        {user && (
          <>
            <p className="mt-1 text-xs text-[#888] dark:text-[#8E8E8E] truncate">{user.email}</p>
            <span className={`mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
              user.role === 'SUPERADMIN'
                ? 'bg-[#F0E6FF] text-[#7C3AED] dark:bg-[#2D1F45] dark:text-[#C4B5FD]'
                : user.role === 'ADMIN'
                ? 'bg-[#E8F4FD] text-[#1D7FB5] dark:bg-[#1A2D3D] dark:text-[#7DC3EE]'
                : 'bg-[#EFEFEF] text-[#666] dark:bg-[#2A2A2A] dark:text-[#888]'
            }`}>
              {user.role}
            </span>
          </>
        )}
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
              pathname === href
                ? 'bg-[#EFEFEF] dark:bg-[#2A2A2A] text-[#0D0D0D] dark:text-white font-medium'
                : 'text-[#555] dark:text-[#AAAAAA] hover:bg-[#EFEFEF] dark:hover:bg-[#242424] hover:text-[#0D0D0D] dark:hover:text-white',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        {superAdmin &&
          adminItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                pathname === href
                  ? 'bg-[#EFEFEF] dark:bg-[#2A2A2A] text-[#0D0D0D] dark:text-white font-medium'
                  : 'text-[#555] dark:text-[#AAAAAA] hover:bg-[#EFEFEF] dark:hover:bg-[#242424] hover:text-[#0D0D0D] dark:hover:text-white',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
      </nav>

      <div className="space-y-0.5">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 rounded-lg px-3 text-[#555] dark:text-[#AAAAAA] hover:bg-[#EFEFEF] dark:hover:bg-[#242424] hover:text-[#0D0D0D] dark:hover:text-white"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          Toggle theme
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2.5 rounded-lg px-3 text-[#555] dark:text-[#AAAAAA] hover:bg-[#EFEFEF] dark:hover:bg-[#242424] hover:text-red-500 dark:hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
