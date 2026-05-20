export type SeccionConfig =
  | 'general'
  | 'identificacion'
  | 'visitas'
  | 'correos'
  | 'terminos'
  | 'alertas'
  | 'bloqueos';

export interface ConfiguracionGeneral {
  nombreSede: string;
  direccion: string;
  correoContacto: string;
  telefonoContacto: string;
}

export interface ConfiguracionIdentificacion {
  enableRun: boolean;
  enableQr: boolean;
  enableBio: boolean;
}

export interface ConfiguracionVisitas {
  allowVisitas: boolean;
  requireFotoVisita: boolean;
}

export interface ConfiguracionCorreos {
  sendMailTerminos: boolean;
  sendMailIngreso: boolean;
  sendMailRetiro: boolean;
  sendMailAlerta: boolean;
}

export interface ConfiguracionAlertas {
  horaLimite: string;
  maxAlertas: string;
}

export interface ConfiguracionBloqueos {
  autoBloqueo: boolean;
}
