import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../lib/db';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kukusoft_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        // Fetch or create profile if needed
        const profile: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Farmer',
          email: session.user.email!,
          farm_name: session.user.user_metadata?.farm_name || 'My Farm',
          created_at: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem('kukusoft_current_user', JSON.stringify(profile));
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'Farmer',
          email: session.user.email!,
          farm_name: session.user.user_metadata?.farm_name || 'My Farm',
          created_at: new Date().toISOString()
        };
        setUser(profile);
        localStorage.setItem('kukusoft_current_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('kukusoft_current_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, farmName?: string) => {
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        data: {
          farm_name: farmName,
          full_name: email.split('@')[0]
        }
      }
    });
    if (error) throw error;
  };

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('kukusoft_current_user', JSON.stringify(userData));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('kukusoft_current_user');
  };

  return {
    user,
    isAuthenticated: !!user,
    session,
    signIn,
    login,
    logout
  };
}
