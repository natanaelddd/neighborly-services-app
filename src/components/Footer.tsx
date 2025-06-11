
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/30 py-10 mt-auto border-t border-border">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-xl font-semibold text-primary flex items-center mb-4">
              <img 
                src="/lovable-uploads/3e37d1e7-9e83-40ae-9414-bfdbf75723c1.png" 
                alt="Condo Indico" 
                className="w-6 h-6 mr-2"
              />
              Condo Indico
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Conectando moradores e serviços dentro do Evidence Resort, seu condomínio de casas.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-foreground">Contato</h3>
            <p className="text-muted-foreground mb-2">
              Fale com o desenvolvedor
            </p>
            <Link 
              to="/contact" 
              className="text-primary hover:text-blue-400 transition-colors"
            >
              Entre em contato
            </Link>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Este site é independente e não tem qualquer vinculação com a administração do Evidence Resort. É uma iniciativa particular para conectar moradores e facilitar a divulgação dos trabalhos e serviços oferecidos pelos condôminos.
          </p>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <p className="text-muted-foreground text-sm mb-2 md:mb-0">
              © {currentYear} Condo Indico. Todos os direitos reservados.
            </p>
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              Desenvolvido por <a href="https://www.natanael.com.br" target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80">Natanael Silva</a>. 
              <a href="https://wa.me/5516992701617" target="_blank" rel="noreferrer" className="text-primary hover:text-primary/80 ml-1">(16) 99270-1617</a>
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
