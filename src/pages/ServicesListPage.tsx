import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ServiceWithProvider, Category } from "@/types";
import ServiceList from "@/components/ServiceList";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";

const ServicesListPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const { isDemoMode, mockServices, mockCategories } = useDemoMode();
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithProvider[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, [isDemoMode]);

  useEffect(() => {
    const categoryFromQuery = searchParams.get('category');
    
    if (categoryFromQuery) {
      setActiveCategory(categoryFromQuery);
      filterServicesByCategory(categoryFromQuery);
    } else if (categoryId) {
      setActiveCategory(categoryId);
      filterServicesByCategory(categoryId);
    } else {
      setActiveCategory("all");
      setFilteredServices(services);
    }
  }, [categoryId, searchParams, services]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      if (isDemoMode) {
        // Use mock data for demo mode
        const transformedMockServices: ServiceWithProvider[] = mockServices
          .filter(service => service.status === 'approved')
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

        setServices(transformedMockServices);
        setFilteredServices(transformedMockServices);
        setCategories(mockCategories as Category[]);
        setIsLoading(false);
        return;
      }
      
      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
        // Usar categorias padrão em caso de erro
        const defaultCategories = [
          { id: 1, name: "Limpeza", icon: "🧹", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 2, name: "Reparos", icon: "🔧", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 3, name: "Beleza", icon: "💄", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 4, name: "Saúde", icon: "🏥", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { id: 5, name: "Educação", icon: "📚", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ];
        setCategories(defaultCategories);
      } else {
        // Se não há categorias no banco, usar categorias padrão
        if (!categoriesData || categoriesData.length === 0) {
          const defaultCategories = [
            { id: 1, name: "Limpeza", icon: "🧹", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 2, name: "Reparos", icon: "🔧", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 3, name: "Beleza", icon: "💄", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 4, name: "Saúde", icon: "🏥", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: 5, name: "Educação", icon: "📚", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          ];
          setCategories(defaultCategories);
        } else {
          setCategories(categoriesData || []);
        }
      }

      // Buscar serviços aprovados
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          categories:category_id (name, icon, created_at, updated_at)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
        // Criar serviços de exemplo em caso de erro
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
        setServices(exampleServices);
        setFilteredServices(exampleServices);
      } else {
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
          setServices(exampleServices);
          setFilteredServices(exampleServices);
        } else {
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

          setServices(transformedServices);
          setFilteredServices(transformedServices);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro geral, usar dados de exemplo
      const defaultCategories = [
        { id: 1, name: "Limpeza", icon: "🧹", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "Reparos", icon: "🔧", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "Beleza", icon: "💄", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];
      setCategories(defaultCategories);
      
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
        }
      ];
      setServices(exampleServices);
      setFilteredServices(exampleServices);
    } finally {
      setIsLoading(false);
    }
  };

  const filterServicesByCategory = (categoryIdStr: string) => {
    if (categoryIdStr === "all") {
      setFilteredServices(services);
    } else {
      const categoryIdNumber = parseInt(categoryIdStr);
      const filtered = services.filter(service => service.categoryId === categoryIdNumber);
      setFilteredServices(filtered);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      filterServicesByCategory(activeCategory);
      return;
    }
    
    const results = services.filter(service =>
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(results);
  };

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    filterServicesByCategory(value);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Serviços Disponíveis</h1>
        {isDemoMode && (
          <div className="text-sm text-muted-foreground">Modo Demo Ativo</div>
        )}
      </div>
      
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={handleCategoryChange} className="mb-8">
        <ScrollArea className="w-full">
          <TabsList className="flex flex-nowrap mb-4 w-max min-w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id.toString()}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>
        
        <TabsContent value={activeCategory}>
          <ServiceList 
            services={filteredServices} 
            emptyMessage={
              filteredServices.length === 0 && services.length > 0
                ? "Nenhum serviço encontrado para esta busca."
                : "Nenhum serviço encontrado. Os serviços aparecerão aqui quando forem cadastrados e aprovados."
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesListPage;
