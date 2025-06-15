import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  createAccount: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider - Starting auth check');

    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error?.code === 'session_not_found') {
        console.warn('AuthProvider - Invalid session detected. Signing out and clearing cache.');
        
        await supabase.auth.signOut();

        // Optional: force clear Supabase auth IndexedDB cache
        try {
          indexedDB.deleteDatabase('supabase-auth-cache');
        } catch (err) {
          console.warn('IndexedDB clear failed:', err);
        }

        setUser(null);
        setSession(null);
        setLoading(false);

        // Force a reload to ensure fresh Supabase state (optional but safe)
        window.location.reload();
        return;
      }

      console.log('AuthProvider - Initial session check:', session?.user?.id);
      setUser(session?.user ?? null);
      setSession(session ?? null);
      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthProvider - Auth state changed:', event, session?.user?.id);

      setUser(session?.user ?? null);
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createAccount = async (email: string, password: string) => {
    console.log('AuthProvider - Creating account for:', email);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      console.log('AuthProvider - Sign up result:', { userId: data?.user?.id, error });

      if (!error && data?.user) {
        return { error: null };
      }

      setLoading(false);
      return { error };
    } catch (err) {
      console.error('AuthProvider - Error creating account:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider - Signing in:', email);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('AuthProvider - Sign in result:', { userId: data?.user?.id, error });

      if (!error && data?.user) {
        return { error: null };
      }

      setLoading(false);
      return { error };
    } catch (err) {
      console.error('AuthProvider - Error signing in:', err);
      setLoading(false);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider - Signing out');
    setLoading(true);

    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('AuthProvider - Error signing out:', err);
    } finally {
      setUser(null);
      setSession(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    createAccount,
    signIn,
    signOut,
  };

  console.log('AuthProvider - Current state:', {
    user: user?.id,
    session: !!session,
    loading,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
