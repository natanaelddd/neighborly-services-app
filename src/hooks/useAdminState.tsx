
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "./useDemoMode";
import { Service, Category } from "@/types";

export const useAdminState = () => {
  const { isDemoMode, mockServices, mockCategories } = useDemoMode();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<string[]>(["admin@example.com"]);
  const [showRecommendationsMenu, setShowRecommendationsMenu] = useState(false);
  
  // State for featured properties management (now from database)
  const [featuredProperties, setFeaturedProperties] = useState([]);

  // State for menu management (removed - now handled by useSupabaseMenuItems)
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (isDemoMode) {
      // Transform mock services to match the Service interface from types/index.ts
      const transformedMockServices: Service[] = (mockServices as any[]).map(service => ({
        id: service.id,
        unitId: service.unit_id || service.unitId,
        categoryId: service.category_id || service.categoryId || 0,
        title: service.title,
        description: service.description,
        photoUrl: service.photo_url || service.photoUrl,
        whatsapp: service.whatsapp,
        status: service.status as 'pending' | 'approved' | 'rejected',
        rejectionReason: service.rejection_reason || service.rejectionReason,
        createdAt: service.created_at || service.createdAt,
        updatedAt: service.updated_at || service.updatedAt,
        block: service.block || '',
        house_number: service.house_number || '',
        category: service.category
      }));
      
      setServices(transformedMockServices);
      setCategories(mockCategories as Category[]);
      setIsLoading(false);
    } else {
      fetchData();
      fetchSystemSettings();
      fetchFeaturedProperties();
    }
  }, [isDemoMode]);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_key', 'showRecommendationsMenu')
        .single();

      if (!error && data) {
        setShowRecommendationsMenu(data.setting_value as boolean);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do sistema:', error);
    }
  };

  const fetchFeaturedProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const transformedProperties = data.map(prop => ({
          id: prop.id,
          title: prop.title,
          description: prop.description,
          details: prop.details,
          imageUrl: prop.image_url,
          type: prop.type as 'venda' | 'aluguel',
          price: prop.price || "Consulte preço"
        }));
        setFeaturedProperties(transformedProperties);
      }
    } catch (error) {
      console.error('Erro ao carregar propriedades em destaque:', error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('Iniciando carregamento dos dados...');

      // Buscar serviços com informações do usuário e categoria
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          categories:category_id (name, icon)
        `)
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
        toast.error("Erro ao carregar serviços");
        setServices([]);
      } else {
        console.log('Serviços carregados do banco:', servicesData?.length || 0);
        // Transform the Supabase data to match our Service interface from types/index.ts
        const transformedServices: Service[] = (servicesData || []).map(service => ({
          id: service.id,
          unitId: service.unit_id,
          categoryId: service.category_id || 0,
          title: service.title,
          description: service.description,
          photoUrl: service.photo_url || undefined,
          whatsapp: service.whatsapp,
          status: service.status as 'pending' | 'approved' | 'rejected',
          rejectionReason: undefined,
          createdAt: service.created_at,
          updatedAt: service.updated_at,
          block: service.block || service.profiles?.block || '',
          house_number: service.house_number || service.profiles?.house_number || '',
          // Add the category and unit relations if they exist
          category: service.categories ? {
            id: service.category_id || 0,
            name: service.categories.name,
            icon: service.categories.icon,
            created_at: '',
            updated_at: ''
          } : undefined
        }));
        
        console.log('Serviços transformados:', transformedServices.length);
        setServices(transformedServices);
      }

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
        toast.error("Erro ao carregar categorias");
        setCategories([]);
      } else {
        console.log('Categorias carregadas:', categoriesData?.length || 0);
        setCategories(categoriesData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error("Erro ao carregar dados do painel");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    services,
    setServices,
    categories,
    setCategories,
    isLoading,
    admins,
    setAdmins,
    showRecommendationsMenu,
    setShowRecommendationsMenu,
    featuredProperties,
    setFeaturedProperties,
    menuItems,
    setMenuItems,
    fetchData,
    fetchSystemSettings,
    fetchFeaturedProperties,
    isDemoMode
  };
};
