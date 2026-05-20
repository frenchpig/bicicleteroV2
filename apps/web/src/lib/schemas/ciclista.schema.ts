import { z } from 'zod';

export const ciclistaFormSchema = z.object({
  run: z.string().min(8, 'RUN inválido'),
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  tipo: z.enum(['funcionario', 'estudiante']),
});

export type CiclistaFormData = z.infer<typeof ciclistaFormSchema>;
