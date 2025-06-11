
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { CarouselApi } from "@/components/ui/carousel";

interface FeaturedProperty {
  id: number;
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  type: "venda" | "aluguel";
  price?: string;
}

const FeaturedAd = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Mock data - em produção viria do admin ou banco de dados
  const properties: FeaturedProperty[] = [
    {
      id: 1,
      title: "Evidence Resort - Seu novo lar",
      description: "Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis, projetadas para proporcionar qualidade de vida para você e sua família.",
      details: "Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "venda",
      price: "A partir de R$ 450.000"
    },
    {
      id: 2,
      title: "Casa Moderna - Bloco A",
      description: "Casa de 3 quartos com suíte, sala ampla, cozinha planejada e área gourmet. Localizada no Bloco A com vista privilegiada para a área verde do condomínio.",
      details: "Acabamento de primeira qualidade, garagem para 2 carros, jardim privativo e acesso direto à área de lazer do condomínio.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "venda",
      price: "R$ 520.000"
    },
    {
      id: 3,
      title: "Casa para Locação - Bloco C",
      description: "Oportunidade única de morar no Evidence Resort. Casa mobiliada de 2 quartos, ideal para casais ou pequenas famílias que buscam conforto e segurança.",
      details: "Inclui móveis planejados, ar condicionado, área de serviço completa e vaga de garagem coberta.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "aluguel",
      price: "R$ 2.800/mês"
    }
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    // Auto-play functionality
    const autoPlay = setInterval(() => {
      api.scrollNext();
    }, 5000);

    // Update current slide
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      clearInterval(autoPlay);
      api.off("select", onSelect);
    };
  }, [api]);

  const currentProperty = properties[current];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <h2 className="text-2xl font-bold text-center py-4 bg-brand-blue text-white">
        {currentProperty?.type === "venda" ? "Casas em Destaque para Venda" : "Casas em Destaque para Locação"}
      </h2>
      
      <Carousel 
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem key={property.id}>
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2">
                  <img 
                    src={property.imageUrl}
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="md:w-1/2 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.type === "venda" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {property.type === "venda" ? "À Venda" : "Para Alugar"}
                    </span>
                    {property.price && (
                      <span className="text-lg font-bold text-brand-blue">
                        {property.price}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gradient">
                    {property.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4">
                    {property.description}
                  </p>
                  
                  <p className="text-muted-foreground mb-6">
                    {property.details}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-brand-blue hover:bg-blue-700">
                      <Link to="/contact">
                        {property.type === "venda" ? "Quero Comprar" : "Quero Alugar"}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/contact">
                        Mais Informações
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 py-4">
        {properties.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? "bg-brand-blue" : "bg-gray-300"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedAd;
