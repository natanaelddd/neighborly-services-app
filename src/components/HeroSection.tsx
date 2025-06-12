
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Briefcase, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e0f2fe" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="container-custom relative">
        <div className="py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo Principal */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                🏠 Evidence Resort - Sua comunidade conectada
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Conecte-se com
                <span className="block text-gradient">
                  serviços locais
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Encontre ou ofereça serviços dentro do seu condomínio. 
                Uma plataforma exclusiva para moradores do Evidence Resort 
                se conectarem com facilidade e segurança.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => navigate('/services')}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Encontrar Serviços
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/services/new')}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Oferecer Serviços
                </Button>

                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => navigate('/properties/new')}
                >
                  <Home className="mr-2 h-5 w-5" />
                  Cadastrar Imóvel
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Gratuito
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  Seguro
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                  Exclusivo
                </div>
              </div>
            </div>
            
            {/* Imagem Ilustrativa */}
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png" 
                  alt="Evidence Resort - Condomínio moderno e seguro" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">Blocos Residenciais</div>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-600">Segurança Garantida</div>
            </div>
            <div className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
