import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, User } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: User['role']) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'full_name' | 'role' | 'avatar_url'>>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkUser();

    // Listen for auth changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          checkUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const checkUser = async () => {
    try {
      if (!isSupabaseConfigured()) {
        // Demo mode: create a mock user
        setUser({
          id: 'demo-user',
          email: 'demo@zygo.pt',
          full_name: 'Demo User',
          role: 'CMO',
          created_at: new Date().toISOString(),
        });
        return;
      }

      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    await authService.signIn(email, password);
    await checkUser();
  };

  const signUp = async (email: string, password: string, fullName: string, role: User['role']) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    await authService.signUp(email, password, fullName, role);
    await checkUser();
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      return;
    }
    await authService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Pick<User, 'full_name' | 'role' | 'avatar_url'>>) => {
    if (!user || !isSupabaseConfigured()) return;
    
    const updatedUser = await authService.updateProfile(user.id, updates);
    setUser(updatedUser);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase not configured');
    }
    await authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
