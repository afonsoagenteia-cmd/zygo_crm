import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, User } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import { Users, Plus, Edit2, Trash2, Mail, Shield, X, UserPlus } from 'lucide-react';

export default function UsersManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<User['role']>('Content Specialist');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      if (isSupabaseConfigured()) {
        const data = await authService.getAllUsers();
        setUsers(data);
      } else {
        // Demo data
        setUsers([
          {
            id: '1',
            email: 'cmo@zygo.pt',
            full_name: 'Maria Silva',
            role: 'CMO',
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            email: 'content@zygo.pt',
            full_name: 'João Santos',
            role: 'Content Specialist',
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            email: 'success@zygo.pt',
            full_name: 'Ana Costa',
            role: 'Customer Success',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSupabaseConfigured()) {
        // Create user with Supabase Auth
        const tempPassword = password || 'TempPass123!';
        await authService.signUp(email, tempPassword, fullName, role);
        await loadUsers();
      } else {
        // Demo mode
        const newUser: User = {
          id: Date.now().toString(),
          email,
          full_name: fullName,
          role,
          created_at: new Date().toISOString(),
        };
        setUsers([newUser, ...users]);
      }

      setShowAddModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar utilizador');
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setError('');

    try {
      if (isSupabaseConfigured()) {
        await authService.updateProfile(editingUser.id, { full_name: fullName, role });
        await loadUsers();
      } else {
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, full_name: fullName, role }
            : u
        ));
      }

      setEditingUser(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar utilizador');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja remover este utilizador?')) return;

    try {
      if (isSupabaseConfigured()) {
        // Note: Supabase doesn't allow deleting users from client
        // This would need to be done from Supabase dashboard or Edge Function
        alert('Para remover utilizadores, aceda ao dashboard do Supabase > Authentication > Users');
      } else {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('Content Specialist');
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFullName(user.full_name);
    setRole(user.role);
    setEmail(user.email);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CMO': return 'bg-[#C0D637] text-[#063C20]';
      case 'Customer Success': return 'bg-blue-100 text-blue-800';
      default: return 'bg-[#063C20]/10 text-[#063C20]';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'CMO': return '👑';
      case 'Customer Success': return '🤝';
      default: return '✍️';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#063C20]/20 border-t-[#C0D637] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Administração</p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8" />
            Utilizadores
          </h2>
          <p className="text-[#063C20]/60 text-sm mt-2">{users.length} utilizadores registados</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#C0D637] text-[#063C20] rounded-xl font-semibold hover:bg-[#C0D637]/90 shadow-lg shadow-[#C0D637]/20 flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" />
          Novo Utilizador
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => (
          <div
            key={user.id}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#063C20]/8 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#063C20]/5 rounded-xl flex items-center justify-center text-2xl">
                  {getRoleIcon(user.role)}
                </div>
                <div>
                  <h3 className="font-semibold text-[#063C20]">{user.full_name}</h3>
                  <p className="text-xs text-[#063C20]/50 flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {user.email}
                  </p>
                </div>
              </div>
              {currentUser?.id === user.id && (
                <span className="text-[10px] bg-[#C0D637]/20 text-[#063C20] px-2 py-0.5 rounded-full font-semibold">
                  Você
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#063C20]/5">
              <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${getRoleBadgeColor(user.role)}`}>
                <Shield className="w-3 h-3 inline mr-1" />
                {user.role}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => openEditModal(user)}
                  className="p-2 text-[#063C20]/40 hover:text-[#063C20] hover:bg-[#C0D637]/20 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-[#063C20]/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[#063C20]/40 mt-3">
              Criado em {new Date(user.created_at).toLocaleDateString('pt-PT')}
            </p>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[#063C20] flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Novo Utilizador
              </h3>
              <button
                onClick={() => { setShowAddModal(false); resetForm(); setError(''); }}
                className="p-2 hover:bg-[#063C20]/5 rounded-lg"
              >
                <X className="w-5 h-5 text-[#063C20]/50" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none"
                  placeholder="Ex: João Silva"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none"
                  placeholder="joao@zygo.pt"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Função
                </label>
                <select
                  required
                  value={role}
                  onChange={e => setRole(e.target.value as User['role'])}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none bg-white"
                >
                  <option value="Content Specialist">Content Specialist</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="CMO">CMO</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); setError(''); }}
                  className="flex-1 px-4 py-2.5 bg-[#063C20]/5 text-[#063C20] rounded-xl font-medium hover:bg-[#063C20]/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#C0D637] text-[#063C20] rounded-xl font-semibold hover:bg-[#C0D637]/90 shadow-lg shadow-[#C0D637]/20"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[#063C20] flex items-center gap-2">
                <Edit2 className="w-5 h-5" />
                Editar Utilizador
              </h3>
              <button
                onClick={() => { setEditingUser(null); resetForm(); setError(''); }}
                className="p-2 hover:bg-[#063C20]/5 rounded-lg"
              >
                <X className="w-5 h-5 text-[#063C20]/50" />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Email (não editável)
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm bg-gray-50 text-[#063C20]/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block">
                  Função
                </label>
                <select
                  required
                  value={role}
                  onChange={e => setRole(e.target.value as User['role'])}
                  className="w-full px-4 py-2.5 border border-[#063C20]/15 rounded-xl text-sm focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none bg-white"
                >
                  <option value="Content Specialist">Content Specialist</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="CMO">CMO</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setEditingUser(null); resetForm(); setError(''); }}
                  className="flex-1 px-4 py-2.5 bg-[#063C20]/5 text-[#063C20] rounded-xl font-medium hover:bg-[#063C20]/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#C0D637] text-[#063C20] rounded-xl font-semibold hover:bg-[#C0D637]/90 shadow-lg shadow-[#C0D637]/20"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
