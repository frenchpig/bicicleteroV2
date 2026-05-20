# Sistema de diseño — Bicicletero

**Versión:** 1.0  
**Última actualización:** mayo 2026  
**Fuentes de referencia:**

| Tema | Carpeta mockup | Documento / código base |
|------|----------------|-------------------------|
| **Light** | `mockups/bicicletero-original` | [`GUIA_DISENO.md`](../mockups/bicicletero-original/GUIA_DISENO.md) |
| **Dark** | `mockups/bicicletero-2` | [`theme.css`](../mockups/bicicletero-2/src/styles/theme.css), [`default_shadcn_theme.css`](../mockups/bicicletero-2/default_shadcn_theme.css), componentes shadcn + tótem |

**Experiencias del producto:** panel administrativo web, vista operativa de guardia, tótem touch público.

---

## Principio de implementación

> **Todos los estilos del sistema deben implementarse exclusivamente con clases de utilidad de Tailwind CSS** — sin hojas de estilo personalizadas, sin atributos `style` inline y sin variables CSS propias, salvo el caso excepcional en que Tailwind no pueda expresar el valor (debe documentarse y justificarse en el PR).

En la práctica:

1. **Colores de marca Light** con hex exactos del mockup original → `bg-[#1E4C7C]`, `text-[#616161]`, etc. (sigue siendo Tailwind).
2. **Tokens semánticos Dark (shadcn)** → preferir utilidades generadas por `@theme` (`bg-background`, `text-foreground`, `border-border`) una vez configurados en el proyecto; en esta guía se documentan equivalencias Tailwind directas para handoff sin depender del build.
3. **Componentes** → átomos en `libs/ui` (shadcn); páginas solo orquestan y componen (ver regla de componentes atómicos del repo).

---

## Tema Light vs Tema Dark

| Aspecto | Tema Light | Tema Dark |
|---------|------------|-----------|
| Origen | Sistema institucional azul (#1E4C7C), fondos claros, superficies blancas | shadcn + paleta OKLCH/neutra; tótem en azul marino profundo |
| Activación | Por defecto (sin clase `dark`) | Clase `dark` en ancestro (`<html class="dark">`) |
| Primario | Azul #1E4C7C | Foreground claro sobre fondo oscuro (`primary` invertido en shadcn) |
| Fondo app | #F6F8FA | ~`oklch(0.145 0 0)` ≈ zinc-950 |
| Sidebar admin | No definida en original (fondo claro) | `#1e3a5f` / tokens `sidebar-*` en mockup 2 |
| Tótem | Hereda contraste alto del flujo público | `#0a1628` / `#0f2040` (shell dedicado) |

---

## 1. Colores

### 1.1 Tema Light — tokens semánticos

Extraídos de `mockups/bicicletero-original/GUIA_DISENO.md`.

#### Primario (escala)

| Token semántico | Hex | Clase Tailwind sugerida | Uso |
|-----------------|-----|------------------------|-----|
| `primary-50` | `#EBF1F7` | `bg-[#EBF1F7]` | Hover sutil, fondos de alerta info |
| `primary-100` | `#C5D9E8` | `bg-[#C5D9E8]` | Fondos alternativos |
| `primary-200` | `#9FC4D9` | `bg-[#9FC4D9]` | Fondos intermedios |
| `primary-300` | `#5B8BBD` | `border-[#5B8BBD]` / `ring-[#5B8BBD]` | Focus ring, bordes activos |
| `primary` | `#1E4C7C` | `bg-[#1E4C7C]` `text-[#1E4C7C]` | Botones, enlaces, marca |
| `primary-hover` | `#15365A` | `hover:bg-[#15365A]` | Hover botón primario |
| `primary-800` | `#1a3f63` | `hover:bg-[#1a3f63]` | Hover oscuro alternativo |
| `primary-900` | `#0f2538` | `bg-[#0f2538]` | Estados muy oscuros |

#### Superficie y texto

| Token semántico | Hex / valor | Clase Tailwind sugerida | Uso |
|-----------------|-------------|------------------------|-----|
| `background` | `#F6F8FA` | `bg-[#F6F8FA]` | Fondo de aplicación |
| `surface` | `#FFFFFF` | `bg-white` | Cards, modales, inputs |
| `text-primary` | `#1B1B1B` | `text-neutral-900` o `text-[#1B1B1B]` | Títulos, cuerpo principal |
| `text-secondary` | `#616161` | `text-neutral-500` o `text-[#616161]` | Labels, metadatos |
| `border-subtle` | `rgba(0,0,0,0.1)` | `border-black/10` | Inputs, cards, separadores |

#### Estados — éxito, error, advertencia, info

| Token | 50 / fondo | 300 / borde | 500 / default | 700 / hover | Tailwind (ejemplo 500) |
|-------|------------|-------------|---------------|-------------|-------------------------|
| `success` | `#E8F5E9` | `#81C784` | `#2E7D32` | `#1b5e20` | `bg-green-700` ≈ / `bg-[#2E7D32]` |
| `danger` | `#ffebee` | `#e57373` | `#C62828` | `#b71c1c` | `bg-red-700` ≈ / `bg-[#C62828]` |
| `warning` | `#FFF3E0` | `#FFB74D` | `#ED6C02` | `#E65100` | `bg-orange-600` ≈ / `bg-[#ED6C02]` |
| `info` | `#E1F5FE` | `#4FC3F7` | `#0288D1` | `#01579b` | `bg-sky-600` ≈ / `bg-[#0288D1]` |

Alertas Light (patrón):

```html
<div class="flex gap-3 rounded-lg border border-[#5B8BBD] bg-[#EBF1F7] p-4">
  <span class="text-[#1E4C7C]">…icono…</span>
  <div>
    <p class="text-base font-medium text-[#15365A]">Información</p>
    <p class="text-sm text-[#15365A]">Mensaje informativo.</p>
  </div>
</div>
```

### 1.2 Tema Dark — tokens semánticos

Extraídos de `mockups/bicicletero-2/default_shadcn_theme.css` (bloque `.dark`) y shell del tótem en `TotemApp.tsx`.

#### Superficie y texto (shadcn dark)

| Token semántico | Valor referencia | Clase Tailwind sugerida | Uso |
|-----------------|------------------|------------------------|-----|
| `background` | `oklch(0.145 0 0)` | `bg-zinc-950` `dark:bg-zinc-950` | Fondo app |
| `foreground` | `oklch(0.985 0 0)` | `text-zinc-50` `dark:text-zinc-50` | Texto principal |
| `card` | `oklch(0.145 0 0)` | `dark:bg-zinc-950` | Cards |
| `card-foreground` | `oklch(0.985 0 0)` | `dark:text-zinc-50` | Texto en card |
| `muted` | `oklch(0.269 0 0)` | `dark:bg-zinc-800` | Fondos secundarios |
| `muted-foreground` | `oklch(0.708 0 0)` | `dark:text-zinc-400` | Texto atenuado |
| `accent` | `oklch(0.269 0 0)` | `dark:bg-zinc-800` | Hover filas, ghost |
| `border` | `oklch(0.269 0 0)` | `dark:border-zinc-800` | Bordes |
| `input` | `oklch(0.269 0 0)` | `dark:bg-zinc-800/30` | Fondo input |
| `ring` | `oklch(0.439 0 0)` | `dark:ring-zinc-600` | Focus |

#### Acciones y destructivo (dark)

| Token | Valor referencia | Clase Tailwind |
|-------|------------------|----------------|
| `primary` | `oklch(0.985 0 0)` | `dark:bg-zinc-50 dark:text-zinc-900` |
| `primary-foreground` | `oklch(0.205 0 0)` | `dark:text-zinc-900` |
| `secondary` | `oklch(0.269 0 0)` | `dark:bg-zinc-800` |
| `destructive` | `oklch(0.396 0.141 25.723)` | `dark:bg-red-900/60` |
| `destructive-foreground` | `oklch(0.637 0.237 25.331)` | `dark:text-red-300` |

#### Sidebar administrativo (dark / institucional mockup 2)

| Token | Hex (theme.css `:root` light sidebar; dark usa OKLCH) | Tailwind |
|-------|-----------------------------------------------------|----------|
| `sidebar` | `#1e3a5f` (light) / `oklch(0.205)` (dark) | `bg-[#1e3a5f]` `dark:bg-zinc-900` |
| `sidebar-foreground` | `#e2e8f0` | `text-slate-200` |
| `sidebar-primary` | `#0891b2` (acento cian) | `bg-cyan-600` |
| `sidebar-accent` | `#16304f` | `bg-[#16304f]` |
| `sidebar-border` | `#16304f` | `border-[#16304f]` |

#### Tótem — shell oscuro dedicado

| Token | Hex | Tailwind |
|-------|-----|----------|
| `totem-bg` | `#0a1628` | `bg-[#0a1628]` |
| `totem-bg-elevated` | `#0f2040` | `bg-[#0f2040]` |
| `totem-border` | `#16304f` | `border-[#16304f]` |
| `totem-accent` | `#0891b2` | `text-cyan-600` `bg-cyan-600` |
| `totem-text-muted` | `#64748b` | `text-slate-500` |
| `totem-text-subtle` | `#94a3b8` | `text-slate-400` |
| `totem-online` | `#4ade80` | `text-green-400` |

#### Estados semánticos (mockup 2 — `:root` light, válidos también con utilidades fijas)

| Token | Hex | Tailwind |
|-------|-----|----------|
| `success` | `#16a34a` | `bg-green-600` `text-green-600` |
| `warning` | `#d97706` | `bg-amber-600` |
| `info` | `#0891b2` | `bg-cyan-600` |
| `destructive` | `#dc2626` | `bg-red-600` |

### 1.3 Badges de dominio (ambos temas)

Definidos en `mockups/bicicletero-2/src/app/components/shared/StatusBadge.tsx`. En Light usan fondos `-50`; en Dark añadir variantes `dark:`:

| Variante | Light (fondo / texto) | Dark sugerido |
|----------|----------------------|---------------|
| `libre` / `habilitado` | `bg-green-50 text-green-700` | `dark:bg-green-950 dark:text-green-300` |
| `ocupado` | `bg-blue-50 text-blue-700` | `dark:bg-blue-950 dark:text-blue-300` |
| `alerta` / `proximo` | `bg-amber-50 text-amber-700` | `dark:bg-amber-950 dark:text-amber-300` |
| `incumplido` / `bloqueado` | `bg-red-50 text-red-700` | `dark:bg-red-950 dark:text-red-300` |
| `visita` | `bg-purple-50 text-purple-700` | `dark:bg-purple-950 dark:text-purple-300` |
| `inactivo` | `bg-gray-100 text-gray-600` | `dark:bg-zinc-800 dark:text-zinc-400` |

---

## 2. Tipografía

### 2.1 Familias

| Rol | Familia | Tailwind |
|-----|---------|----------|
| UI general | Inter | `font-sans` (configurar `fontFamily.sans: ['Inter', 'system-ui', 'sans-serif']`) |
| RUN, cupos, timestamps | JetBrains Mono | `font-mono` |
| Fallback sistema | system-ui | incluido en stack sans |

Referencia: [`fonts.css`](../mockups/bicicletero-2/src/styles/fonts.css).

### 2.2 Escala — Tema Light (original)

| Token | Tamaño | Line-height | Peso | Tailwind |
|-------|--------|-------------|------|----------|
| `text-xs` / caption | 12px | 1.5 | 400 | `text-xs leading-normal` |
| `text-sm` / label | 14px | 1.5 | 500 | `text-sm font-medium` |
| `text-base` / body | 16px | 1.5 | 400 | `text-base` |
| `text-lg` / h3 | 20px | 1.5 | 600 | `text-lg font-semibold` |
| `text-xl` / h2 | 24px | 1.5 | 600 | `text-xl font-semibold` |
| `text-2xl` / h1 | 32px | 1.5 | 700 | `text-2xl font-bold` |

Base documento: `html` → `text-base` (16px).

### 2.3 Escala — Tema Dark / operación (mockup 2)

| Rol | Tamaño | Tailwind |
|-----|--------|----------|
| Display tótem / cupo asignado | 48–64px | `text-5xl` `md:text-6xl` `font-bold` |
| H1 página | 32px | `text-2xl font-medium` |
| H2 sección | 24px | `text-xl font-medium` |
| H3 | 20px | `text-lg font-medium` |
| Body admin | 16px | `text-base` |
| Body tótem mínimo | 22–24px | `text-xl` `md:text-2xl` |
| Botón tótem | 24–28px | `text-2xl font-semibold` |
| Caption | 12px | `text-xs text-muted-foreground` |

En dark, títulos de página: `dark:text-zinc-50`; descripciones: `dark:text-zinc-400`.

---

## 3. Espaciado y layout

### 3.1 Escala (sistema 4px / 8pt)

| Token | px | Tailwind |
|-------|-----|----------|
| `spacing-0` | 0 | `p-0` `gap-0` |
| `spacing-1` | 4 | `p-1` `gap-1` |
| `spacing-2` | 8 | `p-2` `gap-2` |
| `spacing-3` | 12 | `p-3` `gap-3` |
| `spacing-4` | 16 | `p-4` `gap-4` |
| `spacing-5` | 20 | `p-5` |
| `spacing-6` | 24 | `p-6` `gap-6` |
| `spacing-8` | 32 | `p-8` `gap-8` |
| `spacing-10` | 40 | `p-10` |
| `spacing-12` | 48 | `p-12` |
| `spacing-16` | 64 | `p-16` |

**Convenciones de layout:**

| Contexto | Padding / gap | Tailwind |
|----------|---------------|----------|
| Card interno | 24px | `p-6` |
| Form field stack | 8px | `space-y-2` |
| Sección de página | 32px | `py-8` `gap-8` |
| Sidebar item | 9–12px vertical | `py-2.5 px-3` |
| Tótem contenido | 32px 24px | `px-6 py-8` |

### 3.2 Breakpoints

| Nombre | Ancho | Tailwind prefix |
|--------|-------|-----------------|
| móvil | 360–430px | default |
| `sm` | 480px | `sm:` (original) |
| `md` / tablet | 768px | `md:` |
| `lg` | 1024px | `lg:` |
| `xl` / desktop | 1280px | `xl:` |
| `2xl` | 1400–1600px | `2xl:` |

**Grillas:**

- Móvil: 4 columnas, margen 16px → `px-4`, `grid-cols-4`
- Tablet: 8 columnas → `md:grid-cols-8`
- Desktop: 12 columnas → `xl:grid-cols-12`

**Tótem:** diseñar para 1080×1920 (vertical) y 1920×1080 (horizontal); contenedor centrado `max-w-2xl mx-auto`.

### 3.3 Z-index

| Token | Valor | Tailwind |
|-------|-------|----------|
| `dropdown` | 1000 | `z-[1000]` |
| `sticky` | 1020 | `z-[1020]` |
| `fixed` / header | 1030 | `z-[1030]` |
| `modal-backdrop` | 1040 | `z-[1040]` |
| `modal` | 1050 | `z-50` (convención shadcn) |
| `popover` | 1060 | `z-[1060]` |
| `tooltip` | 1070 | `z-[1070]` |

---

## 4. Bordes y radios

### 4.1 Border radius

| Token | Light (original) | Mockup 2 / shadcn | Tailwind |
|-------|------------------|-------------------|----------|
| `radius-sm` | 4px | calc(radius − 4px) | `rounded-sm` |
| `radius-md` | 8px | 8px (`0.5rem`) | `rounded-md` |
| `radius-lg` | 12px | +4px | `rounded-lg` |
| `radius-xl` | 16px | +8px | `rounded-xl` |
| `radius-full` | 9999px | pills | `rounded-full` |

**Por componente:**

| Componente | Radio | Tailwind |
|------------|-------|----------|
| Input, botón admin | 8px | `rounded-md` |
| Card admin | 12px | `rounded-xl` |
| Modal | 12–16px | `rounded-lg` |
| Badge estado | pill | `rounded-full` |
| Botón tótem destacado | 24px | `rounded-3xl` |
| Avatar / logo sidebar | 10px | `rounded-[10px]` |

### 4.2 Border width y color

| Uso | Light | Dark |
|-----|-------|------|
| Default | `border` + `border-black/10` | `border` + `dark:border-zinc-800` |
| Strong (mockup 2) | `border-slate-300` | `dark:border-zinc-700` |
| Focus | `ring-2 ring-[#5B8BBD]` | `ring-[3px] ring-zinc-600 dark:ring-ring/50` |
| Error | `border-red-600` | `border-destructive dark:aria-invalid:border-destructive` |

---

## 5. Sombras y elevación

| Token | Valor referencia (Light) | Tailwind |
|-------|--------------------------|----------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-xs` |
| `shadow-s` / card | `0 1px 3px rgba(0,0,0,0.1)` | `shadow-sm` |
| `shadow-m` | `0 4px 6px rgba(0,0,0,0.15)` | `shadow-md` |
| `shadow-l` / modal | `0 10px 15px rgba(0,0,0,0.25)` | `shadow-lg` |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.3)` | `shadow-xl` |
| `shadow-2xl` | `0 25px 50px rgba(0,0,0,0.4)` | `shadow-2xl` |

**Dark:** preferir bordes sobre sombras fuertes; modales: `dark:shadow-lg dark:shadow-black/40`. Cards: `dark:border dark:border-zinc-800` sin sombra o `dark:shadow-sm`.

---

## 6. Iconografía

| Aspecto | Especificación |
|---------|----------------|
| Librería | **Lucide React** (`lucide-react`) — usada en admin, guardia y tótem |
| Estilo | Trazo lineal, 1.5–2px, esquinas redondeadas |
| Tamaño admin | 16px (`size-4`), navegación 20px (`size-5`) |
| Tamaño tótem | 22–28px en CTAs principales |
| Accesibilidad | Icono + texto en badges y alertas críticas |

**Iconos de dominio recurrentes:** `Bike`, `Users`, `LayoutDashboard`, `Shield`, `Monitor`, `AlertTriangle`, `Ban`, `CheckCircle`, `Scan`, `KeyRound`, `Wifi`, `HelpCircle`.

Referencia de imports: [`AdminLayout.tsx`](../mockups/bicicletero-2/src/app/components/admin/AdminLayout.tsx), [`TotemApp.tsx`](../mockups/bicicletero-2/src/app/components/totem/TotemApp.tsx).

---

## 7. Componentes UI

Los patrones siguientes usan **solo clases Tailwind** con variantes `dark:` donde aplica. En producción, preferir los átomos de `@app/ui` alineados a estas clases.

### 7.1 Botón

| Variante | Light | Dark (`dark:`) |
|----------|-------|----------------|
| Primary | `bg-[#1E4C7C] text-white hover:bg-[#15365A]` | `dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200` |
| Secondary | `border border-black/10 bg-white hover:bg-[#F6F8FA]` | `dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700` |
| Destructive | `bg-[#C62828] text-white hover:bg-[#b71c1c]` | `dark:bg-red-900/60 dark:hover:bg-red-900` |
| Ghost | `hover:bg-[#EBF1F7] text-[#1B1B1B]` | `dark:hover:bg-zinc-800 dark:text-zinc-50` |
| Outline primary | `border-[#1E4C7C] text-[#1E4C7C] hover:bg-[#EBF1F7]` | `dark:border-zinc-600 dark:text-zinc-50` |
| Disabled | `opacity-50 pointer-events-none` | igual |
| Focus | `focus-visible:ring-2 focus-visible:ring-[#5B8BBD]` | `dark:focus-visible:ring-zinc-500` |

```tsx
<button
  type="button"
  className="inline-flex h-9 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium bg-[#1E4C7C] text-white transition-colors hover:bg-[#15365A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8BBD] disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-500"
>
  Guardar
</button>
```

**Botón tótem (touch ≥56px):**

```tsx
<button
  type="button"
  className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-cyan-600 px-6 text-2xl font-semibold text-white transition-colors hover:bg-cyan-500 focus-visible:ring-4 focus-visible:ring-cyan-400/50 active:scale-[0.98]"
>
  Confirmar ingreso
</button>
```

### 7.2 Input

```tsx
<input
  className="flex h-9 w-full rounded-md border border-black/10 bg-white px-3 py-1 text-base text-neutral-900 placeholder:text-neutral-400 transition-colors focus-visible:border-[#1E4C7C] focus-visible:ring-2 focus-visible:ring-[#5B8BBD] disabled:cursor-not-allowed disabled:bg-[#F6F8FA] disabled:opacity-50 aria-invalid:border-red-600 aria-invalid:ring-red-200 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-600 dark:disabled:bg-zinc-900"
  placeholder="Ingresa tu RUN"
/>
```

| Estado | Light | Dark |
|--------|-------|------|
| Default | `border-black/10 bg-white` | `dark:border-zinc-800 dark:bg-zinc-900/30` |
| Focus | `ring-[#5B8BBD]` | `dark:ring-zinc-600` |
| Error | `border-red-600 ring-red-200` | `dark:border-red-500` |
| Disabled | `bg-[#F6F8FA] opacity-50` | `dark:bg-zinc-900` |

### 7.3 Card

```tsx
<article className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
  <h3 className="text-base font-medium text-neutral-900 dark:text-zinc-50">Ocupación actual</h3>
  <p className="mt-2 text-sm text-neutral-500 dark:text-zinc-400">42 / 80 cupos en uso</p>
</article>
```

### 7.4 Badge de estado

```tsx
<span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
  {/* icono Lucide 12px */}
  Libre
</span>
```

### 7.5 Alerta inline

```tsx
<div
  role="alert"
  className="flex gap-3 rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950"
>
  <span className="text-green-700 dark:text-green-400">✓</span>
  <div>
    <p className="text-base font-medium text-green-800 dark:text-green-200">Éxito</p>
    <p className="text-sm text-green-700 dark:text-green-300">Ingreso registrado correctamente.</p>
  </div>
</div>
```

Variantes: sustituir `green` por `sky` (info), `amber` (warning), `red` (danger).

### 7.6 Modal / diálogo

Patrón alineado a shadcn (`dialog.tsx`):

```tsx
<div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70" />
<div className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-black/10 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
  <h2 className="text-lg font-semibold text-neutral-900 dark:text-zinc-50">Bloquear usuario</h2>
  <p className="mt-2 text-sm text-neutral-500 dark:text-zinc-400">El motivo quedará registrado en el historial.</p>
  <div className="mt-6 flex justify-end gap-2">
    <button className="rounded-md border border-black/10 px-4 py-2 text-sm hover:bg-[#F6F8FA] dark:border-zinc-700 dark:hover:bg-zinc-800">Cancelar</button>
    <button className="rounded-md bg-[#C62828] px-4 py-2 text-sm text-white hover:bg-[#b71c1c] dark:bg-red-900/60">Confirmar</button>
  </div>
</div>
```

### 7.7 Navbar / sidebar administrativo

```tsx
<aside className="flex w-60 shrink-0 flex-col bg-[#1e3a5f] text-slate-200 dark:bg-zinc-900">
  <div className="flex items-center gap-2.5 border-b border-[#16304f] px-5 py-4">
    <div className="flex size-9 items-center justify-center rounded-[10px] bg-cyan-600">
      {/* Bike icon */}
    </div>
    <div>
      <p className="text-sm font-bold text-white">Bicicletero</p>
      <p className="text-[0.7rem] text-slate-400">Sede Central</p>
    </div>
  </div>
  <a
    href="/admin/dashboard"
    className="mx-2 flex items-center gap-2.5 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white"
  >
    Dashboard
  </a>
  <a
    href="/admin/ciclistas"
    className="mx-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-[#16304f] dark:hover:bg-zinc-800"
  >
    Ciclistas
  </a>
</aside>
```

### 7.8 Tabla administrativa

```tsx
<div className="overflow-hidden rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-950">
  <table className="w-full text-sm">
    <thead className="border-b border-black/10 bg-[#F6F8FA] dark:border-zinc-800 dark:bg-zinc-900">
      <tr>
        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-zinc-400">RUN</th>
        <th className="px-4 py-3 text-left font-medium text-neutral-500 dark:text-zinc-400">Nombre</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-black/5 hover:bg-[#F6F8FA] dark:border-zinc-800/50 dark:hover:bg-zinc-900">
        <td className="px-4 py-3 font-mono text-neutral-900 dark:text-zinc-50">12.345.678-9</td>
        <td className="px-4 py-3 dark:text-zinc-50">María González</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 7.9 App shell tótem

```tsx
<div className="flex min-h-screen flex-col bg-[#0a1628] font-sans text-white">
  <header className="flex items-center justify-between border-b border-[#16304f] bg-[#0f2040] px-6 py-3.5">
    <div className="flex items-center gap-2.5">
      <span className="text-cyan-600">{/* Bike */}</span>
      <div>
        <p className="text-[0.9375rem] font-bold">Bicicletero Institucional</p>
        <p className="text-[0.7rem] text-slate-500">Sede Central</p>
      </div>
    </div>
    <span className="flex items-center gap-1 text-xs text-green-400">
      En línea
    </span>
  </header>
  <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
    {/* contenido */}
  </main>
  <footer className="flex justify-between border-t border-[#16304f] bg-[#0f2040] px-6 py-3 text-sm text-slate-600">
    Ayuda / Encargado
  </footer>
</div>
```

### 7.10 Cupo visual (celda)

```tsx
<span className="inline-flex size-6 items-center justify-center rounded border border-green-300 bg-green-100 text-[10px] font-semibold text-green-800 dark:border-green-700 dark:bg-green-950 dark:text-green-300">
  ○
</span>
```

---

## 8. Estados interactivos

| Estado | Comportamiento Tailwind común |
|--------|-------------------------------|
| Hover | `hover:bg-*` `hover:text-*` |
| Active / pressed | `active:scale-[0.98]` (tótem) |
| Focus | `focus-visible:ring-2` o `ring-[3px]` (shadcn) |
| Disabled | `disabled:opacity-50 disabled:pointer-events-none` |
| Loading | `opacity-70` + spinner `animate-spin` |
| Invalid | `aria-invalid:border-red-600` |

**Transiciones:** `transition-colors duration-150` (admin), `duration-200` (modales). Respetar `motion-reduce:transition-none`.

---

## 9. Convenciones del modo oscuro

### 9.1 Activación del tema

**Recomendado (control explícito):**

```html
<html lang="es" class="dark">
```

Alternar con script o `next-themes` (presente en mockup 2):

```tsx
// Ejemplo conceptual: toggle en header admin
document.documentElement.classList.toggle('dark');
```

**Respeto a preferencia del sistema (opcional):**

```html
<html lang="es" class="dark:scheme-dark">
```

Con Tailwind v4: `@custom-variant dark (&:is(.dark *));` como en [`theme.css`](../mockups/bicicletero-2/src/styles/theme.css).

### 9.2 Estructura de componentes dual-theme

1. Estilos base = **Tema Light** (colores del original).
2. Overrides = prefijo **`dark:`** en el mismo elemento.
3. No bifurcar componentes en dos archivos salvo shells muy distintos (ej. tótem siempre oscuro → clases fijas sin `dark:`).
4. Probar contraste AA: texto `dark:text-zinc-50` sobre `dark:bg-zinc-950`.

```tsx
<div className="bg-[#F6F8FA] text-neutral-900 dark:bg-zinc-950 dark:text-zinc-50">
  <div className="rounded-xl border border-black/10 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
    Contenido
  </div>
</div>
```

### 9.3 Qué tema usar por experiencia

| Experiencia | Tema por defecto | Notas |
|-------------|------------------|-------|
| Panel admin | Light, con toggle Dark | Sidebar puede usar tokens `sidebar-*` en ambos modos |
| Vista guardia | Light / Dark según preferencia | Badges con variantes `dark:` |
| Tótem touch | **Siempre oscuro** (shell `#0a1628`) | No depende del toggle global; alto contraste fijo |

### 9.4 Excepciones justificadas a “solo Tailwind”

| Caso | Justificación |
|------|----------------|
| Fuente Inter / JetBrains Mono | `@import` en build o `<link>` Google Fonts — no es estilo de componente |
| Variables `@theme` en config Tailwind v4 | Mapeo único de tokens shadcn → utilidades `bg-background`, etc. |
| Animaciones `data-[state=open]` de Radix | Generadas por plugin `tailwindcss-animate` / `tw-animate-css` |

Todo lo demás (colores, espaciado, layout, estados) → **clases utilitarias**.

---

## 10. Accesibilidad (resumen)

| Regla | Especificación |
|-------|----------------|
| Contraste | WCAG 2.2 AA mínimo |
| Focus | Anillo visible en todos los controles (`focus-visible:ring-*`) |
| Touch panel | Mínimo 44×44px → `min-h-11 min-w-11` |
| Touch tótem | Mínimo 56×56px → `min-h-14 min-w-14` |
| Estados | No depender solo del color; icono + texto en badges |
| RUN público | Ocultar parcialmente; `font-mono` para dígitos |

---

## 11. Referencias de archivos

| Recurso | Ruta relativa desde `DOCS/` |
|---------|------------------------------|
| Guía original (Light) | [`../mockups/bicicletero-original/GUIA_DISENO.md`](../mockups/bicicletero-original/GUIA_DISENO.md) |
| Tema shadcn exportado | [`../mockups/bicicletero-2/default_shadcn_theme.css`](../mockups/bicicletero-2/default_shadcn_theme.css) |
| Tema institucional + dark | [`../mockups/bicicletero-2/src/styles/theme.css`](../mockups/bicicletero-2/src/styles/theme.css) |
| Especificación producto | [`../mockups/bicicletero-2/src/imports/pasted_text/bicicletero-design-system.md`](../mockups/bicicletero-2/src/imports/pasted_text/bicicletero-design-system.md) |
| Componentes UI mockup | [`../mockups/bicicletero-2/src/app/components/ui/`](../mockups/bicicletero-2/src/app/components/ui/) |
| Badges de dominio | [`../mockups/bicicletero-2/src/app/components/shared/StatusBadge.tsx`](../mockups/bicicletero-2/src/app/components/shared/StatusBadge.tsx) |

---

## 12. Checklist de implementación

- [ ] Configurar `darkMode: 'class'` (o variante `@custom-variant` en Tailwind v4).
- [ ] Cargar fuentes Inter y JetBrains Mono.
- [ ] Usar átomos de `@app/ui` con clases alineadas a esta guía.
- [ ] Light: primario `#1E4C7C`, fondo `#F6F8FA`, superficie blanca.
- [ ] Dark: superficies zinc-950/800, texto zinc-50/400.
- [ ] Tótem: shell con `bg-[#0a1628]` sin depender del toggle.
- [ ] Evitar `style={{}}` y CSS suelto en features (los mockups Figma aún los contienen como referencia visual, no como patrón de producción).

---

*Documento generado a partir del análisis de `mockups/bicicletero-original` y `mockups/bicicletero-2`. Para cambios de tokens, actualizar primero los mockups y luego esta guía.*
