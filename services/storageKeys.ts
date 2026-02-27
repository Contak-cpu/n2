/**
 * Claves de persistencia centralizadas.
 * Usadas por el storageAdapter y los servicios. Facilita cambiar prefijo o backend.
 */
export const STORAGE_KEYS = {
  CURRENT_USER: 'erp_current_user',
  PRODUCTS: 'erp_products',
  TRANSACTIONS: 'erp_transactions',
  SUPPLIERS: 'erp_suppliers',
  CLIENTS: 'erp_clients',
  CHECKOUT_LINES: 'erp_checkout_lines',
  SELECTED_BRANCH: 'erp_selected_branch',
  DESPACHOS: 'erp_despachos',
  PROMOTIONS: 'erp_promotions',
  EGRESOS: 'erp_egresos',
  RESTOCKING: 'erp_restocking',
  AUDIT_LOGS: 'erp_audit_logs',
  USERS: 'erp_users',
  VENTAS_CALLE: 'erp_ventas_calle',
  REMITOS: 'erp_remitos',
  ORDENES_RETIRO: 'erp_ordenes_retiro',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
