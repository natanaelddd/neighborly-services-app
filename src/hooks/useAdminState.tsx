
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Service {
  id: number;
  unit_id: string;
  category_id: number | null;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  categories?: {
    name: string;
    icon: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export const useAdminState = () => {
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
    { id: 1, label: "Início", path: "/", visible: true },
    { id: 2, label: "Categorias", path: "/categories", visible: true },
    { id: 3, label: "Sobre", path: "/about", visible: true },
    { id: 4, label: "Contato", path: "/contact", visible: true },
    { id: 5, label: "Indicações", path: "/recommendations", visible: false },
  ]);

  useEffect(() => {
    fetchData();
    
    // Check if recommendations menu is enabled
    const storedShowRecommendations = localStorage.getItem("showRecommendationsMenu");
    if (storedShowRecommendations) {
      setShowRecommendationsMenu(JSON.parse(storedShowRecommendations));
    }
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

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
      } else {
        setServices(servicesData || []);
      }

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Erro ao buscar categorias:', categoriesError);
        toast.error("Erro ao carregar categorias");
      } else {
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
    fetchData
  };
};
