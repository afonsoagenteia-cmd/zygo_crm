import { useAuth } from '../context/AuthContext';
import { LogOut, User, Settings } from 'lucide-react';

export default function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth();

  if (!user) return null;

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#063C20]/50 font-medium mb-2">Conta</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#063C20] tracking-tight">
          O Meu Perfil
        </h2>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-[#063C20]/8 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-[#063C20] to-[#0B5C33] relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 bg-[#C0D637] rounded-2xl flex items-center justify-center text-5xl border-4 border-white shadow-xl">
              {getRoleIcon(user.role)}
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="pt-16 pb-6 px-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-[#063C20]">{user.full_name}</h3>
              <p className="text-sm text-[#063C20]/60 mt-1">{user.email}</p>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${getRoleBadgeColor(user.role)}`}>
              {user.role}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-[#063C20]/8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#063C20]/40 font-semibold mb-1">ID</p>
                <p className="text-xs text-[#063C20]/60 font-mono truncate">{user.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#063C20]/40 font-semibold mb-1">Membro desde</p>
                <p className="text-xs text-[#063C20]/60">
                  {new Date(user.created_at).toLocaleDateString('pt-PT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-[#063C20]/8 p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-[#063C20] flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Ações
        </h3>

        <div className="space-y-3">
          <button
            onClick={() => alert('Funcionalidade de edição de perfil em desenvolvimento')}
            className="w-full text-left px-4 py-3 bg-[#063C20]/5 hover:bg-[#063C20]/10 rounded-xl flex items-center gap-3 transition-colors"
          >
            <User className="w-5 h-5 text-[#063C20]" />
            <div>
              <p className="text-sm font-semibold text-[#063C20]">Editar Perfil</p>
              <p className="text-xs text-[#063C20]/50">Atualizar nome e informações</p>
            </div>
          </button>

          <button
            onClick={() => alert('Funcionalidade de alteração de password em desenvolvimento')}
            className="w-full text-left px-4 py-3 bg-[#063C20]/5 hover:bg-[#063C20]/10 rounded-xl flex items-center gap-3 transition-colors"
          >
            <Settings className="w-5 h-5 text-[#063C20]" />
            <div>
              <p className="text-sm font-semibold text-[#063C20]">Alterar Password</p>
              <p className="text-xs text-[#063C20]/50">Atualizar a sua palavra-passe</p>
            </div>
          </button>

          <button
            onClick={signOut}
            className="w-full text-left px-4 py-3 bg-red-50 hover:bg-red-100 rounded-xl flex items-center gap-3 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-800">Terminar Sessão</p>
              <p className="text-xs text-red-600/60">Sair da sua conta</p>
            </div>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#C0D637]/10 border border-[#C0D637]/30 rounded-xl p-4">
        <p className="text-xs text-[#063C20]/70">
          <strong>Nota:</strong> Para funcionalidades avançadas de gestão de conta, 
          aceda ao dashboard do Supabase após configurar a base de dados.
        </p>
      </div>
    </div>
  );
}
