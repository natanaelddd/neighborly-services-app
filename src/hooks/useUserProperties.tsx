
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export const useUserProperties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useUserProperties - Debug info:', {
    user: user?.email,
    userId: user?.id
  });

  const fetchUserProperties = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Buscando propriedades para o usuário:', user.id);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          property_photos (photo_url, is_primary)
        `)
        .eq('unit_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propriedades do usuário:', error);
        setError("Erro ao carregar suas propriedades: " + error.message);
        return;
      }

      console.log('Propriedades encontradas:', data);

      const transformedProperties: Property[] = (data || []).map(item => ({
        ...item,
        type: item.type as "venda" | "aluguel",
        profiles: item.profiles ? {
          name: item.profiles.name,
          block: item.profiles.block,
          house_number: item.profiles.house_number
        } : undefined,
        property_photos: item.property_photos || []
      }));

      setProperties(transformedProperties);
      
      if (transformedProperties.length === 0) {
        console.log('Nenhuma propriedade encontrada para o usuário');
      }
      
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      setError("Erro inesperado ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProperties();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return {
    properties,
    isLoading,
    error,
    refetch: fetchUserProperties
  };
};
