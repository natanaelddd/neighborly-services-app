
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, MapPin, Home, Bed, Bath, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PropertyPhoto {
  photo_url: string;
  is_primary: boolean;
}

interface FeaturedProperty {
  id: number;
  title: string;
  description: string;
  type: "venda" | "aluguel";
  price?: string;
  bedrooms: number;
  garage_covered: boolean;
  is_renovated: boolean;
  photos: PropertyPhoto[];
  providerName: string;
  block: string;
  houseNumber: string;
}

const FeaturedAd = () => {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      
      // Buscar propriedades aprovadas com fotos e dados do perfil
      const { data: propertiesData, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          property_photos (photo_url, is_primary)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Erro ao buscar propriedades:', error);
        setProperties([]);
        return;
      }

      // Transformar os dados
      const transformedProperties: FeaturedProperty[] = (propertiesData || []).map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        type: property.type as "venda" | "aluguel",
        price: property.price || undefined,
        bedrooms: property.bedrooms,
        garage_covered: property.garage_covered,
        is_renovated: property.is_renovated,
        photos: property.property_photos || [],
        providerName: property.profiles?.name || 'Morador não identificado',
        block: property.profiles?.block || '',
        houseNumber: property.profiles?.house_number || ''
      }));

      console.log('Propriedades carregadas:', transformedProperties);
      setProperties(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      setProperties([]);
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

  if (isLoading) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Casas em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra as melhores oportunidades no Evidence Resort
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Casas em Destaque</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubra as melhores oportunidades no Evidence Resort
            </p>
          </div>
          <div className="text-center py-12">
            <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma casa disponível</h3>
            <p className="text-gray-500">
              Não há casas aprovadas para exibir no momento.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentProperty = properties[currentIndex];
  const primaryPhoto = currentProperty.photos.find(photo => photo.is_primary) || currentProperty.photos[0];

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
                {primaryPhoto ? (
                  <img 
                    src={primaryPhoto.photo_url} 
                    alt={currentProperty.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                )}
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

                {/* Badge de reforma */}
                {currentProperty.is_renovated && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Reformada
                    </Badge>
                  </div>
                )}
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
                      <span className="text-sm">
                        Evidence Resort - Bloco {currentProperty.block}, Casa {currentProperty.houseNumber}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed line-clamp-3">
                    {currentProperty.description}
                  </p>

                  {/* Características da propriedade */}
                  <div className="flex items-center gap-6 py-3 border-y border-gray-200">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Bed className="w-4 h-4" />
                      <span className="text-sm font-medium">{currentProperty.bedrooms} quartos</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Bath className="w-4 h-4" />
                      <span className="text-sm font-medium">2+ banheiros</span>
                    </div>
                    {currentProperty.garage_covered && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Car className="w-4 h-4" />
                        <span className="text-sm font-medium">Garagem coberta</span>
                      </div>
                    )}
                  </div>

                  {currentProperty.price && (
                    <div className="mb-4">
                      <span className="text-2xl lg:text-3xl font-bold text-brand-blue">
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
                      Entrar em Contato
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Anunciado por: {currentProperty.providerName}
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
