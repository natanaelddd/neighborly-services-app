
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { login, forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate("/services/new"); // Redirect to service registration
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Digite seu email para recuperar a senha");
      return;
    }
    
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setIsForgotPassword(false);
    } catch (error) {
      toast.error("Erro ao recuperar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-10 flex flex-col items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">
          {isForgotPassword ? "Recuperar Senha" : "Login"}
        </h1>
        
        {!isForgotPassword ? (
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

            <div className="text-center">
              <Button
                variant="link"
                type="button"
                className="p-0 text-sm"
                onClick={() => setIsForgotPassword(true)}
              >
                Esqueci minha senha
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <Input
                id="recovery-email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-blue hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
            
            <div className="text-center">
              <Button
                variant="link"
                type="button"
                className="p-0 text-sm"
                onClick={() => setIsForgotPassword(false)}
              >
                Voltar para o login
              </Button>
            </div>
          </form>
        )}
        
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
