
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, LogOut, Plus, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <span className="text-xl font-bold text-gradient">Condo Indico</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/services" className="text-gray-700 hover:text-brand-blue transition-colors">
              Serviços
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-brand-blue transition-colors">
              Categorias
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-blue transition-colors">
              Sobre
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-brand-blue transition-colors">
              Contato
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{profile?.name || 'Usuário'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Meu Painel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/services/new" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Serviço
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Administração
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/services"
                className="text-gray-700 hover:text-brand-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Serviços
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-brand-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Categorias
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sobre
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-brand-blue transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contato
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500 mb-2">Olá, {profile?.name || 'Usuário'}!</p>
                    <div className="space-y-2">
                      <Link
                        to="/dashboard"
                        className="block text-gray-700 hover:text-brand-blue transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Meu Painel
                      </Link>
                      <Link
                        to="/services/new"
                        className="block text-gray-700 hover:text-brand-blue transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Novo Serviço
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="block text-gray-700 hover:text-brand-blue transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Administração
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="block text-gray-700 hover:text-brand-blue transition-colors"
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <Link
                    to="/login"
                    className="block text-gray-700 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    className="block text-gray-700 hover:text-brand-blue transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
