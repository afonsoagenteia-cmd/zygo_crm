import { getSupabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'Content Specialist' | 'Customer Success' | 'CMO';
  avatar_url?: string;
  created_at: string;
}

export const authService = {
  async signUp(email: string, password: string, fullName: string, role: User['role']) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const signUpData = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpData.error) throw signUpData.error;

    if (signUpData.data.user) {
      const profileResult = await supabase
        .from('users')
        .insert({
          id: signUpData.data.user.id,
          email: email,
          full_name: fullName,
          role: role,
        });

      if (profileResult.error) throw profileResult.error;
    }

    return signUpData.data;
  },

  async signIn(email: string, password: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) throw result.error;
    return result.data;
  },

  async signOut() {
    const supabase = getSupabase();
    if (!supabase) return;

    const result = await supabase.auth.signOut();
    if (result.error) throw result.error;
  },

  async getCurrentUser() {
    const supabase = getSupabase();
    if (!supabase) return null;

    const authResult = await supabase.auth.getUser();
    const user = authResult.data.user;
    
    if (!user) return null;

    const profileResult = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    const profile = profileResult.data;
    const error = profileResult.error;

    if (error || !profile) {
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 'User',
        role: user.user_metadata?.role || 'Content Specialist',
        created_at: user.created_at || new Date().toISOString(),
      };
    }

    return profile as User;
  },

  async getAllUsers() {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const result = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (result.error) throw result.error;
    return result.data as User[];
  },

  async updateProfile(userId: string, updates: Partial<Pick<User, 'full_name' | 'role' | 'avatar_url'>>) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const result = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (result.error) throw result.error;
    return result.data as User;
  },

  async resetPassword(email: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (result.error) throw result.error;
  },

  async updatePassword(newPassword: string) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const result = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (result.error) throw result.error;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = getSupabase();
    if (!supabase) {
      const mockSubscription = { unsubscribe: () => {} };
      return { data: { subscription: mockSubscription } };
    }

    return supabase.auth.onAuthStateChange(callback);
  },
};
