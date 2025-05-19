
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-brand-blue flex items-center">
          <span className="mr-2">🏠</span>
          CondoServ
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-brand-blue font-medium">Início</Link>
          <Link to="/categories" className="text-gray-700 hover:text-brand-blue font-medium">Categorias</Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-blue font-medium">Sobre</Link>
          <Button asChild>
            <Link to="/services/new">Cadastrar Serviço</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-inner animate-fade-in">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-brand-blue font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link 
              to="/categories" 
              className="text-gray-700 hover:text-brand-blue font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Categorias
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-brand-blue font-medium py-2"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Button asChild className="w-full">
              <Link to="/services/new" onClick={() => setIsOpen(false)}>
                Cadastrar Serviço
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
