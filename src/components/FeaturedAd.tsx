
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Home, Bed, Bath, Car } from "lucide-react";

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
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Carregar propriedades do localStorage ou usar as padrão
    const storedProperties = localStorage.getItem('featuredProperties');
    if (storedProperties) {
      try {
        setProperties(JSON.parse(storedProperties));
      } catch (error) {
        console.error('Erro ao carregar propriedades:', error);
        setProperties(getDefaultProperties());
      }
    } else {
      setProperties(getDefaultProperties());
    }
  }, []);

  const getDefaultProperties = (): FeaturedProperty[] => [
    {
      id: 1,
      title: "Evidence Resort - Seu novo lar",
      description: "Localizado em uma região privilegiada, o Evidence Resort conta com casas modernas e confortáveis, projetadas para proporcionar qualidade de vida para você e sua família.",
      details: "Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "venda" as const,
      price: "A partir de R$ 450.000"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === properties.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? properties.length - 1 : prevIndex - 1
    );
  };

  if (properties.length === 0) {
    return null;
  }

  const currentProperty = properties[currentIndex];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Casas em Destaque</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra as melhores oportunidades no Evidence Resort
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Card className="overflow-hidden shadow-2xl bg-white/95 backdrop-blur-sm border-0">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Imagem */}
              <div className="relative h-64 lg:h-96 overflow-hidden">
                <img 
                  src={currentProperty.imageUrl} 
                  alt={currentProperty.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Badge do tipo */}
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={currentProperty.type === "venda" ? "default" : "secondary"}
                    className="text-sm font-semibold px-3 py-1"
                  >
                    {currentProperty.type === "venda" ? "À Venda" : "Para Alugar"}
                  </Badge>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      {currentProperty.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">Evidence Resort - Condomínio Fechado</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {currentProperty.description}
                  </p>

                  {/* Características da propriedade */}
                  <div className="flex items-center gap-6 py-3 border-y border-gray-200">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm font-medium">3 quartos</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm font-medium">2 banheiros</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Car className="w-4 h-4" />
                      <span className="text-sm font-medium">2 vagas</span>
                    </div>
                  </div>

                  {currentProperty.price && (
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-brand-blue">
                        {currentProperty.price}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button 
                      size="lg" 
                      className="bg-brand-blue hover:bg-blue-700 text-white px-6"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white px-6"
                    >
                      Agendar Visita
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Controles de navegação */}
          {properties.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-2 hover:bg-white shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-2 hover:bg-white shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Indicadores */}
              <div className="flex justify-center mt-6 space-x-2">
                {properties.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-brand-blue scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAd;
