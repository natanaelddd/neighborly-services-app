
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "./useDemoMode";
import { Service, Category } from "@/types";

export const useAdminState = () => {
  const { isDemoMode, mockServices, mockCategories, mockProperties } = useDemoMode();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<string[]>(["admin@example.com"]);
  const [showRecommendationsMenu, setShowRecommendationsMenu] = useState(false);
  
  // State for featured properties management
  const [featuredProperties, setFeaturedProperties] = useState([
    {
      id: 1,
      title: "Evidence Resort - Seu novo lar",
      description: "Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis, projetadas para proporcionar qualidade de vida para você e sua família.",
      details: "Nossa plataforma exclusiva conecta os moradores do condomínio, permitindo que você encontre ou ofereça serviços dentro da nossa comunidade com facilidade e segurança.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "venda" as const,
      price: "A partir de R$ 450.000"
    },
    {
      id: 2,
      title: "Casa Moderna - Bloco 2",
      description: "Casa de 3 quartos com suíte, sala ampla, cozinha planejada e área gourmet. Localizada no Bloco 2 com vista privilegiada para a área verde do condomínio.",
      details: "Acabamento de primeira qualidade, garagem para 2 carros, jardim privativo e acesso direto à área de lazer do condomínio.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "venda" as const,
      price: "R$ 520.000"
    },
    {
      id: 3,
      title: "Casa para Locação - Bloco 4",
      description: "Oportunidade única de morar no Evidence Resort. Casa mobiliada de 2 quartos, ideal para casais ou pequenas famílias que buscam conforto e segurança.",
      details: "Inclui móveis planejados, ar condicionado, área de serviço completa e vaga de garagem coberta.",
      imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
      type: "aluguel" as const,
      price: "R$ 2.800/mês"
    }
  ]);

  // State for menu management
  const [menuItems, setMenuItems] = useState([
    { id: 1, label: "Home", path: "/", visible: true },
    { id: 2, label: "Services", path: "/services", visible: true },
    { id: 3, label: "Categories", path: "/categories", visible: true },
    { id: 4, label: "Properties", path: "/properties", visible: true },
    { id: 5, label: "Recommendations", path: "/recommendations", visible: true },
    { id: 6, label: "About", path: "/about", visible: true },
    { id: 7, label: "Contact", path: "/contact", visible: true }
  ]);

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
      setFeaturedProperties([...featuredProperties, ...mockProperties.filter(p => p.status === 'approved').map(p => ({
        id: p.id + 10,
        title: p.title,
        description: p.description,
        details: p.description,
        imageUrl: p.property_photos?.[0]?.photo_url || "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
        type: p.type,
        price: p.price || "Consulte preço"
      }))]);
      setIsLoading(false);
    } else {
      fetchData();
    }
    
    // Check if recommendations menu is enabled
    const storedShowRecommendations = localStorage.getItem("showRecommendationsMenu");
    if (storedShowRecommendations) {
      setShowRecommendationsMenu(JSON.parse(storedShowRecommendations));
    }
  }, [isDemoMode]);

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
    isDemoMode
  };
};
