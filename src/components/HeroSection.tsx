
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-brand-light-blue to-blue-100 py-16 md:py-24">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 leading-tight">
              Conectando serviços no Evidence Resort
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Encontre prestadores de serviços que moram no seu condomínio ou ofereça seus próprios serviços para a comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700 text-lg px-8 py-3">
                <Link to="/services">
                  Encontrar Serviços
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 border-2">
                <Link to="/services/new">
                  Oferecer Serviço
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-3xl blur opacity-20"></div>
              <img 
                src="/lovable-uploads/6e14ad1d-a7ee-4102-8b93-afcfdc189f62.png" 
                alt="Evidence Resort Condomínio - Vista aérea"
                className="relative rounded-3xl shadow-2xl w-full h-auto object-cover border-4 border-white/20 backdrop-blur-sm" 
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 via-transparent to-white/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
