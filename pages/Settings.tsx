import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const STORAGE_KEY = 'erp_settings';

interface AppSettings {
  companyName: string;
  address: string;
  phone: string;
}

const defaultSettings: AppSettings = {
  companyName: 'Nueva Era Supermercado',
  address: 'Av. Corrientes 1234',
  phone: '+54 11 1234-5678',
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const update = (key: keyof AppSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Configuración</h1>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Datos del Comercio</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del comercio</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.companyName}
                onChange={e => update('companyName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.address}
                onChange={e => update('address', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.phone}
                onChange={e => update('phone', e.target.value)}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Los cambios se guardan automáticamente en este dispositivo.</p>
        </div>
      </div>
    </div>
  );
};
