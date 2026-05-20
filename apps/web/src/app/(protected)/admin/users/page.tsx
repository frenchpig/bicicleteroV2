'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import {
  Button, Badge, Card, CardContent,
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
  Input, Label,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@app/ui';
import { api } from '@/lib/api';
import { getUser, isSuperAdmin } from '@/lib/auth';
import { User, Role } from '@app/types';

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role).optional(),
});

const editSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.nativeEnum(Role).optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;

const ROLE_BADGE: Record<Role, string> = {
  [Role.SUPERADMIN]: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300',
  [Role.ADMIN]: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300',
  [Role.USER]: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const currentUser = getUser();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateFormData | EditFormData>({
      resolver: zodResolver(editing ? editSchema : createSchema) as any,
    });

  useEffect(() => {
    if (!isSuperAdmin()) {
      router.replace('/dashboard');
      return;
    }
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await api.get<User[]>('/users');
    setUsers(res.data);
  }

  function openCreate() {
    setEditing(null);
    reset({ email: '', password: '', role: Role.USER });
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    reset({ email: user.email, password: '', role: user.role });
    setOpen(true);
  }

  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(data: any) {
    setSubmitError(null);
    try {
      const payload = { ...data };
      if (editing) {
        if (!payload.password) delete payload.password;
        await api.patch(`/users/${editing.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
      setOpen(false);
      loadUsers();
    } catch (err: any) {
      setSubmitError(err.response?.data?.message ?? 'Something went wrong');
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete user "${user.email}"?`)) return;
    await api.delete(`/users/${user.id}`);
    loadUsers();
  }

  const isSelf = (user: User) => user.id === currentUser?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />
            <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          </div>
          <p className="text-muted-foreground">Superadmin — manage all application users</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={isSelf(user) ? 'bg-muted/40' : ''}>
                  <TableCell className="font-medium">
                    {user.email}
                    {isSelf(user) && (
                      <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE[user.role as Role]}`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(user)}
                        disabled={isSelf(user)}
                        title={isSelf(user) ? 'Cannot delete your own account' : 'Delete user'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input type="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-destructive">{(errors.email as any).message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>{editing ? 'New Password (optional)' : 'Password'}</Label>
              <Input type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-destructive">{(errors.password as any).message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <select
                {...register('role')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={Role.USER}>USER</option>
                <option value={Role.ADMIN}>ADMIN</option>
                <option value={Role.SUPERADMIN}>SUPERADMIN</option>
              </select>
            </div>
            {submitError && (
              <p className="text-xs text-destructive">{submitError}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
