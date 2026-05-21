'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label } from '@app/ui';
import { api } from '@/lib/api';
import { invalidateSession, refreshSession, setAuth } from '@/lib/auth';
import type { LoginResponse } from '@app/types';
import { loginSchema, type LoginFormData } from '@/lib/schemas/auth.schema';
import { sessionMessages } from '@/lib/session-messages';

export default function LoginPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } =
    useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    async function checkExistingSession() {
      const result = await refreshSession(5);
      if (result.status === 'ok') {
        router.replace('/admin/dashboard');
        return;
      }
      if (result.status === 'unauthorized') {
        await invalidateSession();
      }
      setCheckingSession(false);
    }
    void checkExistingSession();
  }, [router]);

  async function onSubmit(data: LoginFormData) {
    try {
      const res = await api.post<LoginResponse>('/api/auth/login', data);
      setAuth(res.data.user);
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data?.message
          : undefined;
      const text = Array.isArray(message) ? message.join(', ') : message;
      setError('root', { message: text ?? 'No se pudo iniciar sesión' });
    }
  }

  const checkingMsg = sessionMessages.login.checking();
  const footerHelp = sessionMessages.login.footerHelp();

  if (checkingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-muted/40 px-4 dark:bg-background">
        <p className="text-sm text-muted-foreground">{checkingMsg.title}</p>
        {checkingMsg.hint && (
          <p className="max-w-sm text-center text-xs text-muted-foreground">{checkingMsg.hint}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 dark:bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al panel</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {errors.root && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {errors.root.message}
              </p>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@bicicletero.cl"
                autoComplete="email"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
            <p className="text-sm text-muted-foreground">{footerHelp}</p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
