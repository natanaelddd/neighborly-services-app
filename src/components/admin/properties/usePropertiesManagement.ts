
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useDemoMode } from "@/hooks/useDemoMode";

export const usePropertiesManagement = (onUpdateProperty?: (propertyId: number, updatedData: Partial<Property>) => void) => {
  const { isDemoMode, mockProperties } = useDemoMode();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [featuredProperties, setFeaturedProperties] = useState<number[]>([]);

  useEffect(() => {
    if (isDemoMode) {
      setProperties(mockProperties as Property[]);
      setIsLoading(false);
    } else {
      fetchProperties();
      loadFeaturedProperties();
    }
  }, [isDemoMode]);

  const loadFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_services')
        .select('service_id');

      if (!error && data) {
        const featuredIds = data.map(item => item.service_id);
        setFeaturedProperties(featuredIds);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades em destaque:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          property_photos (photo_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propriedades:', error);
        toast.error("Erro ao carregar propriedades");
        return;
      }

      console.log('Propriedades carregadas no admin:', data);

      const transformedProperties: Property[] = (data || []).map(item => {
        console.log('Transformando propriedade no admin:', item);
        return {
          ...item,
          type: item.type as "venda" | "aluguel",
          profiles: item.profiles ? {
            name: item.profiles.name,
            block: item.profiles.block,
            house_number: item.profiles.house_number
          } : undefined,
          property_photos: item.property_photos || []
        };
      });

      setProperties(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error("Erro ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    if (isDemoMode) {
      setProperties(properties.map(property => 
        property.id === propertyId ? { ...property, status: newStatus } : property
      ));
      toast.success(`Status da propriedade atualizado para ${newStatus}!`);
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error("Erro ao atualizar status da propriedade");
        return;
      }

      setProperties(properties.map(property => 
        property.id === propertyId ? { ...property, status: newStatus } : property
      ));

      const statusMessages = {
        approved: "Propriedade aprovada com sucesso!",
        rejected: "Propriedade rejeitada!",
        pending: "Propriedade marcada como pendente!"
      };

      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || "Status atualizado!");
      
      if (onUpdateProperty) {
        onUpdateProperty(propertyId, { status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const toggleFeatured = async (propertyId: number) => {
    const isFeatured = featuredProperties.includes(propertyId);
    
    try {
      if (isFeatured) {
        const { error } = await supabase
          .from('featured_services')
          .delete()
          .eq('service_id', propertyId);

        if (error) {
          console.error('Erro ao remover destaque:', error);
          toast.error("Erro ao remover destaque");
          return;
        }

        setFeaturedProperties(featuredProperties.filter(id => id !== propertyId));
        toast.success('Propriedade removida do destaque!');
      } else {
        const { error } = await supabase
          .from('featured_services')
          .insert([{ service_id: propertyId }]);

        if (error) {
          console.error('Erro ao adicionar destaque:', error);
          toast.error("Erro ao adicionar destaque");
          return;
        }

        setFeaturedProperties([...featuredProperties, propertyId]);
        toast.success('Propriedade adicionada ao destaque!');
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
      toast.error("Erro ao alterar destaque");
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    if (!window.confirm("Deseja excluir esta propriedade? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Erro ao excluir propriedade:', error);
        toast.error("Erro ao excluir propriedade.");
        return;
      }

      if (featuredProperties.includes(propertyId)) {
        await supabase
          .from('featured_services')
          .delete()
          .eq('service_id', propertyId);
        
        setFeaturedProperties(featuredProperties.filter(id => id !== propertyId));
      }

      setProperties(properties.filter(property => property.id !== propertyId));
      toast.success("Propriedade excluída com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      toast.error("Erro ao excluir propriedade.");
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  return {
    properties,
    filteredProperties,
    isLoading,
    filter,
    setFilter,
    featuredProperties,
    isDemoMode,
    handleStatusChange,
    toggleFeatured,
    handleDeleteProperty,
    fetchProperties
  };
};
