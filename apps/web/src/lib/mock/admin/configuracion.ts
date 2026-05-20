import type {
  ConfiguracionAlertas,
  ConfiguracionBloqueos,
  ConfiguracionCorreos,
  ConfiguracionGeneral,
  ConfiguracionIdentificacion,
  ConfiguracionVisitas,
} from '@/types/admin/configuracion';

export const mockConfiguracionGeneral: ConfiguracionGeneral = {
  nombreSede: 'Sede Central',
  direccion: "Av. Libertador Bernardo O'Higgins 340, Santiago",
  correoContacto: 'bicicletero@universidad.cl',
  telefonoContacto: '+56 2 2654 7000',
};

export const mockConfiguracionIdentificacion: ConfiguracionIdentificacion = {
  enableRun: true,
  enableQr: true,
  enableBio: true,
};

export const mockConfiguracionVisitas: ConfiguracionVisitas = {
  allowVisitas: true,
  requireFotoVisita: false,
};

export const mockConfiguracionCorreos: ConfiguracionCorreos = {
  sendMailTerminos: true,
  sendMailIngreso: true,
  sendMailRetiro: false,
  sendMailAlerta: true,
};

export const mockConfiguracionAlertas: ConfiguracionAlertas = {
  horaLimite: '19:00',
  maxAlertas: '3',
};

export const mockConfiguracionBloqueos: ConfiguracionBloqueos = {
  autoBloqueo: false,
};

export const mockTerminos = `Reglamento de Uso del Bicicletero Institucional

1. El bicicletero es de uso exclusivo para ciclistas registrados en esta sede.
2. Cada ciclista podrá ingresar una bicicleta a la vez.
3. La bicicleta debe ser retirada antes de las 19:00 hrs del día de ingreso.
4. El no retiro dentro del horario establecido generará una alerta en el historial del usuario.
5. Superar 3 alertas puede resultar en la suspensión temporal del servicio.
6. El establecimiento no se hace responsable por daños o robo de bicicletas.
7. Cualquier daño al mobiliario o infraestructura del bicicletero será responsabilidad del usuario.`;

export const mockVistaPreviaCorreos = [
  {
    asunto: 'Reglamento de uso del bicicletero',
    body: 'Has aceptado los términos y condiciones de uso del bicicletero. Adjuntamos una copia para tu respaldo.',
  },
  {
    asunto: 'Ingreso de bicicleta registrado',
    body: 'Tu bicicleta fue registrada correctamente en el bicicletero. Cupo asignado: [N]. Hora de ingreso: [hora].',
  },
  {
    asunto: 'Alerta por no retiro de bicicleta',
    body: 'Tu bicicleta no fue retirada dentro del horario establecido. Este incumplimiento quedará registrado en tu historial.',
  },
];
