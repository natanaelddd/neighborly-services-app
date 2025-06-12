
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Home, MapPin, Bed, Car, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeaturedProperty {
  id: number;
  title: string;
  description: string;
  type: "venda" | "aluguel";
  price?: string;
  bedrooms?: number;
  garage_covered?: boolean;
  is_renovated?: boolean;
  photo_url?: string;
}

const FeaturedAd = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      // Buscar propriedades aprovadas com fotos
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          type,
          price,
          bedrooms,
          garage_covered,
          is_renovated,
          property_photos!inner(photo_url, is_primary)
        `)
        .eq('status', 'approved')
        .eq('property_photos.is_primary', true)
        .limit(6);

      if (propertiesError) {
        console.error('Erro ao buscar propriedades:', propertiesError);
        return;
      }

      // Formatar dados para o componente
      const formattedProperties = propertiesData?.map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        type: property.type as "venda" | "aluguel",
        price: property.price || undefined,
        bedrooms: property.bedrooms,
        garage_covered: property.garage_covered,
        is_renovated: property.is_renovated,
        photo_url: property.property_photos[0]?.photo_url
      })) || [];

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades em destaque:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const formatWhatsAppUrl = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}`;
  };

  if (isLoading) {
    return (
      <section className="py-8 sm:py-16">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Casas em Destaque
            </h2>
            <div className="animate-pulse bg-gray-200 h-4 w-48 mx-auto rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="py-8 sm:py-16">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Casas em Destaque
            </h2>
            <p className="text-gray-600">Nenhuma propriedade em destaque no momento.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <section className="py-8 sm:py-16">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Casas em Destaque
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encontre sua nova casa no Evidence Resort com as melhores opções de venda e aluguel.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Imagem */}
              <div className="relative h-64 md:h-full min-h-[300px]">
                <img
                  src={currentProperty.photo_url || "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png"}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={currentProperty.type === "venda" ? "default" : "secondary"}>
                    {currentProperty.type === "venda" ? "Venda" : "Aluguel"}
                  </Badge>
                </div>
                {currentProperty.is_renovated && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-500">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Reformada
                    </Badge>
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <CardContent className="p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    {currentProperty.title}
                  </h3>
                  
                  {currentProperty.price && (
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
                      {currentProperty.price}
                    </div>
                  )}

                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {currentProperty.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {currentProperty.bedrooms && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm">{currentProperty.bedrooms} quartos</span>
                      </div>
                    )}
                    {currentProperty.garage_covered && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Car className="w-4 h-4" />
                        <span className="text-sm">Garagem coberta</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Evidence Resort</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full sm:w-auto"
                  onClick={() => window.open(`https://wa.me/5516999999999?text=Olá! Tenho interesse na propriedade: ${currentProperty.title}`, '_blank')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Tenho Interesse
                </Button>
              </CardContent>
            </div>
          </Card>

          {/* Controles de navegação */}
          {properties.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Indicadores */}
          {properties.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedAd;
