
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash, PlusCircle, X } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types";
import IconSelector from "./IconSelector";

interface CategoriesManagementProps {
  categories: Category[];
  isLoading: boolean;
  onAddCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => void;
  onUpdateCategory: (id: number, category: Omit<Category, "id" | "created_at" | "updated_at">) => void;
  onDeleteCategory: (id: number) => void;
}

const CategoriesManagement = ({ 
  categories, 
  isLoading, 
  onAddCategory, 
  onUpdateCategory,
  onDeleteCategory 
}: CategoriesManagementProps) => {
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Função para renderizar ícone (emoji ou texto)
  const renderIcon = (icon: string) => {
    // Se for um emoji, retorna diretamente
    if (icon && icon.length <= 4 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(icon)) {
      return <span className="text-xl">{icon}</span>;
    }
    
    // Caso contrário, retorna como texto
    return <span className="text-sm bg-gray-100 px-2 py-1 rounded">{icon || '📦'}</span>;
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      await onAddCategory({
        name: newCategory.name.trim(),
        icon: newCategory.icon || '📦'
      });
      setNewCategory({ name: "", icon: "" });
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error("Erro ao adicionar categoria");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory({ ...category });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory?.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      await onUpdateCategory(editingCategory.id, {
        name: editingCategory.name.trim(),
        icon: editingCategory.icon || '📦'
      });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await onDeleteCategory(id);
      } catch (error) {
        console.error('Erro ao remover categoria:', error);
        toast.error("Erro ao remover categoria");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Gerencie as categorias de serviços disponíveis. Clique no ícone de editar para modificar uma categoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        {renderIcon(category.icon)}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Categoria</CardTitle>
            <CardDescription>
              Crie uma nova categoria de serviços.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <Label htmlFor="category-name">Nome da Categoria</Label>
                <Input
                  id="category-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Ex: Limpeza, Manutenção"
                  required
                />
              </div>
              
              <IconSelector
                selectedIcon={newCategory.icon}
                onIconSelect={(icon) => setNewCategory({...newCategory, icon})}
              />

              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Categoria
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Dialog para editar categoria */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Modifique o nome e ícone da categoria.
            </DialogDescription>
          </DialogHeader>
          
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <Label htmlFor="edit-category-name">Nome da Categoria</Label>
                <Input
                  id="edit-category-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                  placeholder="Ex: Limpeza, Manutenção"
                  required
                />
              </div>
              
              <IconSelector
                selectedIcon={editingCategory.icon}
                onIconSelect={(icon) => setEditingCategory({...editingCategory, icon})}
              />

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Edit className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoriesManagement;
