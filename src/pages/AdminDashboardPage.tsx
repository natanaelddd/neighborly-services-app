
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminState } from "@/hooks/useAdminState";
import { useAdminHandlers } from "@/components/admin/AdminHandlers";
import ServiceManager from "@/components/admin/ServiceManager";
import DemoModeToggle from "@/components/DemoModeToggle";

// Admin component imports
import PendingServices from "@/components/admin/PendingServices";
import AllServices from "@/components/admin/AllServices";
import CategoriesManagement from "@/components/admin/CategoriesManagement"; 
import FeaturedAdEditor from "@/components/admin/FeaturedAdEditor";
import MenuManager from "@/components/admin/MenuManager";
import RecommendationsManager from "@/components/admin/RecommendationsManager";
import AdminsManager from "@/components/admin/AdminsManager";
import PropertiesManagement from "@/components/admin/PropertiesManagement";

const AdminDashboardPage = () => {
  const { isAdmin } = useAuth();
  const {
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
    menuItems,
    setMenuItems,
    showRecommendationsMenu,
    setShowRecommendationsMenu
  });

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
      <h1 className="text-3xl font-bold mb-6">
        Painel do Administrador - Condo Indico
        {isDemoMode && <span className="text-sm font-normal text-blue-600 ml-2">(Modo Demonstração)</span>}
      </h1>
      
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
            onApprove={serviceManager.handleApprove}
            onReject={serviceManager.handleReject}
          />
        </TabsContent>
        
        {/* Todos Serviços */}
        <TabsContent value="all-services">
          <AllServices 
            services={services}
            categories={categories}
            isLoading={isLoading}
            onUpdateService={serviceManager.handleUpdateService}
          />
        </TabsContent>
        
        {/* Propriedades */}
        <TabsContent value="properties">
          <PropertiesManagement />
        </TabsContent>
        
        {/* Categorias */}
        <TabsContent value="categories">
          <Categories

Management />
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

      <DemoModeToggle />
    </div>
  );
};

export default AdminDashboardPage;
