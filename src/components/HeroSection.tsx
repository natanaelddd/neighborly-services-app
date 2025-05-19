
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-blue-800/30 to-blue-900/40 py-16 md:py-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Conectando serviços no Evidence Resort
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Encontre prestadores de serviços que moram no seu condomínio ou ofereça seus próprios serviços para a comunidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
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
              src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600" 
              alt="Evidence Resort Condomínio"
              className="rounded-2xl shadow-lg w-full h-auto object-cover glass-morphism p-1" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
