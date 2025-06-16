
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/auth';
import { isUserAdmin } from '@/utils/authHelpers';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('AuthProvider - Current state:', {
    user: user ? user.email : 'null',
    profile: profile ? profile.email : 'null',
    isLoading,
    isAdmin
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('AuthProvider - Getting initial session...');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session ? 'exists' : 'null');
          if (session?.user) {
            setUser(session.user);
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? 'session exists' : 'no session');
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('AuthProvider - Fetching profile for user:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
      
      // Check admin status
      const adminStatus = isUserAdmin(data);
      console.log('Admin status check result:', adminStatus);
      setIsAdmin(adminStatus);
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const signOut = async () => {
    console.log('AuthProvider - Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error in signOut:', error);
    }
  };

  const value = {
    user,
    profile, 
    isLoading,
    isAdmin,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
