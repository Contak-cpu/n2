export const FEATURE_SETTINGS_STORAGE_KEY = 'erp_feature_settings';

export interface FeatureSettings {
  promocionesPOS: boolean;
  escanerPOS: boolean;
  moduloEgresos: boolean;
  moduloProveedores: boolean;
  moduloRepositor: boolean;
  moduloPromociones: boolean;
  moduloAuditoria: boolean;
  moduloCajas: boolean;
  moduloReportes: boolean;
}

const defaults: FeatureSettings = {
  promocionesPOS: true,
  escanerPOS: true,
  moduloEgresos: true,
  moduloProveedores: true,
  moduloRepositor: true,
  moduloPromociones: true,
  moduloAuditoria: true,
  moduloCajas: true,
  moduloReportes: true,
};

export function getFeatureSettings(): FeatureSettings {
  try {
    const saved = localStorage.getItem(FEATURE_SETTINGS_STORAGE_KEY);
    if (!saved) return { ...defaults };
    return { ...defaults, ...JSON.parse(saved) };
  } catch {
    return { ...defaults };
  }
}
