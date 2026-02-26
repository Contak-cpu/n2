import React, { useState, useMemo } from 'react';
import { FileText, Search } from 'lucide-react';
import { AuditLog as AuditLogType } from '../types';

interface AuditLogProps {
  auditLogs: AuditLogType[];
  users: { id: string; fullName: string }[];
}

export const AuditLog: React.FC<AuditLogProps> = ({ auditLogs, users }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return auditLogs;
    return auditLogs.filter(
      log =>
        log.action.toLowerCase().includes(q) ||
        log.entityType.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q) ||
        users.find(u => u.id === log.userId)?.fullName?.toLowerCase().includes(q)
    );
  }, [auditLogs, search, users]);

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.fullName ?? userId;

  return (
    <div className="p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Registro de Auditoría</h1>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por acción, entidad o usuario..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 min-h-0">
        <div className="overflow-auto h-full">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha / Hora</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Acción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Entidad</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No hay registros de auditoría
                  </td>
                </tr>
              ) : (
                filtered.map(log => {
                  const ts = typeof log.timestamp === 'string' ? new Date(log.timestamp) : log.timestamp;
                  return (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">
                        {(ts instanceof Date ? ts : new Date(ts as any)).toLocaleString('es-AR')}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{getUserName(log.userId)}</td>
                      <td className="py-3 px-4 text-gray-700">{log.action}</td>
                      <td className="py-3 px-4 text-gray-600">{log.entityType}</td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-xs">{log.entityId}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
