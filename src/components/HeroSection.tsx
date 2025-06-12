
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-brand-light-blue to-blue-100 py-12 md:py-16">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient mb-4 leading-tight">
              Conectando serviços no Evidence Resort
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0">
              Encontre prestadores de serviços que moram no seu condomínio ou ofereça seus próprios serviços para a comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700 text-base px-6 py-3">
                <Link to="/services">
                  Encontrar Serviços
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-6 py-3 border-2">
                <Link to="/services/new">
                  Oferecer Serviço
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 rounded-2xl blur opacity-20 transform rotate-1"></div>
              <img 
                src="/lovable-uploads/6e14ad1d-a7ee-4102-8b93-afcfdc189f62.png" 
                alt="Evidence Resort Condomínio - Vista aérea"
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover border-2 border-white/20 backdrop-blur-sm transform -rotate-1" 
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 via-transparent to-white/5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
