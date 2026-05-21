// Responsabilidad: mensajes de UX de sesión (producción vs desarrollo).
// Usado por: login, layout admin.

export const isDevEnvironment = process.env.NODE_ENV === 'development';

type MessageSet = {
  title: string;
  hint?: string;
};

const loginChecking: { production: MessageSet; development: MessageSet } = {
  production: {
    title: 'Un momento…',
  },
  development: {
    title: 'Verificando sesión…',
    hint: 'Comprobando cookie httpOnly vía BFF (/api/auth/me) y API Nest en :3001.',
  },
};

const loginFooterHelp: { production: string; development: string } = {
  production: 'Si no puedes acceder, contacta al administrador del sistema.',
  development:
    '¿Problemas? Cierra otras pestañas, ejecuta «Cerrar sesión» o reinicia `bun run dev`. Si la cookie quedó inválida, esta página la limpiará al cargar.',
};

const adminLoading: { production: MessageSet; development: MessageSet } = {
  production: {
    title: 'Cargando…',
  },
  development: {
    title: 'Cargando sesión…',
    hint: 'Nest puede arrancar unos segundos después que Next; se reintenta automáticamente.',
  },
};

const adminApiUnavailable: { production: MessageSet; development: MessageSet } = {
  production: {
    title: 'Servicio no disponible',
    hint: 'No pudimos validar tu sesión. Intenta de nuevo en unos momentos.',
  },
  development: {
    title: 'No se pudo conectar con la API',
    hint: 'Comprueba `bun run dev`, que Nest escuche en http://localhost:3001/api y que INTERNAL_API_KEY coincida en apps/web y apps/api.',
  },
};

function pick<T>(pair: { production: T; development: T }): T {
  return isDevEnvironment ? pair.development : pair.production;
}

export const sessionMessages = {
  login: {
    checking: () => pick(loginChecking),
    footerHelp: () => pick(loginFooterHelp),
  },
  admin: {
    loading: () => pick(adminLoading),
    apiUnavailable: () => pick(adminApiUnavailable),
    retryLabel: 'Reintentar',
  },
};
