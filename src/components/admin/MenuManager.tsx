import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import MenuManagerItem from "./MenuManagerItem";
import MenuManagerAddForm from "./MenuManagerAddForm";
import { Save } from "lucide-react";
import { MenuItem } from "@/hooks/useSupabaseMenuItems";

interface MenuManagerProps {
  menuItems: MenuItem[];
  isLoading?: boolean;
  showRecommendationsMenu: boolean;
  onToggleMenuItem: (id: number, visible: boolean) => void;
  onToggleRecommendations: () => void;
  onReorderMenuItems?: (items: MenuItem[]) => void;
  onAddMenuItem?: (item: Omit<MenuItem, "id" | "created_at" | "updated_at">) => void;
  onUpdateMenuItem?: (id: number, patch: Partial<MenuItem>) => void;
  onDeleteMenuItem?: (id: number) => void;
}

const REQUIRED_BUTTONS = [
  { label: "Encontrar Serviços", path: "/services" },
  { label: "Oferecer Serviço", path: "/services/new" },
  { label: "Cadastrar Casa", path: "/properties/new" }
];

const MenuManager = ({
  menuItems,
  isLoading,
  showRecommendationsMenu,
  onToggleMenuItem,
  onToggleRecommendations,
  onReorderMenuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: MenuManagerProps) => {
  // Local editável para alteração temporária de ordem
  const [pendingMenuItems, setPendingMenuItems] = useState<MenuItem[]>(menuItems);

  // Sincroniza na entrada
  useEffect(() => {
    setPendingMenuItems(menuItems);
  }, [menuItems]);

  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editedLabel, setEditedLabel] = useState<string>("");
  const [editedPath, setEditedPath] = useState<string>("");

  // Novo estado para adicionar menus
  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuPath, setNewMenuPath] = useState("");

  const handleDragStart = (id: number) => setDraggedItemId(id);
  const handleDragEnd = () => setDraggedItemId(null);

  const handleDrop = (toId: number) => {
    if (draggedItemId === null || draggedItemId === toId) return;
    const fromIdx = pendingMenuItems.findIndex(item => item.id === draggedItemId);
    const toIdx = pendingMenuItems.findIndex(item => item.id === toId);
    const reordered = [...pendingMenuItems];
    const [movedItem] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, movedItem);
    setPendingMenuItems(reordered);
    setDraggedItemId(null);
    toast.info("Ordem alterada, clique em Salvar para publicar.");
  };

  const handleToggleItem = (id: number, visible: boolean) => {
    setPendingMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, visible } : item
      )
    );
    toast.info("Visibilidade alterada, clique em Salvar para publicar.");
  };

  const handleToggleRecommendations = () => {
    onToggleRecommendations();
    localStorage.setItem("showRecommendationsMenu", JSON.stringify(!showRecommendationsMenu));
    toast.success(`Recommendations menu ${!showRecommendationsMenu ? "enabled" : "disabled"}`);
  };

  const handleEdit = (id: number, currentLabel: string, currentPath: string) => {
    setEditId(id);
    setEditedLabel(currentLabel);
    setEditedPath(currentPath);
  };

  const handleSaveEdit = (id: number, label: string, path: string) => {
    if (!label.trim()) {
      toast.error("O nome do menu não pode ser vazio!");
      return;
    }
    if (!path.trim().startsWith("/")) {
      toast.error("O link deve começar com '/'");
      return;
    }
    if (
      pendingMenuItems.some(
        (item) => item.id !== id && item.path.toLowerCase() === path.trim().toLowerCase()
      )
    ) {
      toast.error("Já existe um menu com esse link!");
      return;
    }

    setPendingMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, label: label.trim(), path: path.trim() } : item
      )
    );
    toast.info("Alteração feita, clique em Salvar para publicar.");
    setEditId(null);
    setEditedLabel("");
    setEditedPath("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditedLabel("");
    setEditedPath("");
  };

  const handleUpdateEdited = (label: string, path: string) => {
    setEditedLabel(label);
    setEditedPath(path);
  };

  // Adicionar novo menu
  const handleAddNewMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuLabel.trim()) {
      toast.error("O nome do menu é obrigatório!");
      return;
    }
    if (!newMenuPath.trim().startsWith("/")) {
      toast.error("O link deve começar com '/'");
      return;
    }
    if (
      pendingMenuItems.some(
        (item) =>
          item.label.toLowerCase() === newMenuLabel.trim().toLowerCase() ||
          item.path.toLowerCase() === newMenuPath.trim().toLowerCase()
      )
    ) {
      toast.error("Já existe um menu com esse nome ou link!");
      return;
    }
    const nextOrder =
      pendingMenuItems.length > 0
        ? Math.max(...pendingMenuItems.map((i) => i.display_order ?? 0)) + 1
        : 0;
    const newItem: MenuItem = {
      id: -1, // id só será definido após salvar no Supabase
      label: newMenuLabel.trim(),
      path: newMenuPath.trim(),
      visible: true,
      display_order: nextOrder,
      created_at: null,
      updated_at: null,
    };
    setPendingMenuItems((prev) => [...prev, newItem]);
    toast.info("Menu adicionado, clique em Salvar para publicar.");
    setNewMenuLabel("");
    setNewMenuPath("");
  };

  // Agora só mostra o que for do pendingMenuItems (nada de botões obrigatórios)
  const allMenuItems = pendingMenuItems;

  // Salva no Supabase
  const handleSaveMenuChanges = async () => {
    if (onReorderMenuItems) {
      // Antes: corrige ids falsos (-1) para não mandar com id undefined para Supabase
      const itemsToSave = pendingMenuItems.map((item, idx) => ({
        ...item,
        display_order: idx,
        id: typeof item.id === "number" && item.id > 0 ? item.id : undefined,
      }));
      await onReorderMenuItems(itemsToSave as MenuItem[]);
      toast.success("Menu publicado no site via Supabase!");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>
          Edite nome, link, adicione ou remova itens do menu abaixo. Agora sincronizado com Supabase.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">Carregando menus...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-row-reverse">
              <Button variant="default" onClick={handleSaveMenuChanges} className="ml-auto flex gap-2">
                <Save className="w-4 h-4" />
                Salvar
              </Button>
            </div>
            <MenuManagerAddForm
              newMenuLabel={newMenuLabel}
              newMenuPath={newMenuPath}
              setNewMenuLabel={setNewMenuLabel}
              setNewMenuPath={setNewMenuPath}
              handleAddNewMenu={handleAddNewMenu}
            />
            {/* Lista de menus existentes */}
            {allMenuItems.map((item) => (
              <MenuManagerItem
                key={item.id}
                item={item}
                editId={editId}
                isDragging={draggedItemId === item.id}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                onEdit={handleEdit}
                onSave={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onUpdateEdited={handleUpdateEdited}
                editedLabel={editedLabel}
                editedPath={editedPath}
                onToggleItem={handleToggleItem}
              />
            ))}
            {/* Recomendações */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Recommendations Menu</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      The recommendations menu allows you to add services from people who don't live in the condominium.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current status: {showRecommendationsMenu ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Button
                    variant={showRecommendationsMenu ? "outline" : "default"}
                    onClick={handleToggleRecommendations}
                  >
                    {showRecommendationsMenu ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MenuManager;
