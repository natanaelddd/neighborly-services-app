
import { useState, useEffect } from 'react';
import { ServiceWithProvider } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';

export const useFeaturedServices = () => {
  const { isDemoMode, mockServices } = useDemoMode();
  const [featuredServices, setFeaturedServices] = useState<ServiceWithProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isDemoMode) {
          console.log('Carregando serviços em modo demo...');
          const approvedMockServices = (mockServices || [])
            .filter(service => service.status === 'approved')
            .slice(0, 6)
            .map(service => ({
              id: service.id,
              unitId: service.unit_id,
              categoryId: service.category_id,
              title: service.title,
              description: service.description,
              photoUrl: service.photo_url || '',
              whatsapp: service.whatsapp,
              status: service.status as 'pending' | 'approved' | 'rejected',
              createdAt: service.created_at,
              updatedAt: service.updated_at,
              block: service.profiles?.block || '',
              house_number: service.profiles?.house_number || '',
              providerName: service.profiles?.name || 'Morador não identificado',
              number: service.profiles?.house_number || '',
              category: service.categories ? {
                id: service.category_id,
                name: service.categories.name,
                icon: service.categories.icon,
                created_at: service.categories.created_at || '',
                updated_at: service.categories.updated_at || ''
              } : undefined
            }));

          setFeaturedServices(approvedMockServices);
          console.log(`${approvedMockServices.length} serviços carregados em modo demo`);
          return;
        }
        
        console.log('Buscando serviços do banco de dados...');
        const { data: servicesData, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            categories:category_id (name, icon, created_at, updated_at)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Erro ao buscar serviços:', error);
          setError(`Erro ao carregar serviços: ${error.message}`);
          setFeaturedServices([]);
          return;
        }

        if (!servicesData || servicesData.length === 0) {
          console.log('Nenhum serviço aprovado encontrado no banco');
          setFeaturedServices([]);
          return;
        }

        const transformedServices: ServiceWithProvider[] = (servicesData || []).map(service => ({
          id: service.id,
          unitId: service.unit_id || '',
          categoryId: service.category_id || 0,
          title: service.title,
          description: service.description,
          photoUrl: service.photo_url || '',
          whatsapp: service.whatsapp,
          status: service.status as 'pending' | 'approved' | 'rejected',
          createdAt: service.created_at,
          updatedAt: service.updated_at,
          block: service.block || service.profiles?.block || '',
          house_number: service.house_number || service.profiles?.house_number || '',
          providerName: service.profiles?.name || 'Morador não identificado',
          number: service.house_number || service.profiles?.house_number || '',
          category: service.categories ? {
            id: service.category_id || 0,
            name: service.categories.name,
            icon: service.categories.icon,
            created_at: service.categories.created_at || '',
            updated_at: service.categories.updated_at || ''
          } : undefined
        }));

        console.log(`${transformedServices.length} serviços carregados do banco`);
        setFeaturedServices(transformedServices);
      } catch (error) {
        console.error('Erro inesperado ao carregar serviços:', error);
        setError('Erro inesperado ao carregar dados');
        setFeaturedServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, [isDemoMode, mockServices]);

  return {
    featuredServices,
    isLoading,
    error
  };
};
