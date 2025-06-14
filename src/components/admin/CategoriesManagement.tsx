
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
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
import SimpleCategoryFormDialog from "./SimpleCategoryFormDialog";
import { useState } from "react";
import { useCategoriesManager } from "./useCategoriesManager";
import SortableCategoryItem from "./SortableCategoryItem";

const CategoriesManagement = () => {
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  } = useCategoriesManager();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((cat) => cat.id === active.id);
    const newIndex = categories.findIndex((cat) => cat.id === over.id);
    const newCategories = arrayMove(categories, oldIndex, newIndex);
    reorderCategories(newCategories);
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
        <CardTitle>Gerenciar Categorias</CardTitle>
        <CardDescription>
          Adicione, edite ou reorganize as categorias de serviços. Arraste para reordenar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <button
          onClick={() => setShowAddDialog(true)}
          className="mb-4 bg-primary text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </button>
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
                    onDelete={deleteCategory}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <SimpleCategoryFormDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSubmit={async (name, icon) => {
            await addCategory(name, icon);
            setShowAddDialog(false);
          }}
          title="Adicionar Nova Categoria"
        />

        {editingCategory && (
          <SimpleCategoryFormDialog
            isOpen={true}
            onClose={() => setEditingCategory(null)}
            onSubmit={async (name, icon) => {
              await updateCategory(editingCategory.id, name, icon);
              setEditingCategory(null);
            }}
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
