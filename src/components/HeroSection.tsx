
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-brand-light-blue to-blue-100 py-16 md:py-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
              Conectando serviços no Evidence Resort
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Encontre prestadores de serviços que moram no seu condomínio ou ofereça seus próprios serviços para a comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
                <Link to="/services">
                  Encontrar Serviços
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/services/new">
                  Oferecer Serviço
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="/lovable-uploads/6e14ad1d-a7ee-4102-8b93-afcfdc189f62.png" 
              alt="Evidence Resort Condomínio - Vista aérea"
              className="rounded-2xl shadow-lg w-full h-auto object-cover p-1 border border-gray-100 mb-4" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
