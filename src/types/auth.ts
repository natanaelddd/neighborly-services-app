
import { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  name: string;
  email: string;
  block: string;
  house_number: string;
  whatsapp?: string;
}

export interface AuthContextType {
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
