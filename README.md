# Nueva Era ERP - Sistema de Gestión para Supermercados

Sistema de gestión integral para supermercados: POS multi-caja, inventario (depósito/góndola), reposición con escaneo, reportes, promociones y finanzas.

Los datos se persisten hoy en **localStorage** a través de una capa de **servicios** (`services/`). Esa capa está preparada para sustituirse por un backend/API sin cambiar la UI. Ver [ARCHITECTURE.md](ARCHITECTURE.md) para detalles.

## Ejecutar en local

**Requisitos:** Node.js 18+

1. **Entrar en la carpeta del proyecto** (donde está `package.json`). Si clonaste o descomprimiste el repo, la ruta es la carpeta **interna** donde está `package.json`, por ejemplo:
   ```bash
   cd nuevaera-main/nuevaera-main
   ```
   O desde la ruta completa (Windows):
   ```bash
   cd C:\Users\pictoN\Downloads\nuevaera-main\nuevaera-main
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Levantar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador la URL que indique Vite (por defecto `http://localhost:3000`).

**Importante:** Ejecutá `npm run dev` siempre desde la carpeta que contiene `package.json`. Si lo ejecutás desde la raíz del workspace (donde no hay `package.json`), npm podría usar otro proyecto y verías una app distinta.

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
```

Tests unitarios de la capa de servicios (Vitest) en `services/__tests__/`. Ejecutan con un adapter de storage mock para no usar localStorage.

## Desplegar en Vercel (automático)

1. Subí el código a GitHub (este repo: `Contak-cpu/n2`, rama `main`).
2. En [vercel.com](https://vercel.com) → **Add New** → **Project** → importá el repo de GitHub.
3. Si el repo tiene la app en un subdirectorio (por ejemplo `nuevaera-main`), en **Root Directory** poné ese directorio; si `package.json` está en la raíz del repo, dejalo vacío.
4. Build Command: `npm run build`, Output Directory: `dist` (Vercel suele detectarlos si elegís preset **Vite**).
5. **Deploy**. Cada push a `main` hará un nuevo despliegue automático.

## Credenciales de demo

- **Admin:** `admin` / `123`
- **Supervisor:** `supervisor` / `123`
- **Cajeros:** `caja1`–`caja4` / `123`
- **Repositores:** `repo1`, `repo2` / `123`
- **Vendedores:** `vendedor1` … `vendedor9` / `123` (admin puede activar/desactivar y definir días de trabajo)
