import { User } from './user.types';

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginResponse {
  user: User;
}

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}
