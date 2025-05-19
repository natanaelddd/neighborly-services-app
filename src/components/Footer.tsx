
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-10 mt-auto border-t border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-semibold text-brand-blue flex items-center mb-4">
              <span className="mr-2">🏡</span>
              Evidence Resort
            </Link>
            <p className="text-gray-600 max-w-xs">
              Conectando moradores e serviços dentro do Evidence Resort, seu condomínio de casas de alto padrão.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-brand-blue transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contato</h3>
            <p className="text-gray-600 mb-2">
              Administração do Evidence Resort
            </p>
            <Link 
              to="/contact" 
              className="text-brand-blue hover:text-blue-700 transition-colors"
            >
              Entre em contato
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} Evidence Resort. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-gray-500 text-sm hover:text-brand-blue transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-gray-500 text-sm hover:text-brand-blue transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
