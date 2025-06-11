
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

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.error('Erro ao buscar perfil:', error);
                if (error.code === 'PGRST116' && session.user.app_metadata?.provider === 'google') {
                  console.log('Usuário do Google sem perfil, criando automaticamente...');
                  
                  // Criar perfil automaticamente para usuário do Google
                  const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                      id: session.user.id,
                      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Usuário',
                      email: session.user.email!,
                      block: '1', // Valor padrão, usuário pode alterar depois
                      house_number: '000' // Valor padrão, usuário pode alterar depois
                    })
                    .select()
                    .single();
                  
                  if (createError) {
                    console.error('Erro ao criar perfil:', createError);
                    toast.error("Erro ao criar perfil de usuário");
                  } else {
                    setProfile(newProfile);
                    toast.success("Perfil criado automaticamente! Complete seus dados quando necessário.");
                    // Redirecionar para página de cadastro de serviços
                    window.location.href = '/services/new';
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

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, session, isLoading, setIsLoading, setUser, setProfile, setSession };
};
