export enum Role {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  role?: Role;
}
