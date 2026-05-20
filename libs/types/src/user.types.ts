export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: Role;
}
