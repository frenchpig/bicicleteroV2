'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@app/ui';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Post, User } from '@app/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({ users: 0, posts: 0 });
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();

  useEffect(() => {
    Promise.all([
      api.get<Post[]>('/posts').then((r) => r.data.length),
      currentUser?.role === 'SUPERADMIN'
        ? api.get<User[]>('/users').then((r) => r.data.length)
        : Promise.resolve(null),
    ])
      .then(([posts, users]) => setStats({ posts, users: users ?? 0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {currentUser?.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.posts}</div>
          </CardContent>
        </Card>

        {currentUser?.role === 'SUPERADMIN' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.users}</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentUser?.role}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
