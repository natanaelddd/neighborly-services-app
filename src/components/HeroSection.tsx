
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Search, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative py-20">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <img 
              src="/lovable-uploads/f5e0efa5-edc9-4e24-918f-8172b4020838.png"
              alt="Vista aérea do condomínio Evidence"
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right side - Content and buttons */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Condo Indico
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                A plataforma que conecta moradores aos melhores serviços e propriedades do seu condomínio
              </p>
            </div>

            {/* Three buttons */}
            <div className="space-y-4">
              <Link to="/servicos">
                <Button size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Search className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Encontrar Serviços</div>
                      <div className="text-sm opacity-90">Descubra profissionais qualificados</div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/novo-servico">
                <Button variant="outline" size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Oferecer Serviço</div>
                      <div className="text-sm opacity-75">Cadastre seus serviços</div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>

              <Link to="/nova-propriedade">
                <Button variant="outline" size="lg" className="w-full flex items-center justify-between gap-2 h-16">
                  <div className="flex items-center gap-3">
                    <Home className="w-6 h-6" />
                    <div className="text-left">
                      <div className="font-semibold">Cadastrar Casa</div>
                      <div className="text-sm opacity-75">Anuncie sua propriedade</div>
                    </div>
                  </div>
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
