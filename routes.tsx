import type { UserRole } from './types';

/** Mapeo path -> tab id (para Layout y permisos). */
export function pathToTab(pathname: string): string {
  const p = pathname.replace(/^\/+/, '') || 'inicio';
  return p === '' ? 'inicio' : p;
}

/** Mapeo tab id -> path (para navegación). */
export function tabToPath(tab: string): string {
  return tab === 'inicio' ? '/' : `/${tab}`;
}

export const DEFAULT_TAB_BY_ROLE: Record<UserRole, string> = {
  ADMIN: 'inicio',
  SUPERVISOR: 'inicio',
  CASHIER: 'inicio',
  REPOSITOR: 'inicio',
  VENDEDOR_CALLE: 'vendedor-calle',
};

const ADMIN_ONLY_TABS = ['finance', 'egresos', 'suppliers', 'promotions', 'audit', 'users', 'settings'];
const SUPERVISOR_ALLOWED_TABS = ['inicio', 'pos', 'inventory', 'reports', 'cajas', 'distribucion'];
const CASHIER_ALLOWED_TABS = ['inicio', 'pos'];
const REPOSITOR_ALLOWED_TABS = ['inicio', 'repositor'];
const VENDEDOR_CALLE_ALLOWED_TABS = ['inicio', 'vendedor-calle'];

/** Indica si el rol puede acceder a la pestaña/ruta. */
export function canAccessTab(tab: string, role: UserRole): boolean {
  if (tab === 'inicio') return true;
  if (role === 'ADMIN') return true;
  if (role === 'SUPERVISOR' && SUPERVISOR_ALLOWED_TABS.includes(tab)) return true;
  if (role === 'CASHIER' && CASHIER_ALLOWED_TABS.includes(tab)) return true;
  if (role === 'REPOSITOR' && (REPOSITOR_ALLOWED_TABS.includes(tab) || tab === 'repositor')) return true;
  if (role === 'VENDEDOR_CALLE' && VENDEDOR_CALLE_ALLOWED_TABS.includes(tab)) return true;
  return false;
}

/** Pestañas que solo ve Admin (para menú). */
export function isAdminOnlyTab(tab: string): boolean {
  return ADMIN_ONLY_TABS.includes(tab);
}
