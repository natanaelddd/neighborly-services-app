
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import IconSelector from "./IconSelector";

interface Category {
  id: number;
  name: string;
  icon: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface CategoryFormDialogProps {
  categories: Category[];
  editingCategory: Category | null;
  isDialogOpen: boolean;
  onDialogOpenChange: (open: boolean) => void;
  onCategoryChange: () => void;
  onEditingCategoryChange: (category: Category | null) => void;
}

const CategoryFormDialog = ({ 
  categories, 
  editingCategory, 
  isDialogOpen, 
  onDialogOpenChange, 
  onCategoryChange,
  onEditingCategoryChange 
}: CategoryFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "📋"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    try {
      if (editingCategory) {
        // Editar categoria existente
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name.trim(),
            icon: formData.icon,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success("Categoria atualizada com sucesso!");
      } else {
        // Criar nova categoria
        const maxOrder = Math.max(...categories.map(c => c.display_order || 0), 0);
        
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.name.trim(),
            icon: formData.icon,
            display_order: maxOrder + 1
          });

        if (error) throw error;
        toast.success("Categoria criada com sucesso!");
      }

      setFormData({ name: "", icon: "📋" });
      onEditingCategoryChange(null);
      onDialogOpenChange(false);
      onCategoryChange();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      toast.error("Erro ao salvar categoria");
    }
  };

  const openCreateDialog = () => {
    onEditingCategoryChange(null);
    setFormData({ name: "", icon: "📋" });
    onDialogOpenChange(true);
  };

  const handleEdit = (category: Category) => {
    onEditingCategoryChange(category);
    setFormData({
      name: category.name,
      icon: category.icon
    });
    onDialogOpenChange(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
          <DialogDescription>
            {editingCategory 
              ? 'Edite as informações da categoria' 
              : 'Preencha as informações para criar uma nova categoria'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Categoria *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Limpeza, Manutenção, etc."
              required
            />
          </div>

          <IconSelector
            selectedIcon={formData.icon}
            onIconSelect={(icon) => setFormData({...formData, icon})}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onDialogOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingCategory ? 'Atualizar' : 'Criar'} Categoria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
export { handleEdit };
