
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageCircle, Home, Bath, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useDemoMode } from "@/hooks/useDemoMode";

const FeaturedAd = () => {
  const { isDemoMode, mockProperties } = useDemoMode();
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode) {
      // Use mock data in demo mode
      const approvedMockProperties = mockProperties.filter(p => p.status === 'approved');
      setProperties(approvedMockProperties as Property[]);
      setIsLoading(false);
    } else {
      fetchFeaturedProperties();
    }
  }, [isDemoMode]);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      
      // Get featured property IDs from localStorage
      const featuredIds = JSON.parse(localStorage.getItem('featuredPropertyIds') || '[]');
      
      if (featuredIds.length === 0) {
        // If no featured properties, show all approved properties
        const { data, error } = await supabase
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
          return;
        }

        const transformedProperties = (data || []).map(transformProperty);
        setProperties(transformedProperties);
      } else {
        // Fetch only featured properties
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            property_photos (photo_url, is_primary)
          `)
          .in('id', featuredIds)
          .eq('status', 'approved');

        if (error) {
          console.error('Erro ao buscar propriedades em destaque:', error);
          return;
        }

        const transformedProperties = (data || []).map(transformProperty);
        setProperties(transformedProperties);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformProperty = (item: any): Property => ({
    ...item,
    type: item.type as "venda" | "aluguel",
    profiles: item.profiles ? {
      name: item.profiles.name,
      block: item.profiles.block,
      house_number: item.profiles.house_number
    } : undefined,
    property_photos: item.property_photos || []
  });

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

  const formatWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return '';
    const cleaned = whatsapp.replace(/\D/g, '');
    return cleaned;
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

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma propriedade disponível</h3>
        <p className="text-gray-500">As propriedades aprovadas aparecerão aqui em breve.</p>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <div className="relative">
      <Card className="overflow-hidden shadow-lg">
        <div className="relative">
          {/* Image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
            {currentProperty.property_photos && currentProperty.property_photos.length > 0 ? (
              <img
                src={currentProperty.property_photos.find(p => p.is_primary)?.photo_url || currentProperty.property_photos[0]?.photo_url}
                alt={currentProperty.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Home className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            {/* Navigation arrows */}
            {properties.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Type badge */}
            <div className="absolute top-4 left-4">
              <Badge className={currentProperty.type === 'venda' ? 'bg-green-500' : 'bg-blue-500'}>
                {currentProperty.type === 'venda' ? 'Venda' : 'Aluguel'}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentProperty.title}
                </h2>
                
                {currentProperty.price && (
                  <p className="text-xl font-semibold text-primary mb-3">
                    {currentProperty.price}
                  </p>
                )}

                <p className="text-gray-600 leading-relaxed mb-4">
                  {currentProperty.description}
                </p>
              </div>

              {/* Property details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span>{currentProperty.bedrooms} quartos</span>
                </div>
                {currentProperty.garage_covered && (
                  <div className="flex items-center gap-1">
                    <Car className="w-4 h-4" />
                    <span>Garagem coberta</span>
                  </div>
                )}
                {currentProperty.is_renovated && (
                  <Badge variant="outline">Reformada</Badge>
                )}
              </div>

              {/* Owner info */}
              {currentProperty.profiles && (
                <div className="text-sm text-gray-600">
                  <strong>Proprietário:</strong> {currentProperty.profiles.name} - 
                  Bloco {currentProperty.profiles.block}, Casa {currentProperty.profiles.house_number}
                </div>
              )}

              {/* WhatsApp button */}
              <Button 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={() => openWhatsApp(currentProperty.whatsapp, currentProperty.title)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Entrar em Contato
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Dots indicator */}
      {properties.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {properties.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-primary' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedAd;
