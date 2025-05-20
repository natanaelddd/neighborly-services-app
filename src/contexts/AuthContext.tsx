
import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  forgotPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  forgotPassword: async () => {},
  isAdmin: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

// Admin credentials (in a real app, this would be in a database)
const ADMIN_EMAILS = ["admin@example.com"];
const ADMIN_PASSWORD = "admin123";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(ADMIN_EMAILS.includes(parsedUser.email));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // In a real app, this would validate with a backend
    setIsLoading(true);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if it's an admin login
        const isAdminUser = ADMIN_EMAILS.includes(email);
        
        if (isAdminUser && password !== ADMIN_PASSWORD) {
          setIsLoading(false);
          reject(new Error("Senha incorreta para administrador"));
          return;
        }

        const newUser: User = { 
          email, 
          isLoggedIn: true,
          whatsapp: "",
          isAdmin: isAdminUser
        };
        
        setUser(newUser);
        setIsAdmin(isAdminUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const forgotPassword = async (email: string): Promise<void> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        toast.success("Um link de recuperação foi enviado para seu email");
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, forgotPassword, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
