import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Move, Pencil, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import MenuManagerItem from "./MenuManagerItem";
import MenuManagerAddForm from "./MenuManagerAddForm";

interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

interface MenuManagerProps {
  menuItems: MenuItem[];
  showRecommendationsMenu: boolean;
  onToggleMenuItem: (id: number, visible: boolean) => void;
  onToggleRecommendations: () => void;
  onReorderMenuItems?: (items: MenuItem[]) => void;
  onUpdateMenuItemPath?: (id: number, newPath: string) => void;
}

const REQUIRED_BUTTONS = [
  { label: "Encontrar Serviços", path: "/services" },
  { label: "Oferecer Serviço", path: "/services/new" },
  { label: "Cadastrar Casa", path: "/properties/new" }
];

const MenuManager = ({
  menuItems,
  showRecommendationsMenu,
  onToggleMenuItem,
  onToggleRecommendations,
  onReorderMenuItems,
}: MenuManagerProps) => {
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
    const fromIdx = menuItems.findIndex(item => item.id === draggedItemId);
    const toIdx = menuItems.findIndex(item => item.id === toId);
    const reordered = [...menuItems];
    const [movedItem] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, movedItem);
    if (onReorderMenuItems) onReorderMenuItems(reordered);

    localStorage.setItem("menuItemsOrder", JSON.stringify(reordered));
    toast.success("Menu order updated!");
    setDraggedItemId(null);
  };

  const handleToggleItem = (id: number, visible: boolean) => {
    onToggleMenuItem(id, visible);

    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, visible } : item
    );
    localStorage.setItem("menuItemsOrder", JSON.stringify(updatedItems));
    toast.success(
      `Menu "${updatedItems.find(i => i.id === id)?.label}" ${
        visible ? "enabled" : "disabled"
      }`
    );
  };

  const handleToggleRecommendations = () => {
    onToggleRecommendations();
    localStorage.setItem(
      "showRecommendationsMenu",
      JSON.stringify(!showRecommendationsMenu)
    );
    toast.success(
      `Recommendations menu ${
        !showRecommendationsMenu ? "enabled" : "disabled"
      }`
    );
  };

  const handleEdit = (id: number, currentLabel: string, currentPath: string) => {
    setEditId(id);
    setEditedLabel(currentLabel);
    setEditedPath(currentPath);
  };

  const handleSave = (id: number, label: string, path: string) => {
    if (!label.trim()) {
      toast.error("O nome do menu não pode ser vazio!");
      return;
    }
    if (!path.trim().startsWith("/")) {
      toast.error("O link deve começar com '/'");
      return;
    }
    // Validar unicidade de path, exceto para o próprio
    if (
      menuItems.some(
        (item) => item.id !== id && item.path.toLowerCase() === path.trim().toLowerCase()
      )
    ) {
      toast.error("Já existe um menu com esse link!");
      return;
    }

    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, label: label.trim(), path: path.trim() } : item
    );
    localStorage.setItem("menuItemsOrder", JSON.stringify(updatedItems));
    if (onReorderMenuItems) onReorderMenuItems(updatedItems);

    toast.success("Menu atualizado!");
    setEditId(null);
    setEditedLabel("");
    setEditedPath("");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setEditedLabel("");
    setEditedPath("");
  };

  // Para edição controlada
  const handleUpdateEdited = (label: string, path: string) => {
    setEditedLabel(label);
    setEditedPath(path);
  };

  // ADICIONAR NOVO MENU
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
    // Prevê duplicidade inclusive com REQUIRED_BUTTONS
    if (
      allMenuItems.some(item => item.label.toLowerCase() === newMenuLabel.trim().toLowerCase())
    ) {
      toast.error("Já existe um menu com esse nome!");
      return;
    }
    if (
      allMenuItems.some(item => item.path.toLowerCase() === newMenuPath.trim().toLowerCase())
    ) {
      toast.error("Já existe um menu com esse link!");
      return;
    }
    const newItem: MenuItem = {
      id: Math.max(...allMenuItems.map(i => i.id)) + 1,
      label: newMenuLabel.trim(),
      path: newMenuPath.trim(),
      visible: true,
    };
    const updated = [...menuItems, newItem];
    if (onReorderMenuItems) onReorderMenuItems(updated);
    localStorage.setItem("menuItemsOrder", JSON.stringify(updated));
    toast.success("Novo menu adicionado!");
    setNewMenuLabel("");
    setNewMenuPath("");
  };

  // Garante que os botões obrigatórios estejam sempre disponíveis
  const allMenuItems = [
    ...menuItems,
    ...REQUIRED_BUTTONS.filter(
      btn => !menuItems.some(item => item.path === btn.path)
    ).map((btn, i) => ({
      id: Math.max(0, ...menuItems.map(it => it.id)) + i + 1,
      label: btn.label,
      path: btn.path,
      visible: true
    }))
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>
          Edite nome e link de cada botão separadamente, incluindo “Encontrar Serviços”, “Oferecer Serviço” e “Cadastrar Casa” que aparecerão na tela inicial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Adicionar novo menu */}
          <MenuManagerAddForm
            newMenuLabel={newMenuLabel}
            newMenuPath={newMenuPath}
            setNewMenuLabel={setNewMenuLabel}
            setNewMenuPath={setNewMenuPath}
            handleAddNewMenu={handleAddNewMenu}
          />
          {/* Lista de menus existentes, incluindo obrigatórios se não estavam listados ainda */}
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
              onSave={handleSave}
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
      </CardContent>
    </Card>
  );
};

export default MenuManager;
