export type EstadoCiclista =
  | 'habilitado'
  | 'bloqueado'
  | 'alerta'
  | 'inactivo'
  | 'suspendido';

export type EstadoCupo = 'libre' | 'ocupado' | 'alerta' | 'no-disponible';

export type TipoAlerta = 'no-retiro' | 'retiro-tardio' | 'incumplimiento';

export type EstadoAlerta = 'activa' | 'resuelta' | 'derivada-bloqueo' | 'notificada';

export type TipoUsuario = 'funcionario' | 'estudiante';

export type ZonaCupo = 'A' | 'B' | 'C';

export type EstadoCumplimiento = 'normal' | 'proximo' | 'incumplido';
