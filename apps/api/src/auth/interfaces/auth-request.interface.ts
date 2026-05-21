export interface AuthRequestUser {
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest {
  user: AuthRequestUser;
}
