# Nueva Era ERP - Sistema de Gestión para Supermercados

Sistema de gestión integral para supermercados: POS multi-caja, inventario (depósito/góndola), reposición con escaneo, reportes, promociones y finanzas.

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

## Credenciales de demo

- **Admin:** `admin` / `123`
- **Supervisor:** `supervisor` / `123`
- **Cajeros:** `caja1`–`caja4` / `123`
- **Repositores:** `repo1`, `repo2` / `123`
