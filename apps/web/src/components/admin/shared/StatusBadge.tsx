import {
  AlertTriangle,
  Ban,
  CheckCircle,
  Clock,
  Eye,
  Shield,
  Star,
  User,
  Wifi,
  XCircle,
} from 'lucide-react';
import { cn } from '@app/ui';

export type BadgeVariant =
  | 'libre'
  | 'ocupado'
  | 'alerta'
  | 'incumplido'
  | 'bloqueado'
  | 'suspendido'
  | 'habilitado'
  | 'visita'
  | 'frecuente'
  | 'activo'
  | 'inactivo'
  | 'pendiente'
  | 'notificada'
  | 'resuelta'
  | 'derivada-bloqueo'
  | 'proximo'
  | 'normal'
  | 'error'
  | 'funcionario'
  | 'estudiante'
  | 'no-disponible';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

const configs: Record<
  BadgeVariant,
  { label: string; classes: string; icon: React.ReactNode }
> = {
  libre: {
    label: 'Libre',
    classes: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <CheckCircle className="size-3" />,
  },
  ocupado: {
    label: 'Ocupado',
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: <Clock className="size-3" />,
  },
  alerta: {
    label: 'Alerta',
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    icon: <AlertTriangle className="size-3" />,
  },
  incumplido: {
    label: 'Incumplido',
    classes: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    icon: <XCircle className="size-3" />,
  },
  bloqueado: {
    label: 'Bloqueado',
    classes: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    icon: <Ban className="size-3" />,
  },
  suspendido: {
    label: 'Suspendido',
    classes: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
    icon: <Shield className="size-3" />,
  },
  habilitado: {
    label: 'Habilitado',
    classes: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <CheckCircle className="size-3" />,
  },
  visita: {
    label: 'Visita',
    classes: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    icon: <User className="size-3" />,
  },
  frecuente: {
    label: 'Frecuente',
    classes: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    icon: <Star className="size-3 fill-current" />,
  },
  activo: {
    label: 'Activo',
    classes: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <Wifi className="size-3" />,
  },
  inactivo: {
    label: 'Inactivo',
    classes: 'bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-zinc-400',
    icon: <Clock className="size-3" />,
  },
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    icon: <Clock className="size-3" />,
  },
  notificada: {
    label: 'Notificada',
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: <Eye className="size-3" />,
  },
  resuelta: {
    label: 'Resuelta',
    classes: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <CheckCircle className="size-3" />,
  },
  'derivada-bloqueo': {
    label: 'Derivada a bloqueo',
    classes: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    icon: <Ban className="size-3" />,
  },
  proximo: {
    label: 'Próximo a incumplir',
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    icon: <AlertTriangle className="size-3" />,
  },
  normal: {
    label: 'Normal',
    classes: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    icon: <CheckCircle className="size-3" />,
  },
  error: {
    label: 'Error',
    classes: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
    icon: <XCircle className="size-3" />,
  },
  funcionario: {
    label: 'Funcionario',
    classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    icon: <User className="size-3" />,
  },
  estudiante: {
    label: 'Estudiante',
    classes: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    icon: <User className="size-3" />,
  },
  'no-disponible': {
    label: 'No disponible',
    classes: 'bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400',
    icon: <XCircle className="size-3" />,
  },
};

export function StatusBadge({ variant, label, size = 'md' }: StatusBadgeProps) {
  const cfg = configs[variant] ?? configs.inactivo;
  const displayLabel = label ?? cfg.label;

  return (
    <span
      className={cn(
        'inline-flex select-none items-center rounded-full font-medium',
        size === 'sm' ? 'gap-1 px-2 py-0.5 text-[11px]' : 'gap-1 px-2.5 py-1 text-xs',
        cfg.classes,
      )}
    >
      {cfg.icon}
      {displayLabel}
    </span>
  );
}
