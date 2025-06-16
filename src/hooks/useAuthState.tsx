
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { toast } from "sonner";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Erro ao buscar perfil:', error);
        if (error.code === 'PGRST116') {
          console.log('Usuário sem perfil, criando automaticamente...');
          return null; // Será tratado pelo código que chama
        }
        throw error;
      }
      
      setProfile(profileData);
      return profileData;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Buscar perfil do usuário
          const profileData = await fetchProfile(session.user.id);
          
          if (!profileData && session.user.app_metadata?.provider === 'google') {
            console.log('Usuário do Google sem perfil, criando automaticamente...');
            
            toast.success("🎉 Bem-vindo ao Condo Indico!");
            
            // Criar perfil automaticamente para usuário do Google
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email!,
                block: '1',
                house_number: '000'
              })
              .select()
              .single();
            
            if (createError) {
              console.error('Erro ao criar perfil:', createError);
              toast.error("Erro ao criar perfil de usuário");
            } else {
              setProfile(newProfile);
              toast.success("✅ Cadastro realizado com sucesso!");
              
              // Redirecionar para o painel do usuário
              setTimeout(() => {
                window.location.href = '/user-dashboard';
              }, 1500);
            }
          } else if (profileData) {
            // Usuário existente fazendo login
            if (event === 'SIGNED_IN') {
              toast.success(`Bem-vindo de volta, ${profileData.name}!`);
              // Redirecionar para o painel do usuário se não for admin
              const isAdmin = ['admin@evidence.com', 'adm@evidence.com', 'natanaelddd@gmail.com'].includes(profileData.email);
              if (!isAdmin) {
                setTimeout(() => {
                  window.location.href = '/user-dashboard';
                }, 1000);
              }
            }
          }
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSession(session);
        setUser(session.user);
        fetchProfile(session.user.id).then(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, session, isLoading, setIsLoading, setUser, setProfile, setSession };
};
