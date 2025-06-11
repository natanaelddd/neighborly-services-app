
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Página não encontrada</h2>
        <p className="text-gray-500 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link to="/">Voltar ao Início</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/services">Ver Serviços</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/register">Cadastrar-se</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
