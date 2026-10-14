import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'Content Specialist' | 'Customer Success' | 'CMO'>('Content Specialist');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setSuccess('Email de recuperação enviado! Verifique a sua caixa de entrada.');
        setTimeout(() => setIsResetPassword(false), 3000);
      } else if (isSignUp) {
        await signUp(email, password, fullName, role);
        setSuccess('Conta criada com sucesso! Bem-vindo ao ZYGO.');
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-[#063C20]/15 rounded-xl text-sm text-[#063C20] placeholder:text-[#063C20]/30 focus:border-[#063C20] focus:ring-2 focus:ring-[#C0D637]/30 outline-none transition-all";
  const labelClass = "text-xs font-semibold text-[#063C20]/70 uppercase tracking-wider mb-2 block";

  return (
    <div className="min-h-screen bg-[#063C20] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#C0D637] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#C0D637]/20">
            <span className="font-display font-black text-[#063C20] text-3xl tracking-tighter">Z</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white tracking-tight">ZYGO</h1>
          <p className="text-white/60 text-sm mt-2">Sistema de Gestão de Leads</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <h2 className="font-display text-2xl font-bold text-[#063C20] mb-6">
            {isResetPassword ? 'Recuperar Password' : isSignUp ? 'Criar Conta' : 'Iniciar Sessão'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className={labelClass}>Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className={labelClass}>Função</label>
                  <select
                    required
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className={inputClass + " bg-white"}
                  >
                    <option value="Content Specialist">Content Specialist</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="CMO">CMO</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
                placeholder="seu@email.com"
              />
            </div>

            {!isResetPassword && (
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={inputClass + " pr-12"}
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#063C20]/40 hover:text-[#063C20]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#C0D637] text-[#063C20] rounded-xl font-semibold hover:bg-[#C0D637]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#C0D637]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#063C20]/20 border-t-[#063C20] rounded-full animate-spin" />
              ) : isResetPassword ? (
                'Enviar Email'
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center">
            {!isResetPassword && !isSignUp && (
              <button
                onClick={() => setIsResetPassword(true)}
                className="text-xs text-[#063C20]/60 hover:text-[#063C20] underline"
              >
                Esqueci a minha password
              </button>
            )}

            <div className="pt-4 border-t border-[#063C20]/10">
              {isResetPassword ? (
                <button
                  onClick={() => { setIsResetPassword(false); setError(''); setSuccess(''); }}
                  className="text-sm text-[#063C20] hover:underline font-medium"
                >
                  ← Voltar ao login
                </button>
              ) : isSignUp ? (
                <p className="text-sm text-[#063C20]/60">
                  Já tem conta?{' '}
                  <button
                    onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }}
                    className="text-[#063C20] hover:underline font-semibold"
                  >
                    Iniciar sessão
                  </button>
                </p>
              ) : (
                <p className="text-sm text-[#063C20]/60">
                  Não tem conta?{' '}
                  <button
                    onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }}
                    className="text-[#063C20] hover:underline font-semibold"
                  >
                    Criar conta
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Demo Mode Notice */}
        {!isSupabaseConfigured() && (
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-center">
            <p className="text-xs text-white/80">
              <strong>Modo Demo:</strong> O sistema está a funcionar sem base de dados.
              <br />
              Configure o Supabase para autenticação real.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
