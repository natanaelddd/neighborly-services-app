
import { useState, useEffect } from "react";
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
  const { login, loginWithGoogle, forgotPassword, user } = useAuth();

  // Se o usuário já está logado, redireciona para home
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      toast.error(error.message || "Erro ao fazer login com Google");
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
    } catch (error: any) {
      console.error('Erro na recuperação de senha:', error);
      toast.error(error.message || "Erro ao recuperar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-4 flex flex-col items-center min-h-screen bg-brand-gray">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-sm border border-gray-100 px-2 py-4 md:p-8 overflow-auto"
        style={{
          maxHeight: "100dvh",
        }}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gradient">
          {isForgotPassword ? "Recuperar Senha" : "Entrar"}
        </h1>

        {!isForgotPassword ? (
          <>
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
                className="w-full bg-brand-blue hover:bg-blue-700 mt-2"
                disabled={isLoading}
                style={{ minHeight: "44px" }}
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

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full mb-2 h-12"
              disabled={isLoading}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285f4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34a853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#fbbc05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#ea4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? "Entrando..." : "Entrar com Google"}
            </Button>
          </>
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
              className="w-full bg-brand-blue hover:bg-blue-700 mt-2"
              disabled={isLoading}
              style={{ minHeight: "44px" }}
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
            <Button variant="link" className="p-0" onClick={() => navigate("/register")}>
              Cadastre-se
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

