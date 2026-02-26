import React from 'react';
import { User as UserIcon, Mail, Phone, Shield } from 'lucide-react';
import { User } from '../types';

interface UsersProps {
  users: User[];
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  CASHIER: 'Cajero/a',
  REPOSITOR: 'Repositor/a',
};

export const Users: React.FC<UsersProps> = ({ users }) => {
  return (
    <div className="p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="text-blue-600" size={32} />
        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <UserIcon size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800">{user.fullName}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{user.username}</p>
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                  <Shield size={12} />
                  {ROLE_LABELS[user.role] ?? user.role}
                </span>
                {user.email && (
                  <p className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                    <Mail size={12} />
                    {user.email}
                  </p>
                )}
                {user.phone && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                    <Phone size={12} />
                    {user.phone}
                  </p>
                )}
                <p className="mt-2">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      user.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
