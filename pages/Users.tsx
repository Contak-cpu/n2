import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { User, UserRole } from '../types';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface UsersProps {
  users: User[];
  onAdd: (user: User) => void;
  onUpdate: (id: string, updates: Partial<User>) => void;
  onRemove: (id: string) => void;
  currentUserId?: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  SUPERVISOR: 'Supervisor',
  CASHIER: 'Cajero/a',
  REPOSITOR: 'Repositor/a',
};

const ROLES: UserRole[] = ['ADMIN', 'SUPERVISOR', 'CASHIER', 'REPOSITOR'];

const emptyForm = (): Partial<User> => ({
  username: '',
  password: '',
  fullName: '',
  role: 'CASHIER',
  email: '',
  phone: '',
  active: true,
});

export const Users: React.FC<UsersProps> = ({ users, onAdd, onUpdate, onRemove, currentUserId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<Partial<User>>(emptyForm());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: '',
      fullName: user.fullName,
      role: user.role,
      email: user.email ?? '',
      phone: user.phone ?? '',
      active: user.active,
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username?.trim() || !form.fullName?.trim()) return;

    if (editingUser) {
      const updates: Partial<User> = {
        fullName: form.fullName.trim(),
        role: form.role!,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        active: form.active ?? true,
      };
      if (form.password?.trim()) updates.password = form.password.trim();
      onUpdate(editingUser.id, updates);
    } else {
      if (!form.password?.trim()) {
        alert('La contraseña es obligatoria para nuevo usuario');
        return;
      }
      onAdd({
        id: Date.now().toString(),
        username: form.username.trim(),
        password: form.password.trim(),
        fullName: form.fullName.trim(),
        role: form.role!,
        email: form.email?.trim() || undefined,
        phone: form.phone?.trim() || undefined,
        active: form.active ?? true,
      });
    }
    setModalOpen(false);
  };

  const handleRemove = (id: string) => {
    if (id === currentUserId) {
      alert('No podés eliminar el usuario con el que estás logueado.');
      return;
    }
    onRemove(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="p-6 flex flex-col h-full bg-gray-50 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserIcon className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus size={20} />
          Nuevo usuario
        </button>
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
                  {ROLE_LABELS[user.role]}
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
            <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => openEdit(user)}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
              >
                <Edit2 size={14} />
                Editar
              </button>
              <button
                onClick={() => setDeleteConfirm(user.id)}
                disabled={user.id === currentUserId}
                className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} />
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Editar usuario' : 'Nuevo usuario'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              form="users-form"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {editingUser ? 'Guardar' : 'Crear'}
            </button>
          </div>
        }
      >
        <form id="users-form" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (login) *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.username || ''}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Ej: caja1"
              disabled={!!editingUser}
            />
            {editingUser && <p className="text-xs text-gray-500 mt-0.5">El usuario no se puede cambiar</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{editingUser ? 'Nueva contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.password || ''}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.fullName || ''}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Ej: María González"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={form.role || 'CASHIER'}
              onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))}
            >
              {ROLES.map(r => (
                <option key={r} value={r}>{ROLE_LABELS[r]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.email || ''}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="usuario@nuevaera.com.ar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={form.phone || ''}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="11-0000-0000"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={form.active ?? true}
              onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">Usuario activo</label>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteConfirm && handleRemove(deleteConfirm)}
        title="Eliminar usuario"
        message="¿Estás seguro de que querés eliminar este usuario? No se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
      />
    </div>
  );
};
