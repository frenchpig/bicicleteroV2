# Guía para desarrollar un nuevo módulo

Esta guía documenta el proceso completo para crear un nuevo módulo en el proyecto, usando **Productos** como ejemplo práctico. Sigue los pasos en orden.

---

## Stack y estructura del proyecto

```
app/
├── apps/
│   ├── api/              # NestJS (puerto 3001)
│   └── web/              # Next.js 15 (puerto 3000)
├── libs/
│   ├── ui/               # Componentes shadcn/ui compartidos
│   └── types/            # Interfaces TypeScript compartidas
```

---

## Paso 1 — Schema de base de datos (Prisma)

Archivo: `apps/api/prisma/schema.prisma`

Agrega el modelo y, si aplica, la relación con `User`:

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String
  price       Float
  stock       Int      @default(0)
  createdById Int
  createdBy   User     @relation(fields: [createdById], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Si añades la relación en `User`, agrega el campo inverso:

```prisma
model User {
  // ... campos existentes
  products Product[]
}
```

Corre la migración:

```bash
npm run db:migrate
```

---

## Paso 2 — Tipos compartidos

Archivo: `libs/types/src/product.types.ts`

```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdById: number;
  createdBy?: { id: number; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
}
```

Exporta desde el barrel `libs/types/src/index.ts`:

```typescript
export * from './product.types';
```

---

## Paso 3 — Módulo en el API (NestJS)

Crea la carpeta `apps/api/src/products/` con estos archivos:

### 3.1 DTOs

`apps/api/src/products/dto/create-product.dto.ts`

```typescript
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}
```

`apps/api/src/products/dto/update-product.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

### 3.2 Service

`apps/api/src/products/products.service.ts`

```typescript
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly INCLUDE_CREATOR = {
    createdBy: { select: { id: true, email: true } },
  };

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: this.INCLUDE_CREATOR,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: this.INCLUDE_CREATOR,
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  create(dto: CreateProductDto, userId: number) {
    return this.prisma.product.create({
      data: { ...dto, createdById: userId },
      include: this.INCLUDE_CREATOR,
    });
  }

  async update(id: number, dto: UpdateProductDto, userId: number, userRole: string) {
    const product = await this.findOne(id);
    const isOwner = product.createdById === userId;
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(userRole);
    if (!isOwner && !isAdmin) throw new ForbiddenException('Sin permiso');
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number, userRole: string) {
    const product = await this.findOne(id);
    const isOwner = product.createdById === userId;
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(userRole);
    if (!isOwner && !isAdmin) throw new ForbiddenException('Sin permiso');
    return this.prisma.product.delete({ where: { id } });
  }
}
```

### 3.3 Controller

`apps/api/src/products/products.controller.ts`

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateProductDto, @Request() req) {
    return this.productsService.create(dto, req.user.sub);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto, @Request() req) {
    return this.productsService.update(id, dto, req.user.sub, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.productsService.remove(id, req.user.sub, req.user.role);
  }
}
```

### 3.4 Module

`apps/api/src/products/products.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

### 3.5 Registrar en AppModule

`apps/api/src/app.module.ts` — agrega el import:

```typescript
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // ... módulos existentes
    ProductsModule,
  ],
})
export class AppModule {}
```

---

## Paso 4 — Página en el frontend (Next.js)

Crea `apps/web/src/app/(protected)/products/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { Product, CreateProductDto } from '@app/types';
import { Button } from '@app/ui/components/button';
import { Input } from '@app/ui/components/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@app/ui/components/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@app/ui/components/dialog';
import { useForm } from 'react-hook-form';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const user = getUser();
  const { register, handleSubmit, reset, setValue } = useForm<CreateProductDto>();

  const load = async () => {
    const res = await api.get('/products');
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (data: CreateProductDto) => {
    if (editing) {
      await api.patch(`/products/${editing.id}`, data);
    } else {
      await api.post('/products', data);
    }
    setOpen(false);
    setEditing(null);
    reset();
    load();
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('price', product.price);
    setValue('stock', product.stock);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/products/${id}`);
    load();
  };

  const canEdit = (product: Product) => {
    return user?.id === product.createdById || ['ADMIN', 'SUPERADMIN'].includes(user?.role || '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); reset(); } }}>
          <DialogTrigger asChild>
            <Button>Nuevo producto</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar producto' : 'Crear producto'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Input placeholder="Nombre" {...register('name')} />
              <Input placeholder="Descripción" {...register('description')} />
              <Input placeholder="Precio" type="number" step="0.01" {...register('price', { valueAsNumber: true })} />
              <Input placeholder="Stock" type="number" {...register('stock', { valueAsNumber: true })} />
              <Button type="submit" className="w-full">
                {editing ? 'Guardar cambios' : 'Crear'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Creado por</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>${p.price.toFixed(2)}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell>{p.createdBy?.email}</TableCell>
              <TableCell className="space-x-2">
                {canEdit(p) && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => openEdit(p)}>Editar</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Paso 5 — Agregar al Sidebar

Archivo: `apps/web/src/components/layout/Sidebar.tsx`

Agrega el enlace en el array de navegación (busca la sección con Dashboard y Posts):

```typescript
{ href: '/products', label: 'Productos', icon: PackageIcon },
```

Importa el ícono desde `lucide-react`:

```typescript
import { LayoutDashboard, FileText, Users, Package } from 'lucide-react';
```

---

## Referencia rápida — Endpoints del módulo

| Método | Endpoint | Auth | Permiso |
|--------|----------|------|---------|
| GET | `/products` | No | Público |
| GET | `/products/:id` | No | Público |
| POST | `/products` | Sí | Cualquier usuario autenticado |
| PATCH | `/products/:id` | Sí | Autor o ADMIN/SUPERADMIN |
| DELETE | `/products/:id` | Sí | Autor o ADMIN/SUPERADMIN |

---

## Checklist de pasos

- [ ] Schema Prisma + migración (`npm run db:migrate`)
- [ ] Tipos en `libs/types/src/product.types.ts` + export en index
- [ ] DTOs en `apps/api/src/products/dto/`
- [ ] Service en `apps/api/src/products/products.service.ts`
- [ ] Controller en `apps/api/src/products/products.controller.ts`
- [ ] Module en `apps/api/src/products/products.module.ts`
- [ ] Registrar `ProductsModule` en `app.module.ts`
- [ ] Página en `apps/web/src/app/(protected)/products/page.tsx`
- [ ] Enlace en `Sidebar.tsx`

---

## Comandos útiles

```bash
npm run dev              # Inicia API + web en paralelo
npm run db:migrate       # Corre migraciones de Prisma
npm run db:generate      # Regenera el cliente de Prisma
npm run db:seed          # Crea el usuario admin por defecto
```
