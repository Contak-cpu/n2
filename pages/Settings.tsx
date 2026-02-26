import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { getFeatureSettings, FEATURE_SETTINGS_STORAGE_KEY, type FeatureSettings } from '../utils/featureSettings';

const FEATURE_LABELS: Record<keyof FeatureSettings, { label: string; description: string }> = {
  promocionesPOS: { label: 'Promociones en POS', description: 'Aplicar descuentos y promociones al cobrar' },
  escanerPOS: { label: 'Escáner de código en POS', description: 'Botón y modal para escanear códigos de barras' },
  moduloEgresos: { label: 'Módulo Egresos', description: 'Registro de gastos y salidas de dinero' },
  moduloProveedores: { label: 'Módulo Proveedores', description: 'Gestión de proveedores' },
  moduloRepositor: { label: 'Módulo Repositor', description: 'Reposición depósito → góndola con escaneo' },
  moduloPromociones: { label: 'Módulo Promociones', description: 'Crear y editar promociones' },
  moduloAuditoria: { label: 'Módulo Auditoría', description: 'Registro de auditoría y eventos manuales' },
  moduloCajas: { label: 'Módulo Cajas', description: 'Vista y apertura/cierre de líneas de caja' },
  moduloReportes: { label: 'Módulo Reportes', description: 'Reportes y gráficos de ventas' },
  moduloDistribucion: { label: 'Módulo Distribución', description: 'Trazabilidad de despachos mayoristas (qué se vendió, a dónde, quién lleva)' },
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<FeatureSettings>(() => getFeatureSettings());

  useEffect(() => {
    localStorage.setItem(FEATURE_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggle = (key: keyof FeatureSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-blue-600 flex-shrink-0" size={28} />
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Configuración</h1>
          <p className="text-sm text-gray-500">Habilitar o deshabilitar funciones del sistema</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Funcionalidades</h2>
            <p className="text-xs text-gray-500 mt-0.5">Activa o desactiva módulos y opciones (solo afecta la visibilidad en el menú y el comportamiento en POS).</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {(Object.keys(FEATURE_LABELS) as (keyof FeatureSettings)[]).map(key => (
              <li key={key} className="flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{FEATURE_LABELS[key].label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{FEATURE_LABELS[key].description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex-shrink-0 p-2 rounded-lg transition-colors touch-target"
                  title={settings[key] ? 'Deshabilitar' : 'Habilitar'}
                >
                  {settings[key] ? (
                    <ToggleRight size={36} className="text-green-600 sm:w-10 sm:h-10" />
                  ) : (
                    <ToggleLeft size={36} className="text-gray-300 sm:w-10 sm:h-10" />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <p className="px-5 py-3 text-xs text-gray-500 border-t border-gray-100 bg-gray-50/50">
            Los cambios se guardan automáticamente. Reiniciar la sesión o recargar puede ser necesario para aplicar en menú.
          </p>
        </div>
      </div>
    </div>
  );
};
