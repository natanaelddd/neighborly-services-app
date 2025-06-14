
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Move, Pencil, Save, Plus } from "lucide-react";
import { toast } from "sonner";

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

  const handleSave = (id: number) => {
    if (!editedLabel.trim()) {
      toast.error("O nome do menu não pode ser vazio!");
      return;
    }
    if (!editedPath.trim().startsWith("/")) {
      toast.error("O link deve começar com '/'");
      return;
    }
    // Validar unicidade de path, exceto para o próprio
    if (
      menuItems.some(
        (item) => item.id !== id && item.path.toLowerCase() === editedPath.trim().toLowerCase()
      )
    ) {
      toast.error("Já existe um menu com esse link!");
      return;
    }

    const updatedItems = menuItems.map(item =>
      item.id === id ? { ...item, label: editedLabel.trim(), path: editedPath.trim() } : item
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
    if (menuItems.some(item => item.label.toLowerCase() === newMenuLabel.trim().toLowerCase())) {
      toast.error("Já existe um menu com esse nome!");
      return;
    }
    if (menuItems.some(item => item.path.toLowerCase() === newMenuPath.trim().toLowerCase())) {
      toast.error("Já existe um menu com esse link!");
      return;
    }
    const newItem: MenuItem = {
      id: Math.max(...menuItems.map(i => i.id)) + 1,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>
          Edit menu options (name and link separately), toggle visibility, reorder and <span className="font-semibold">add new menus</span>. These changes will be reflected on the site navigation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">

          {/* Adicionar novo menu */}
          <form
            onSubmit={handleAddNewMenu}
            className="flex flex-col sm:flex-row gap-2 items-start sm:items-center border mb-4 p-3 rounded-lg bg-muted/40"
          >
            <input
              className="px-2 py-1 border rounded text-xs w-32"
              value={newMenuLabel}
              onChange={e => setNewMenuLabel(e.target.value)}
              placeholder="Nome do menu"
              required
            />
            <input
              className="px-2 py-1 border rounded text-xs w-36"
              value={newMenuPath}
              onChange={e => setNewMenuPath(e.target.value)}
              placeholder="/link"
              required
            />
            <Button type="submit" size="sm" className="flex gap-1" title="Adicionar menu">
              <Plus className="h-4 w-4" /> Adicionar
            </Button>
          </form>

          {/* Lista de menus existentes */}
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-move ${
                draggedItemId === item.id ? "opacity-50" : ""
              }`}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragEnd={handleDragEnd}
              onDragOver={e => {
                e.preventDefault();
              }}
              onDrop={() => handleDrop(item.id)}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <div className="flex items-center gap-2">
                  <Move className="h-4 w-4 text-gray-500" />
                  {editId === item.id ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSave(item.id);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        className="px-2 py-1 border rounded text-xs w-28"
                        value={editedLabel}
                        autoFocus
                        onChange={e => setEditedLabel(e.target.value)}
                        placeholder="Menu name"
                      />
                      <input
                        className="px-2 py-1 border rounded text-xs w-36"
                        value={editedPath}
                        onChange={e => setEditedPath(e.target.value)}
                        placeholder="/link"
                      />
                      <Button size="icon" variant="ghost" type="submit" title="Save" className="ml-1">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" type="button" onClick={handleCancelEdit} title="Cancel">
                        ✕
                      </Button>
                    </form>
                  ) : (
                    <>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
                        ({item.path})
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(item.id, item.label, item.path)}
                        title="Edit menu item"
                        className="ml-2"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.visible ? "default" : "outline"}>
                  {item.visible ? "Visible" : "Hidden"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleItem(item.id, !item.visible)}
                  disabled={item.label === "Home"}
                  title={item.visible ? "Hide" : "Show"}
                >
                  {item.visible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
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

