'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import {
  Button, Card, CardContent,
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
  Input, Label,
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@app/ui';
import { api } from '@/lib/api';
import { getUser, isSuperAdmin } from '@/lib/auth';
import { User, Role } from '@app/types';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@/lib/schemas/user.schema';

const ROLE_BADGE: Record<Role, string> = {
  [Role.SUPERADMIN]: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300',
  [Role.ADMIN]: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300',
};

export default function UsuariosPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const currentUser = getUser();

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<CreateUserFormData | UpdateUserFormData>({
      resolver: zodResolver(editing ? updateUserSchema : createUserSchema),
    });

  useEffect(() => {
    if (!isSuperAdmin()) {
      router.replace('/admin/dashboard');
      return;
    }
    void loadUsers();
  }, [router]);

  async function loadUsers() {
    const res = await api.get<User[]>('/api/users');
    setUsers(res.data);
  }

  function openCreate() {
    setEditing(null);
    reset({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      role: Role.ADMIN,
    });
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    reset({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      password: '',
      role: user.role,
    });
    setOpen(true);
  }

  async function onSubmit(data: CreateUserFormData | UpdateUserFormData) {
    setSubmitError(null);
    try {
      if (editing) {
        const payload = { ...data };
        if (!payload.password) delete (payload as UpdateUserFormData).password;
        await api.patch(`/api/users/${editing.id}`, payload);
      } else {
        await api.post('/api/users', data);
      }
      setOpen(false);
      await loadUsers();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : undefined;
      const text = Array.isArray(message) ? message.join(', ') : message;
      setSubmitError(text ?? 'Algo salió mal');
    }
  }

  async function handleDelete(user: User) {
    if (!confirm(`¿Eliminar usuario "${user.email}"?`)) return;
    try {
      await api.delete(`/api/users/${user.id}`);
      await loadUsers();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      setSubmitError(message ?? 'No se pudo eliminar');
    }
  }

  const isSelf = (user: User) => user.id === currentUser?.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-purple-600" />
            <h2 className="text-3xl font-bold tracking-tight text-[#1B1B1B] dark:text-zinc-50">
              Usuarios del sistema
            </h2>
          </div>
          <p className="text-muted-foreground">SuperAdmin — administrar cuentas de acceso</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={isSelf(user) ? 'bg-muted/40' : ''}>
                  <TableCell className="font-medium">
                    {user.nombre} {user.apellido}
                    {isSelf(user) && (
                      <span className="ml-2 text-xs text-muted-foreground">(tú)</span>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${ROLE_BADGE[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString('es-CL')}
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
                        title={isSelf(user) ? 'No puedes eliminar tu cuenta' : 'Eliminar'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No hay usuarios registrados.
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
            <DialogTitle>{editing ? 'Editar usuario' : 'Nuevo usuario'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input {...register('nombre')} />
                {errors.nombre && (
                  <p className="text-xs text-destructive">{errors.nombre.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Apellido</Label>
                <Input {...register('apellido')} />
                {errors.apellido && (
                  <p className="text-xs text-destructive">{errors.apellido.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label>Correo</Label>
              <Input type="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>{editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}</Label>
              <Input type="password" {...register('password')} />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Rol</Label>
              <select
                {...register('role')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={Role.ADMIN}>ADMIN</option>
                <option value={Role.SUPERADMIN}>SUPERADMIN</option>
              </select>
            </div>
            {submitError && <p className="text-xs text-destructive">{submitError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : editing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
