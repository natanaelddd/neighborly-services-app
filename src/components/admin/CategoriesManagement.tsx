
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@/types";

interface CategoriesManagementProps {
  categories: Category[];
  isLoading: boolean;
  onAddCategory: (category: Omit<Category, "id" | "created_at" | "updated_at">) => void;
  onDeleteCategory: (id: number) => void;
}

const CategoriesManagement = ({ 
  categories, 
  isLoading, 
  onAddCategory, 
  onDeleteCategory 
}: CategoriesManagementProps) => {
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });

  // Função para renderizar ícone (emoji ou texto)
  const renderIcon = (icon: string) => {
    // Se for um emoji, retorna diretamente
    if (icon && icon.length <= 4 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(icon)) {
      return <span className="text-xl">{icon}</span>;
    }
    
    // Caso contrário, retorna como texto
    return <span className="text-sm bg-gray-100 px-2 py-1 rounded">{icon || '📦'}</span>;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    onAddCategory(newCategory);
    setNewCategory({ name: "", icon: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Categorias</CardTitle>
            <CardDescription>
              Gerencie as categorias de serviços disponíveis. Use emojis para os ícones (ex: 🧹, 🔧, 🌱).
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
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteCategory(category.id)}>
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
              Crie uma nova categoria de serviços. Use emojis para os ícones.
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
                />
              </div>
              <div>
                <Label htmlFor="category-icon">Ícone (emoji)</Label>
                <Input
                  id="category-icon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  placeholder="Ex: 🧹, 🔧, 🌱"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use emojis para melhor visualização. Exemplos: 🧹 🔧 🌱 👶 🍽️ 🚗 💻 📚 🏥 📦
                </p>
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Categoria
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesManagement;
