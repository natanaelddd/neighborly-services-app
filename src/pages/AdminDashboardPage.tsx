import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useAdminState } from "@/hooks/useAdminState";
import { useAdminHandlers } from "@/components/admin/AdminHandlers";
import ServiceManager from "@/components/admin/ServiceManager";
import PendingServices from "@/components/admin/PendingServices";
import AllServices from "@/components/admin/AllServices";
import CategoriesManagement from "@/components/admin/CategoriesManagement"; 
import FeaturedAdEditor from "@/components/admin/FeaturedAdEditor";
import MenuManager from "@/components/admin/MenuManager";
import RecommendationsManager from "@/components/admin/RecommendationsManager";
import AdminsManager from "@/components/admin/AdminsManager";
import PropertiesManagement from "@/components/admin/PropertiesManagement";
import { useSupabaseMenuItems } from "@/hooks/useSupabaseMenuItems";

const AdminDashboardPage = () => {
  const { isAdmin, user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    // Recuperar a aba ativa do sessionStorage ou usar padrão
    const savedTab = sessionStorage.getItem('admin-active-tab');
    return savedTab || 'pending-services';
  });

  console.log('AdminDashboardPage - Render with:', {
    isAdmin,
    user: user?.email,
    isLoading,
    activeTab
  });

  const {
    services,
    setServices,
    categories,
    setCategories,
    isLoading: stateLoading,
    admins,
    setAdmins,
    showRecommendationsMenu,
    setShowRecommendationsMenu,
    featuredProperties,
    setFeaturedProperties,
    isDemoMode
  } = useAdminState();

  const serviceManager = ServiceManager({ services, setServices });

  const {
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleSaveFeaturedProperties,
    toggleMenuItem,
    toggleRecommendationsMenu
  } = useAdminHandlers({
    categories,
    setCategories,
    admins,
    setAdmins,
    featuredProperties,
    setFeaturedProperties,
    // Não usamos menuItems nem setMenuItems do state local - agora só o Supabase é fonte de verdade!
    menuItems: [],
    setMenuItems: () => {},
    showRecommendationsMenu,
    setShowRecommendationsMenu
  });

  // SUPABASE MENU - agora é a fonte única!
  const {
    menuItems,
    isLoading: isMenuLoading,
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
  } = useSupabaseMenuItems();

  // Salvar a aba ativa no sessionStorage sempre que mudar
  useEffect(() => {
    sessionStorage.setItem('admin-active-tab', activeTab);
  }, [activeTab]);

  // Debug de carregamento
  useEffect(() => {
    console.log('AdminDashboardPage - Loading states:', {
      authLoading: isLoading,
      stateLoading,
      isMenuLoading,
      isAdmin,
      user: user?.email
    });
  }, [isLoading, stateLoading, isMenuLoading, isAdmin, user]);

  if (isLoading) {
    console.log('AdminDashboardPage - Auth still loading');
    return (
      <div className="container-custom py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <div className="ml-4 text-sm text-gray-600">Carregando painel administrativo...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('AdminDashboardPage - User is not admin');
    return (
      <div className="container-custom py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Acesso Restrito</h1>
          <p className="mb-6 text-gray-600">
            Esta página é exclusiva para administradores.
          </p>
          <p className="text-sm text-gray-500">
            Usuário atual: {user?.email || 'Não logado'}
          </p>
        </div>
      </div>
    );
  }

  console.log('AdminDashboardPage - Rendering admin dashboard');

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">
        Painel do Administrador - Condo Indico
        {isDemoMode && <span className="text-sm font-normal text-blue-600 ml-2">(Modo Demonstração)</span>}
      </h1>
      
      <div className="mb-4 text-sm text-gray-600">
        Bem-vindo, {user?.email}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Seção Principal - Serviços */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground px-3 py-1">SERVIÇOS</h3>
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                <TabsTrigger value="pending-services" className="w-full justify-start">
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="all-services" className="w-full justify-start">
                  Todos Serviços
                </TabsTrigger>
                <TabsTrigger value="categories" className="w-full justify-start">
                  Categorias
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Seção Propriedades */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground px-3 py-1">PROPRIEDADES</h3>
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                <TabsTrigger value="properties" className="w-full justify-start">
                  Gerenciar
                </TabsTrigger>
                <TabsTrigger value="featured-ad" className="w-full justify-start">
                  Em Destaque
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Seção Site */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground px-3 py-1">SITE</h3>
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                <TabsTrigger value="menu" className="w-full justify-start">
                  Menu
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="w-full justify-start">
                  Indicações
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Seção Administração */}
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground px-3 py-1">SISTEMA</h3>
              <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
                <TabsTrigger value="admins" className="w-full justify-start">
                  Administradores
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        {/* Serviços Pendentes */}
        <TabsContent value="pending-services">
          <PendingServices 
            services={services}
            isLoading={stateLoading}
            onApprove={serviceManager.handleApprove}
            onReject={serviceManager.handleReject}
          />
        </TabsContent>
        
        {/* Todos Serviços */}
        <TabsContent value="all-services">
          <AllServices 
            services={services}
            categories={categories}
            isLoading={stateLoading}
            onUpdateService={serviceManager.handleUpdateService}
            onDeleteService={serviceManager.handleDeleteService}
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
            isLoading={isMenuLoading}
            showRecommendationsMenu={showRecommendationsMenu}
            onToggleMenuItem={async (id: number, visible: boolean) => {
              await updateMenuItem(id, { visible });
              fetchMenuItems();
            }}
            onToggleRecommendations={toggleRecommendationsMenu}
            onReorderMenuItems={async (ordered) => {
              await reorderMenuItems(ordered);
              fetchMenuItems();
            }}
            onAddMenuItem={async (item) => {
              await addMenuItem(item);
              fetchMenuItems();
            }}
            onUpdateMenuItem={async (id, patch) => {
              await updateMenuItem(id, patch);
              fetchMenuItems();
            }}
            onDeleteMenuItem={async (id) => {
              await deleteMenuItem(id);
              fetchMenuItems();
            }}
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
