# Fullstack Monorepo

Monorepo Nx con Next.js 15 (App Router) en el frontend y NestJS en el backend.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| Formularios | React Hook Form, Zod |
| HTTP client | Axios |
| Backend | NestJS 10, Prisma ORM 5 |
| Base de datos | PostgreSQL |
| Auth | JWT + Passport + bcrypt |
| Monorepo | Nx 20, npm workspaces |

## Estructura

```
app/
├── apps/
│   ├── web/          # Next.js  (puerto 3000)
│   └── api/          # NestJS   (puerto 3001)
├── libs/
│   ├── ui/           # Componentes shadcn/ui compartidos
│   ├── types/        # Interfaces TypeScript compartidas
│   └── config/       # Configuración compartida
└── package.json
```

## Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

**API** — edita `apps/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app?schema=public"
JWT_SECRET="tu-secreto"
JWT_EXPIRES_IN="7d"
PORT=3001
```

**Web** — edita `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Levantar la base de datos

**Opción A — Docker (recomendado)**
```bash
docker-compose up -d
```

**Opción B — PostgreSQL local**
```bash
createdb -U postgres app
# Ajusta DATABASE_URL en apps/api/.env con tus credenciales
```

### 4. Migrations y seed

```bash
npm run db:migrate   # crea las tablas
npm run db:seed      # crea el usuario admin por defecto
```

### 5. Arrancar los dos servidores

```bash
npm run dev
```

O por separado:
```bash
npm run dev:api   # terminal 1
npm run dev:web   # terminal 2
```

Abre [http://localhost:3000](http://localhost:3000).

## Credenciales por defecto

| Email | Password | Rol |
|---|---|---|
| admin@test.com | admin123 | ADMIN |

## Roles

| Rol | Descripción |
|---|---|
| `USER` | Usuario estándar |
| `ADMIN` | Gestión de usuarios |
| `SUPERADMIN` | Acceso total |

## API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me              (JWT requerido)

GET    /api/users                (SUPERADMIN)
GET    /api/users/:id            (SUPERADMIN)
POST   /api/users                (SUPERADMIN)
PATCH  /api/users/:id            (SUPERADMIN)
DELETE /api/users/:id            (SUPERADMIN)

GET    /api/posts                (público)
GET    /api/posts/:id            (público)
POST   /api/posts                (JWT requerido)
PATCH  /api/posts/:id            (JWT, post propio o ADMIN)
DELETE /api/posts/:id            (JWT, post propio o ADMIN)
```

## Páginas del frontend

| Ruta | Acceso |
|---|---|
| `/login` | Público |
| `/register` | Público |
| `/dashboard` | Autenticado |
| `/posts` | Autenticado |
| `/admin/users` | ADMIN |

## Comandos útiles

```bash
npm run dev             # inicia api + web en paralelo
npm run lint            # lint de todos los proyectos
npm run build:web       # build del frontend
npm run build:api       # build del backend

npm run db:generate     # regenerar cliente Prisma
npm run db:migrate      # correr migraciones
npm run db:seed         # seed del usuario admin
```
