
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Home, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useDemoMode } from "@/hooks/useDemoMode";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const FeaturedAd = () => {
  const { isDemoMode, mockProperties } = useDemoMode();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Utiliza casas aprovadas em modo demo
      const approvedMockProperties = mockProperties.filter(p => p.status === 'approved');
      setProperties(approvedMockProperties as Property[]);
      setIsLoading(false);
    } else {
      fetchFeaturedProperties();
    }
    // eslint-disable-next-line
  }, [isDemoMode]);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      // Busca os IDs das casas em destaque do localStorage
      const featuredIds = JSON.parse(localStorage.getItem('featuredPropertyIds') || '[]');
      
      let data, error;
      if (featuredIds.length === 0) {
        // Se nenhum destaque, traz as últimas aprovadas
        ({ data, error } = await supabase
          .from('properties')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            property_photos (photo_url, is_primary)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6));
      } else {
        ({ data, error } = await supabase
          .from('properties')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            property_photos (photo_url, is_primary)
          `)
          .in('id', featuredIds)
          .eq('status', 'approved'));
      }

      if (error) {
        console.error('Erro ao buscar propriedades:', error);
        setProperties([]);
        return;
      }

      const transformedProperties = (data || []).map(transformProperty);
      setProperties(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const transformProperty = (item: any): Property => {
    return {
      ...item,
      type: item.type as "venda" | "aluguel",
      profiles: item.profiles ? {
        name: item.profiles.name,
        block: item.profiles.block,
        house_number: item.profiles.house_number
      } : undefined,
      property_photos: item.property_photos || [],
    };
  };

  const formatWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return '';
    return whatsapp.replace(/\D/g, '');
  };

  const openWhatsApp = (whatsapp: string, propertyTitle: string) => {
    const cleanedWhatsApp = formatWhatsApp(whatsapp);
    const message = encodeURIComponent(`Olá! Tenho interesse na propriedade: ${propertyTitle}`);
    const whatsappUrl = `https://wa.me/${cleanedWhatsApp}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!properties.length) {
    return (
      <div className="text-center py-12">
        <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma propriedade disponível</h3>
        <p className="text-gray-500">As propriedades aprovadas aparecerão aqui em breve.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel className="w-full max-w-2xl mx-auto">
        <CarouselContent>
          {properties.map((property, idx) => (
            <CarouselItem key={property.id} className="px-1 py-4">
              <Card className="overflow-hidden shadow-lg">
                <div className="relative">
                  {/* Imagem da casa */}
                  <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
                    {property.property_photos && property.property_photos.length > 0 ? (
                      <img
                        src={property.property_photos.find(p => p.is_primary)?.photo_url || property.property_photos[0]?.photo_url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem:', e);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Home className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Tipo */}
                    <div className="absolute top-4 left-4">
                      <Badge className={property.type === "venda" ? "bg-green-500" : "bg-blue-500"}>
                        {property.type === "venda" ? "Venda" : "Aluguel"}
                      </Badge>
                    </div>
                  </div>
                  {/* Conteúdo */}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {property.title}
                        </h2>
                        {property.price && (
                          <p className="text-xl font-semibold text-primary mb-3">
                            {property.price}
                          </p>
                        )}
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {property.description}
                        </p>
                      </div>
                      {/* Detalhes */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            <span>{property.bedrooms} quartos</span>
                          </div>
                        )}
                        {property.garage_covered && (
                          <div className="flex items-center gap-1">
                            <Car className="w-4 h-4" />
                            <span>Garagem coberta</span>
                          </div>
                        )}
                        {property.is_renovated && (
                          <Badge variant="outline">Reformada</Badge>
                        )}
                      </div>
                      {/* Info proprietário */}
                      {property.profiles && (
                        <div className="text-sm text-gray-600">
                          <strong>Proprietário:</strong> {property.profiles.name} - 
                          Bloco {property.profiles.block}, Casa {property.profiles.house_number}
                        </div>
                      )}
                      {/* Botão WhatsApp */}
                      <Button 
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        onClick={() => openWhatsApp(property.whatsapp, property.title)}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Entrar em Contato
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Botões de navegação */}
        {properties.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default FeaturedAd;
