
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";
import { 
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CategoryFormDialog from "./CategoryFormDialog";
import IconSelector from "./IconSelector";
import { useDemoMode } from "@/hooks/useDemoMode";

interface SortableCategoryItemProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

const SortableCategoryItem = ({ category, onEdit, onDelete }: SortableCategoryItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border rounded-lg bg-white"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-lg">{category.icon}</span>
        <span className="font-medium">{category.name}</span>
      </div>
      
      <div className="ml-auto flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const CategoriesManagement = () => {
  const { isDemoMode } = useDemoMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    if (isDemoMode) {
      // Mock data for demo mode
      const mockCategories: Category[] = [
        { id: 1, name: "Limpeza", icon: "🧹", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "Reparos", icon: "🔧", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "Beleza", icon: "💄", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ];
      setCategories(mockCategories);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error("Erro ao carregar categorias");
        return;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);

    const newCategories = arrayMove(categories, oldIndex, newIndex);
    setCategories(newCategories);

    if (!isDemoMode) {
      // Update display_order in database
      try {
        const updates = newCategories.map((category, index) => ({
          id: category.id,
          display_order: index
        }));

        for (const update of updates) {
          await supabase
            .from('categories')
            .update({ display_order: update.display_order })
            .eq('id', update.id);
        }

        toast.success("Ordem das categorias atualizada!");
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
        toast.error("Erro ao atualizar ordem das categorias");
        fetchCategories(); // Revert on error
      }
    }
  };

  const handleAddCategory = async (name: string, icon: string) => {
    if (isDemoMode) {
      const newCategory: Category = {
        id: Date.now(),
        name,
        icon,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setCategories([...categories, newCategory]);
      toast.success("Categoria adicionada com sucesso!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name,
          icon,
          display_order: categories.length
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar categoria:', error);
        toast.error("Erro ao adicionar categoria");
        return;
      }

      const newCategory: Category = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setCategories([...categories, newCategory]);
      toast.success("Categoria adicionada com sucesso!");
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error("Erro ao adicionar categoria");
    }
  };

  const handleUpdateCategory = async (id: number, name: string, icon: string) => {
    if (isDemoMode) {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name, icon, updated_at: new Date().toISOString() } : cat
      ));
      toast.success("Categoria atualizada com sucesso!");
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({ name, icon, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar categoria:', error);
        toast.error("Erro ao atualizar categoria");
        return;
      }

      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name, icon, updated_at: new Date().toISOString() } : cat
      ));
      toast.success("Categoria atualizada com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error("Erro ao atualizar categoria");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) {
      return;
    }

    if (isDemoMode) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success("Categoria removida com sucesso!");
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar categoria:', error);
        toast.error("Erro ao deletar categoria");
        return;
      }

      setCategories(categories.filter(cat => cat.id !== id));
      toast.success("Categoria removida com sucesso!");
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      toast.error("Erro ao deletar categoria");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Categorias {isDemoMode && <span className="text-sm font-normal text-blue-600">(Demo)</span>}</CardTitle>
        <CardDescription>
          Adicione, edite ou reorganize as categorias de serviços. Arraste para reordenar.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button
          onClick={() => setShowAddDialog(true)}
          className="mb-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>

        {categories.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            Nenhuma categoria cadastrada.
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={categories.map(cat => cat.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {categories.map((category) => (
                  <SortableCategoryItem
                    key={category.id}
                    category={category}
                    onEdit={setEditingCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <CategoryFormDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={handleAddCategory}
          title="Adicionar Nova Categoria"
        />

        {editingCategory && (
          <CategoryFormDialog
            isOpen={true}
            onClose={() => setEditingCategory(null)}
            onSubmit={(name, icon) => handleUpdateCategory(editingCategory.id, name, icon)}
            title="Editar Categoria"
            initialName={editingCategory.name}
            initialIcon={editingCategory.icon}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesManagement;
