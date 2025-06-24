
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ServiceWithProvider, Category } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "@/hooks/useDemoMode";

export const useServicesListPage = () => {
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
        setCategories([]);
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
        setFilteredServices([]);
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
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setServices([]);
      setFilteredServices([]);
      setCategories([]);
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

  return {
    services,
    categories,
    filteredServices,
    activeCategory,
    isLoading,
    isDemoMode,
    handleSearch,
    handleCategoryChange
  };
};
