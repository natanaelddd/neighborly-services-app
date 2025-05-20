
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulating login for now - would connect to Supabase in production
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email, isLoggedIn: true }));
      toast.success("Login realizado com sucesso!");
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="container-custom py-10 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate("/register")}
            >
              Cadastre-se
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
