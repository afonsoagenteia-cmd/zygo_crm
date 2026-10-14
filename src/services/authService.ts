import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'Content Specialist' | 'Customer Success' | 'CMO';
  avatar_url?: string;
  created_at: string;
}

export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, fullName: string, role: User['role']) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) throw error;

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
        });

      if (profileError) throw profileError;
    }

    return data;
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    // Get user profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      // Return basic user info if profile not found
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

  // Get all users
  async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Pick<User, 'full_name' | 'role' | 'avatar_url'>>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) throw error;
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};
