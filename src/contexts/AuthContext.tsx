
import { createContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  name: string;
  email: string;
  block: string;
  house_number: string;
  whatsapp?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string, block: string, houseNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isAdmin: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: false,
  forgotPassword: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lista de emails de administradores - em um app real, isso seria gerenciado no banco
  const adminEmails = ['admin@evidence.com', 'adm@evidence.com'];
  
  const isAdmin = profile ? adminEmails.includes(profile.email) : false;

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Erro ao buscar perfil:', error);
                // Se não encontrou perfil e é login com Google, criar perfil básico
                if (error.code === 'PGRST116' && session.user.app_metadata?.provider === 'google') {
                  console.log('Criando perfil para usuário do Google...');
                  const { error: insertError } = await supabase
                    .from('profiles')
                    .insert({
                      id: session.user.id,
                      name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
                      email: session.user.email || '',
                      block: '1', // Valor padrão temporário
                      house_number: '0' // Valor padrão temporário
                    });
                  
                  if (insertError) {
                    console.error('Erro ao criar perfil:', insertError);
                  } else {
                    // Buscar o perfil recém-criado
                    const { data: newProfile } = await supabase
                      .from('profiles')
                      .select('*')
                      .eq('id', session.user.id)
                      .single();
                    setProfile(newProfile);
                  }
                }
              } else {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Erro ao buscar perfil:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Login realizado com sucesso!");
        // Redirecionar para home após login
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      toast.error("Erro ao fazer login com Google");
      throw error;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    block: string, 
    houseNumber: string
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            block,
            house_number: houseNumber,
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.");
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Um link de recuperação foi enviado para seu email");
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      toast.success("Logout realizado com sucesso!");
      // Redirecionar para home após logout
      window.location.href = '/';
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
      isAdmin,
      login,
      loginWithGoogle,
      signup,
      logout, 
      isLoading, 
      forgotPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
