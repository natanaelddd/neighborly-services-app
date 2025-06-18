
import { useState, useEffect } from 'react';
import ServiceList from './ServiceList';
import { ServiceWithProvider } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';

const FeaturedServices = () => {
  const { isDemoMode, mockServices } = useDemoMode();
  const [featuredServices, setFeaturedServices] = useState<ServiceWithProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setIsLoading(true);
        
        if (isDemoMode) {
          // Use mock data for demo mode
          const approvedMockServices = (mockServices || [])
            .filter(service => service.status === 'approved')
            .slice(0, 6) // Limit to 6 featured services
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

          console.log('Serviços em destaque (modo demo):', approvedMockServices);
          setFeaturedServices(approvedMockServices);
          setIsLoading(false);
          return;
        }
        
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
          // Em caso de erro, criar serviços de exemplo
          const exampleServices = [
            {
              id: 1,
              unitId: 'exemplo-1',
              categoryId: 1,
              title: 'Limpeza Residencial',
              description: 'Serviços completos de limpeza para sua casa',
              photoUrl: '',
              whatsapp: '11999999999',
              status: 'approved' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              block: 'A',
              house_number: '101',
              providerName: 'Maria Silva',
              number: '101',
              category: {
                id: 1,
                name: 'Limpeza',
                icon: '🧹',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: 2,
              unitId: 'exemplo-2',
              categoryId: 2,
              title: 'Reparos Domésticos',
              description: 'Consertos e reparos em geral para sua casa',
              photoUrl: '',
              whatsapp: '11888888888',
              status: 'approved' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              block: 'B',
              house_number: '202',
              providerName: 'João Santos',
              number: '202',
              category: {
                id: 2,
                name: 'Reparos',
                icon: '🔧',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ];
          setFeaturedServices(exampleServices);
          setIsLoading(false);
          return;
        }

        // Se não há serviços no banco, criar serviços de exemplo
        if (!servicesData || servicesData.length === 0) {
          const exampleServices = [
            {
              id: 1,
              unitId: 'exemplo-1',
              categoryId: 1,
              title: 'Limpeza Residencial',
              description: 'Serviços completos de limpeza para sua casa',
              photoUrl: '',
              whatsapp: '11999999999',
              status: 'approved' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              block: 'A',
              house_number: '101',
              providerName: 'Maria Silva',
              number: '101',
              category: {
                id: 1,
                name: 'Limpeza',
                icon: '🧹',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            },
            {
              id: 2,
              unitId: 'exemplo-2',
              categoryId: 2,
              title: 'Reparos Domésticos',
              description: 'Consertos e reparos em geral para sua casa',
              photoUrl: '',
              whatsapp: '11888888888',
              status: 'approved' as const,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              block: 'B',
              house_number: '202',
              providerName: 'João Santos',
              number: '202',
              category: {
                id: 2,
                name: 'Reparos',
                icon: '🔧',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          ];
          console.log('Nenhum serviço no banco, usando serviços de exemplo:', exampleServices);
          setFeaturedServices(exampleServices);
          setIsLoading(false);
          return;
        }

        // Transformar os dados para o formato ServiceWithProvider
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

        console.log('Serviços em destaque carregados:', transformedServices);
        setFeaturedServices(transformedServices);
      } catch (error) {
        console.error('Erro ao carregar serviços em destaque:', error);
        // Em caso de erro, criar serviços de exemplo
        const exampleServices = [
          {
            id: 1,
            unitId: 'exemplo-1',
            categoryId: 1,
            title: 'Limpeza Residencial',
            description: 'Serviços completos de limpeza para sua casa',
            photoUrl: '',
            whatsapp: '11999999999',
            status: 'approved' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            block: 'A',
            house_number: '101',
            providerName: 'Maria Silva',
            number: '101',
            category: {
              id: 1,
              name: 'Limpeza',
              icon: '🧹',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          },
          {
            id: 2,
            unitId: 'exemplo-2',
            categoryId: 2,
            title: 'Reparos Domésticos',
            description: 'Consertos e reparos em geral para sua casa',
            photoUrl: '',
            whatsapp: '11888888888',
            status: 'approved' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            block: 'B',
            house_number: '202',
            providerName: 'João Santos',
            number: '202',
            category: {
              id: 2,
              name: 'Reparos',
              icon: '🔧',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        ];
        setFeaturedServices(exampleServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedServices();
  }, [isDemoMode, mockServices]);

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
          {isDemoMode && (
            <div className="text-sm text-muted-foreground">Modo Demo Ativo</div>
          )}
        </div>
        <ServiceList 
          services={featuredServices} 
          emptyMessage="Nenhum serviço encontrado. Os serviços aparecerão aqui quando forem cadastrados e aprovados."
        />
      </div>
    </section>
  );
};

export default FeaturedServices;
