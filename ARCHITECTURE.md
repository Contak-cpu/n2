# Arquitectura - Nueva Era ERP

## Visión general

El frontend es una SPA React (Vite + TypeScript) que hoy persiste datos en **localStorage** a través de una capa de **servicios**. Esa capa está preparada para que, en el futuro, se sustituya por llamadas a un backend/API sin cambiar la UI ni el store.

## Capa de servicios

- **Ubicación:** `services/`
- **Responsabilidad:** Toda lectura/escritura de datos pasa por servicios. Las firmas de las funciones son las que se usarán cuando exista API/DB (hoy la implementación es mock con localStorage).

### Adapter de persistencia

- **`services/storageAdapter.ts`:** Define la interfaz `IStorageAdapter` (`getItem`, `setItem`, `removeItem`) y la implementación por defecto `localStorageAdapter`. Para integrar backend, se puede registrar un `apiAdapter` que haga `fetch` y reemplazar con `setStorageAdapter(apiAdapter)`.
- **`services/storageKeys.ts`:** Centraliza todas las claves de almacenamiento (`erp_*`). Evita typos y facilita cambiar prefijo o origen de datos.

### Servicios por dominio

| Servicio | Funciones principales |
|----------|------------------------|
| `authService` | `getCurrentUser()`, `login()`, `logout()` |
| `productsService` | `getProducts()`, `getProductById()`, `addProduct()`, `updateProduct()`, `updateStock()` |
| `transactionsService` | `getTransactions()`, `getTransactionsByBranch()`, `addTransaction()` |
| `checkoutLinesService` | `getCheckoutLines()`, `getCheckoutLinesWithStats()`, `getCheckoutLinesByBranch()`, `openCheckoutLine()`, `closeCheckoutLine()`, `updateCheckoutLine()` |
| `preferencesService` | `getSelectedBranchId()`, `setSelectedBranchId()` |
| `suppliersService` | `getSuppliers()`, `addSupplier()`, `removeSupplier()` |
| `clientsService` | `getClients()`, `addClient()` |
| `promotionsService` | `getPromotions()`, `getActivePromotions()`, `addPromotion()`, `updatePromotion()` |
| `egresosService` | `getEgresos()`, `addEgreso()`, `removeEgreso()` |
| `restockingService` | `getRestocking()`, `addRestocking()` |
| `auditService` | `getAuditLogs()`, `addAuditLog()` |
| `usersService` | `getUsers()`, `addUser()`, `updateUser()`, `removeUser()` |
| `despachosService` | `getDespachos()`, `addDespacho()`, `updateDespacho()` |

Los datos iniciales y los mocks (transacciones, reposiciones, egresos) viven en `constants.ts` y `utils/mockData.ts`; los servicios los usan cuando el storage está vacío.

### Cómo agregar un nuevo recurso

1. Definir tipos en `types.ts` si aplica.
2. Añadir clave en `services/storageKeys.ts`.
3. Crear `services/miRecursoService.ts` con `get*`, `add*`, `update*`, `remove*` que lean/escriban vía `getJson`/`setJson` (o el adapter).
4. En `hooks/useStore.ts`, mantener estado en memoria para ese recurso, inicializar desde el servicio y en cada mutación llamar al servicio y actualizar estado con el resultado.
5. Exportar desde `services/index.ts`.

### Integración futura con API/DB

- Opción A: Implementar un `apiAdapter` que, para cada clave, haga `fetch` al backend y reemplazar el adapter con `setStorageAdapter(apiAdapter)` al arranque (por ejemplo si `VITE_USE_API=true`).
- Opción B: Sustituir la implementación de cada servicio por llamadas async al backend; el store pasaría a usar `async/await` o React Query sobre esos servicios.

## Store (`hooks/useStore.ts`)

- Mantiene estado en memoria (productos, transacciones, usuario actual, etc.) para re-renders.
- **No** escribe ni lee localStorage directamente; solo llama a los servicios.
- Inicializa cada slice desde el servicio correspondiente; en cada acción llama al servicio y actualiza el estado con el valor devuelto.
- Las acciones están envueltas en `useCallback` para estabilidad de referencias.

## Rutas (React Router)

- **Configuración:** `routes.tsx` define `pathToTab`, `tabToPath`, `canAccessTab` y `DEFAULT_TAB_BY_ROLE`.
- **Rutas:** `/` (inicio), `/pos`, `/inventory`, `/finance`, `/egresos`, `/suppliers`, `/promotions`, `/reports`, `/cajas`, `/distribucion`, `/repositor`, `/audit`, `/users`, `/settings`.
- **Protección:** En `App.tsx`, si la ruta actual no está permitida para el rol del usuario (`canAccessTab`), se redirige al tab por defecto del rol.
- **Layout:** Recibe `activeTab` derivado de `location.pathname` y `onTabChange` que hace `navigate(tabToPath(tab))`.

## Permisos y features

- **Roles:** ADMIN, SUPERVISOR, CASHIER, REPOSITOR. La lógica de qué pestaña puede ver cada uno está en `routes.tsx` y en el render condicional de `App.tsx`.
- **Feature flags:** `utils/featureSettings.ts` lee de localStorage (`erp_feature_settings`) y controla visibilidad de módulos (Cajas, Egresos, Reportes, etc.) en el menú.

## Estilos

- Tailwind CSS v4 se integra vía PostCSS (`@tailwindcss/postcss`). El CSS de la app está en `index.css` (con `@import "tailwindcss"` y estilos custom). Las clases se purgan en build.
