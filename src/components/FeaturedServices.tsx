
import { useState, useEffect } from 'react';
import ServiceList from './ServiceList';
import { ServiceWithProvider } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const FeaturedServices = () => {
  const [featuredServices, setFeaturedServices] = useState<ServiceWithProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setIsLoading(true);
        
        // Buscar serviços aprovados do banco de dados
        const { data: servicesData, error } = await supabase
          .from('services')
          .select(`
            *,
            profiles:unit_id (name, block, house_number),
            categories:category_id (name, icon, created_at, updated_at)
          `)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(6); // Limitar a 6 serviços em destaque

        if (error) {
          console.error('Erro ao buscar serviços em destaque:', error);
          setFeaturedServices([]);
          return;
        }

        // Transformar os dados para o formato ServiceWithProvider
        const transformedServices: ServiceWithProvider[] = (servicesData || []).map(service => ({
          id: service.id,
          unitId: 0, // Valor temporário já que não temos tabela units
          categoryId: service.category_id || 0,
          title: service.title,
          description: service.description,
          photoUrl: service.photo_url || '', // Agora usando o campo correto do banco
          whatsapp: service.whatsapp,
          status: service.status as 'pending' | 'approved' | 'rejected',
          createdAt: service.created_at,
          updatedAt: service.updated_at,
          providerName: service.profiles?.name || 'Morador não identificado',
          block: service.profiles?.block || '',
          number: service.profiles?.house_number || '',
          category: service.categories ? {
            id: service.category_id || 0,
            name: service.categories.name,
            icon: service.categories.icon,
            created_at: service.categories.created_at || '',
            updated_at: service.categories.updated_at || ''
          } : undefined
        }));

        console.log('Serviços em destaque carregados:', transformedServices);
        setFeaturedServices(transformedServices);
      } catch (error) {
        console.error('Erro ao carregar serviços em destaque:', error);
        setFeaturedServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Serviços em Destaque</h2>
          </div>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Serviços em Destaque</h2>
        </div>
        <ServiceList 
          services={featuredServices} 
          emptyMessage="Nenhum serviço aprovado encontrado. Cadastre e aprove serviços para que apareçam aqui."
        />
      </div>
    </section>
  );
};

export default FeaturedServices;
