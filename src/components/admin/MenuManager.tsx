
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Move, Pencil, Save } from "lucide-react";
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
  onUpdateMenuItemPath
}: MenuManagerProps) => {
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [editPathId, setEditPathId] = useState<number | null>(null);
  const [editedPath, setEditedPath] = useState<string>("");

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

  const handleEditPath = (id: number, currentPath: string) => {
    setEditPathId(id);
    setEditedPath(currentPath);
  };

  const handleSavePath = (id: number) => {
    if (!editedPath.trim().startsWith("/")) {
      toast.error("The path must start with '/'");
      return;
    }
    if (onUpdateMenuItemPath) {
      onUpdateMenuItemPath(id, editedPath.trim());
      // Update on localStorage
      const updatedItems = menuItems.map(item =>
        item.id === id ? { ...item, path: editedPath.trim() } : item
      );
      localStorage.setItem("menuItemsOrder", JSON.stringify(updatedItems));
      toast.success("Menu link updated!");
    }
    setEditPathId(null);
    setEditedPath("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>
          Customize and reorder the site menu options. You can also edit the link (path) for each menu item.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                  <span className="font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">
                    ({item.path})
                  </span>
                  {editPathId === item.id ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        handleSavePath(item.id);
                      }}
                    >
                      <input
                        className="ml-2 px-2 py-1 border rounded text-xs w-36"
                        value={editedPath}
                        autoFocus
                        onChange={e => setEditedPath(e.target.value)}
                        onBlur={() => setEditPathId(null)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        type="submit"
                        title="Save"
                        className="ml-1"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditPath(item.id, item.path)}
                      title="Edit path"
                      className="ml-2"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
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
