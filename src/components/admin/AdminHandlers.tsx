
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface AdminHandlersProps {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  admins: string[];
  setAdmins: (admins: string[]) => void;
  featuredProperties: any[];
  setFeaturedProperties: (properties: any[]) => void;
  menuItems: any[];
  setMenuItems: (items: any[]) => void;
  showRecommendationsMenu: boolean;
  setShowRecommendationsMenu: (show: boolean) => void;
}

export const useAdminHandlers = ({
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
}: AdminHandlersProps) => {
  
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

  return {
    handleAddAdmin,
    handleRemoveAdmin,
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleSaveFeaturedProperties,
    toggleMenuItem,
    toggleRecommendationsMenu
  };
};
