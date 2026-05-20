export interface AppEnv {
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  NEXT_PUBLIC_API_URL: string;
}

export const defaultEnv: Partial<AppEnv> = {
  JWT_EXPIRES_IN: '7d',
  NEXT_PUBLIC_API_URL: 'http://localhost:3001',
};
