import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Admin component imports
import PendingServices from "@/components/admin/PendingServices";
import AllServices from "@/components/admin/AllServices";
import CategoriesManagement from "@/components/admin/CategoriesManagement"; 
import FeaturedAdEditor from "@/components/admin/FeaturedAdEditor";
import MenuManager from "@/components/admin/MenuManager";
import RecommendationsManager from "@/components/admin/RecommendationsManager";
import AdminsManager from "@/components/admin/AdminsManager";
import PropertiesManagement from "@/components/admin/PropertiesManagement";

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

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
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

  // Service management functions
  const handleApprove = async (serviceId: number) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao aprovar serviço:', error);
        toast.error("Erro ao aprovar serviço");
        return;
      }

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, status: "approved" } : service
      ));
      toast.success("Serviço aprovado com sucesso!");
    } catch (error) {
      console.error('Erro ao aprovar serviço:', error);
      toast.error("Erro ao aprovar serviço");
    }
  };

  const handleReject = async (serviceId: number) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao rejeitar serviço:', error);
        toast.error("Erro ao rejeitar serviço");
        return;
      }

      setServices(services.map(service => 
        service.id === serviceId ? { ...service, status: "rejected" } : service
      ));
      toast.success("Serviço rejeitado!");
    } catch (error) {
      console.error('Erro ao rejeitar serviço:', error);
      toast.error("Erro ao rejeitar serviço");
    }
  };

  // Admin management functions
  const handleAddAdmin = (email: string) => {
    setAdmins([...admins, email]);
    toast.success("Administrador adicionado com sucesso!");
  };

  const handleRemoveAdmin = (email: string) => {
    setAdmins(admins.filter(admin => admin !== email));
    toast.success("Administrador removido com sucesso!");
  };

  // Category management functions
  const handleAddCategory = async (newCategoryData: Omit<Category, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryData.name,
          icon: newCategoryData.icon
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar categoria:', error);
        toast.error("Erro ao adicionar categoria");
        return;
      }

      setCategories([...categories, data]);
      toast.success("Categoria adicionada com sucesso!");
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error("Erro ao adicionar categoria");
    }
  };

  const handleUpdateCategory = async (id: number, updatedCategoryData: Omit<Category, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: updatedCategoryData.name,
          icon: updatedCategoryData.icon,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        toast.error("Erro ao atualizar categoria");
        return;
      }

      setCategories(categories.map(category => 
        category.id === id ? data : category
      ));
      toast.success("Categoria atualizada com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover categoria:', error);
        toast.error("Erro ao remover categoria");
        return;
      }

      setCategories(categories.filter(category => category.id !== id));
      toast.success("Categoria removida com sucesso!");
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      toast.error("Erro ao remover categoria");
    }
  };

  // Service update function
  const handleUpdateService = async (serviceId: number, updatedData: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          ...updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) {
        console.error('Erro ao atualizar serviço:', error);
        toast.error("Erro ao atualizar serviço");
        return;
      }

      // Atualizar o estado local
      setServices(services.map(service => 
        service.id === serviceId ? { ...service, ...updatedData } : service
      ));
      toast.success("Serviço atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error("Erro ao atualizar serviço");
    }
  };

  // Featured properties management
  const handleSaveFeaturedProperties = (newProperties: typeof featuredProperties) => {
    setFeaturedProperties(newProperties);
    toast.success("Propriedades em destaque atualizadas com sucesso!");
  };

  // Menu management functions
  const toggleMenuItem = (id: number, visible: boolean) => {
    const updatedMenuItems = menuItems.map(item => 
      item.id === id ? { ...item, visible } : item
    );
    setMenuItems(updatedMenuItems);
    toast.success(`Menu ${visible ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const toggleRecommendationsMenu = () => {
    const newValue = !showRecommendationsMenu;
    setShowRecommendationsMenu(newValue);
    localStorage.setItem("showRecommendationsMenu", JSON.stringify(newValue));
    
    // Update menu items visibility
    const updatedMenuItems = menuItems.map(item => 
      item.label === "Indicações" ? { ...item, visible: newValue } : item
    );
    setMenuItems(updatedMenuItems);
    
    toast.success(newValue 
      ? "Menu de Indicações ativado! Será visível no site." 
      : "Menu de Indicações desativado! Não será visível no site."
    );
  };

  if (!isAdmin) {
    return (
      <div className="container-custom py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Acesso Restrito</h1>
          <p className="mb-6 text-gray-600">
            Esta página é exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador - Condo Indico</h1>
      
      <Tabs defaultValue="pending-services">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="pending-services">Serviços Pendentes</TabsTrigger>
          <TabsTrigger value="all-services">Todos Serviços</TabsTrigger>
          <TabsTrigger value="properties">Propriedades</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="featured-ad">Propriedades em Destaque</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="recommendations">Indicações</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>

        {/* Serviços Pendentes */}
        <TabsContent value="pending-services">
          <PendingServices 
            services={services}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
        
        {/* Todos Serviços */}
        <TabsContent value="all-services">
          <AllServices 
            services={services}
            categories={categories}
            isLoading={isLoading}
            onUpdateService={handleUpdateService}
          />
        </TabsContent>
        
        {/* Propriedades */}
        <TabsContent value="properties">
          <PropertiesManagement />
        </TabsContent>
        
        {/* Categorias */}
        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>
        
        {/* Propriedades em Destaque */}
        <TabsContent value="featured-ad">
          <FeaturedAdEditor 
            properties={featuredProperties}
            onSave={handleSaveFeaturedProperties}
          />
        </TabsContent>
        
        {/* Menu */}
        <TabsContent value="menu">
          <MenuManager
            menuItems={menuItems}
            showRecommendationsMenu={showRecommendationsMenu}
            onToggleMenuItem={toggleMenuItem}
            onToggleRecommendations={toggleRecommendationsMenu}
          />
        </TabsContent>
        
        {/* Indicações */}
        <TabsContent value="recommendations">
          <RecommendationsManager
            showRecommendationsMenu={showRecommendationsMenu}
            onToggleRecommendations={toggleRecommendationsMenu}
          />
        </TabsContent>
        
        {/* Administradores */}
        <TabsContent value="admins">
          <AdminsManager
            admins={admins}
            onAddAdmin={handleAddAdmin}
            onRemoveAdmin={handleRemoveAdmin}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
