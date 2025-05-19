
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-brand-light-blue py-16 md:py-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Serviços do seu condomínio em um só lugar
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Conectamos moradores que oferecem serviços com quem precisa 
              deles, tudo dentro da sua comunidade.
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
              src="https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80&w=600" 
              alt="Imagem representativa de condomínios"
              className="rounded-lg shadow-lg w-full h-auto object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
