
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Check if recommendations feature is enabled
  useEffect(() => {
    const storedValue = localStorage.getItem("showRecommendationsMenu");
    if (storedValue) {
      setShowRecommendations(JSON.parse(storedValue));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="bg-card/50 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <nav className="container-custom py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary flex items-center">
          <img 
            src="/lovable-uploads/3e37d1e7-9e83-40ae-9414-bfdbf75723c1.png" 
            alt="Condo Indico" 
            className="w-8 h-8 mr-2"
          />
          Condo Indico
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary font-medium">Início</Link>
          <Link to="/categories" className="text-foreground hover:text-primary font-medium">Categorias</Link>
          <Link to="/about" className="text-foreground hover:text-primary font-medium">Sobre</Link>
          <Link to="/contact" className="text-foreground hover:text-primary font-medium">Contato</Link>
          
          {showRecommendations && (
            <Link to="/recommendations" className="text-foreground hover:text-primary font-medium">Indicações</Link>
          )}
          
          {user ? (
            <div className="flex items-center gap-4">
              {profile && (
                <span className="text-sm text-muted-foreground">
                  Olá, {profile.name}
                </span>
              )}
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
            
            {showRecommendations && (
              <Link 
                to="/recommendations" 
                className="text-foreground hover:text-primary font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Indicações
              </Link>
            )}
            
            {user ? (
              <>
                {profile && (
                  <span className="text-sm text-muted-foreground py-2">
                    Olá, {profile.name}
                  </span>
                )}
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
