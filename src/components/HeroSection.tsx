
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-green-50 py-20">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Condo Indico
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            A plataforma que conecta moradores aos melhores serviços e propriedades do seu condomínio
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/servicos">
              <Button size="lg" className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Encontrar Serviços
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/novo-servico">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Oferecer Serviço
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
