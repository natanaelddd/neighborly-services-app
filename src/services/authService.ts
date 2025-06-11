
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getRedirectUrl } from "@/utils/authHelpers";

export const loginWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  if (data.user) {
    toast.success("Login realizado com sucesso!");
    window.location.href = '/';
  }
};

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  });
  
  if (error) throw error;
};

export const signupWithEmail = async (
  email: string, 
  password: string, 
  name: string, 
  block: string, 
  houseNumber: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
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
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  
  toast.success("Um link de recuperação foi enviado para seu email");
};

export const signOut = async () => {
  await supabase.auth.signOut();
  toast.success("Logout realizado com sucesso!");
  window.location.href = '/';
};
