
import { createContext, ReactNode } from "react";
import { AuthContextType } from "@/types/auth";
import { useAuthState } from "@/hooks/useAuthState";
import { isUserAdmin } from "@/utils/authHelpers";
import { 
  loginWithEmail, 
  loginWithGoogle, 
  signupWithEmail, 
  resetPassword, 
  signOut 
} from "@/services/authService";

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
  const { user, profile, session, isLoading, setIsLoading, setUser, setProfile, setSession } = useAuthState();
  const isAdmin = isUserAdmin(profile);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async (): Promise<void> => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Erro no login com Google:', error);
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
      await signupWithEmail(email, password, name, block, houseNumber);
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
      await resetPassword(email);
    } catch (error) {
      console.error('Erro ao recuperar senha:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
      isAdmin,
      login,
      loginWithGoogle: handleLoginWithGoogle,
      signup,
      logout, 
      isLoading, 
      forgotPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
