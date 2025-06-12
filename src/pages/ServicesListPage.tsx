
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ServiceWithProvider, Category } from "@/types";
import ServiceList from "@/components/ServiceList";
import SearchBar from "@/components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

const ServicesListPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceWithProvider[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);

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
      
      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
      } else {
        setCategories(categoriesData || []);
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
        setServices([]);
      } else {
        const transformedServices: ServiceWithProvider[] = (servicesData || []).map(service => ({
          id: service.id,
          unitId: 0,
          categoryId: service.category_id || 0,
          title: service.title,
          description: service.description,
          photoUrl: service.photo_url || '',
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

        setServices(transformedServices);
        setFilteredServices(transformedServices);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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
      <h1 className="text-3xl font-bold mb-6">Serviços Disponíveis</h1>
      
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
                : "Nenhum serviço disponível nesta categoria."
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServicesListPage;
