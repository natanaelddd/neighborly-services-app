
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  return (
    <header className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <nav className="container-custom py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary flex items-center">
          <span className="mr-2">🏡</span>
          Evidence Resort
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary font-medium">Início</Link>
          <Link to="/categories" className="text-foreground hover:text-primary font-medium">Categorias</Link>
          <Link to="/about" className="text-foreground hover:text-primary font-medium">Sobre</Link>
          <Link to="/contact" className="text-foreground hover:text-primary font-medium">Contato</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link to="/services/new">Cadastrar Serviço</Link>
              </Button>
              <Button onClick={handleLogout} variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-card/90 backdrop-blur-lg py-4 px-6 shadow-inner animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/categories" 
              className="text-foreground hover:text-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Categorias
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              to="/contact" 
              className="text-foreground hover:text-primary font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            
            {user ? (
              <>
                <Button asChild className="w-full">
                  <Link to="/services/new" onClick={() => setIsOpen(false)}>
                    Cadastrar Serviço
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild className="w-full">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
