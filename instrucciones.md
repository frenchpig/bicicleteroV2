Create a fullstack monorepo using Nx with the following structure and requirements:

Workspace Setup:

- Use Nx latest version
- Use integrated monorepo style

Generate apps:

/apps
  /web  -> Next.js (App Router, TypeScript)
  /api  -> NestJS backend

Generate libraries:

/libs
  /ui       -> shared UI components (shadcn/ui)
  /types    -> shared TypeScript interfaces
  /config   -> shared eslint and tsconfig

Tech Stack:

Frontend (web):
- Next.js App Router
- Tailwind CSS
- shadcn/ui

Backend (api):
- NestJS
- Prisma ORM
- PostgreSQL

Core Features:

1. Authentication:
- Register
- Login
- JWT authentication
- Password hashing (bcrypt)
- Role-based system: USER, ADMIN

2. Authorization:
- Protect routes using guards (NestJS)
- Admin-only endpoints

3. User Management (Admin):
- List users
- Create user
- Update user
- Delete user

4. Posts:
- Authenticated users can:
  - Create posts
  - Edit their own posts
  - Delete their own posts
- Public can view posts

5. Prisma Models:

User:
- id
- email
- password
- role
- createdAt

Post:
- id
- title
- content
- authorId
- createdAt

Relations:
- User 1:N Post

6. API Modules (NestJS):
- auth
- users
- posts

7. Frontend Pages:

- /login
- /register
- /dashboard
- /admin/users
- /posts

8. UI Requirements:

Use shadcn/ui components:
- Table (users list)
- Dialog (create/edit user)
- Forms (login/register/post)
- Buttons, Inputs, Cards

9. Nx Features:

- Use Nx generators for apps and libs
- Enable task pipelines:
  - build
  - serve
  - lint
  - test
- Use path aliases for libs
- Ensure type sharing between frontend/backend

10. Environment:

- .env files per app
- Shared environment typing

11. Docker:

- docker-compose.yml with PostgreSQL

12. Seed:

- Create seed script:
  - Admin user:
    email: admin@test.com
    password: admin123

Ensure modular, scalable architecture and clean separation of concerns.


Use Nx CLI to generate:

- Next.js app:
  nx g @nx/next:app web

- NestJS app:
  nx g @nx/nest:app api

- Shared libraries:
  nx g @nx/js:lib ui
  nx g @nx/js:lib types
  nx g @nx/js:lib config


  Build a modern admin dashboard using shadcn/ui:

- Sidebar layout:
  - Dashboard
  - Users (admin only)
  - Posts

- Use:
  - Table for users
  - Dialog for CRUD
  - Forms with validation
  - Cards for dashboard

- Include dark/light mode


Implement authentication in NestJS:

- JWT strategy with Passport
- AuthGuard
- RolesGuard (ADMIN)

Structure:
- auth.module
- auth.service
- auth.controller

Frontend:
- Protect routes
- Redirect unauthenticated users



Set up Prisma in Nx monorepo:

- Place Prisma in /apps/api
- Create schema with User and Post
- Run migrations
- Generate client

- Create seed.ts script


Create docker-compose.yml:

services:
  db:
    image: postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app


      