import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Service, Category } from "@/types";

// Admin component imports
import PendingServices from "@/components/admin/PendingServices";
import AllServices from "@/components/admin/AllServices";
import CategoriesManagement from "@/components/admin/CategoriesManagement"; 
import FeaturedAdEditor from "@/components/admin/FeaturedAdEditor";
import MenuManager from "@/components/admin/MenuManager";
import RecommendationsManager from "@/components/admin/RecommendationsManager";
import AdminsManager from "@/components/admin/AdminsManager";

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<string[]>(["admin@example.com"]);
  const [showRecommendationsMenu, setShowRecommendationsMenu] = useState(false);
  
  // State for featured properties management (replacing single featuredAd)
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
    // In a real app, this would fetch from a database
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock service data
      const mockServices: Service[] = [
        {
          id: 1,
          unitId: 1,
          categoryId: 1,
          title: "Limpeza Residencial",
          description: "Serviço de limpeza completa para residências",
          whatsapp: "16992701617",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          unitId: 2,
          categoryId: 2,
          title: "Encanador Profissional",
          description: "Reparos e instalações hidráulicas",
          whatsapp: "16992701617",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: 1,
          name: "Limpeza",
          icon: "🧹",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Manutenção",
          icon: "🔧",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setServices(mockServices);
      setCategories(mockCategories);
      setIsLoading(false);
    }, 1000);

    // Check if recommendations menu is enabled
    const storedShowRecommendations = localStorage.getItem("showRecommendationsMenu");
    if (storedShowRecommendations) {
      setShowRecommendationsMenu(JSON.parse(storedShowRecommendations));
    }
  }, []);

  // Service management functions
  const handleApprove = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, status: "approved" } : service
    ));
    toast.success("Serviço aprovado com sucesso!");
  };

  const handleReject = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, status: "rejected" } : service
    ));
    toast.success("Serviço rejeitado!");
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
  const handleAddCategory = (newCategoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    
    const category: Category = {
      id: newId,
      name: newCategoryData.name,
      icon: newCategoryData.icon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCategories([...categories, category]);
    toast.success("Categoria adicionada com sucesso!");
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    toast.success("Categoria removida com sucesso!");
  };

  // Featured properties management (replacing handleSaveFeaturedAd)
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
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Categorias */}
        <TabsContent value="categories">
          <CategoriesManagement 
            categories={categories}
            isLoading={isLoading}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
          />
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
