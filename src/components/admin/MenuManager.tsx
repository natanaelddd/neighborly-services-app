import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { MenuItem } from "@/hooks/useSupabaseMenuItems";
import MenuManagerItem from "./MenuManagerItem";
import MenuManagerAddForm from "./MenuManagerAddForm";
import { supabase } from "@/integrations/supabase/client";

interface MenuManagerProps {
  menuItems: MenuItem[];
  isLoading?: boolean;
  showRecommendationsMenu: boolean;
  onToggleMenuItem: (id: number, visible: boolean) => void;
  onToggleRecommendations: () => void;
  onReorderMenuItems?: (items: MenuItem[]) => void;
  onAddMenuItem?: (item: Omit<MenuItem, "id" | "created_at" | "updated_at">) => Promise<void>;
  onUpdateMenuItem?: (id: number, patch: Partial<MenuItem>) => Promise<void>;
  onDeleteMenuItem?: (id: number) => Promise<void>;
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
  // Estado local da lista editável; inicia com dados do banco
  const [pendingMenuItems, setPendingMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    setPendingMenuItems(menuItems);
  }, [menuItems]);

  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editedLabel, setEditedLabel] = useState<string>("");
  const [editedPath, setEditedPath] = useState<string>("");

  const [newMenuLabel, setNewMenuLabel] = useState("");
  const [newMenuPath, setNewMenuPath] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Adiciona recarregamento após salvar
  const reloadMenuItems = async () => {
    if (typeof window !== "undefined") {
      const ev = new Event("reloadMenuItems");
      window.dispatchEvent(ev);
    }
  };

  // Arraste/reordenar menus
  const handleDragStart = (id: number) => setDraggedItemId(id);
  const handleDragEnd = () => setDraggedItemId(null);

  const handleDrop = async (toId: number) => {
    if (draggedItemId === null || draggedItemId === toId) return;
    const fromIdx = pendingMenuItems.findIndex(item => item.id === draggedItemId);
    const toIdx = pendingMenuItems.findIndex(item => item.id === toId);
    if (fromIdx === -1 || toIdx === -1) return;
    const reordered = [...pendingMenuItems];
    const [movedItem] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, movedItem);
    setPendingMenuItems(reordered);
    setDraggedItemId(null);
    toast.info("Ordem alterada, clique em Salvar para publicar.");

    // Já salva reordenação após drop para evitar perder ação
    if (onReorderMenuItems) {
      setIsSaving(true);
      await onReorderMenuItems(reordered as MenuItem[]);
      setIsSaving(false);
      toast.success("Ordem dos menus salva!");
      reloadMenuItems();
    }
  };

  // Alternar visibilidade (muda só local até clicar no Salvar)
  const handleToggleItem = (id: number, visible: boolean) => {
    setPendingMenuItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, visible } : item
      )
    );
    toast.info("Visibilidade alterada, clique em Salvar para publicar.");
  };

  const handleToggleRecommendations = async () => {
    try {
      const newValue = !showRecommendationsMenu;
      
      // Update in database
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: newValue })
        .eq('setting_key', 'showRecommendationsMenu');

      if (error) {
        console.error('Erro ao atualizar configuração:', error);
        toast.error("Erro ao atualizar configuração");
        return;
      }

      onToggleRecommendations();
      toast.success(`Menu de recomendações ${newValue ? "ativado" : "desativado"}`);
    } catch (error) {
      console.error('Erro ao alterar configuração:', error);
      toast.error("Erro ao alterar configuração");
    }
  };

  // Editar label/path inline
  const handleEdit = (id: number, currentLabel: string, currentPath: string) => {
    setEditId(id);
    setEditedLabel(currentLabel);
    setEditedPath(currentPath);
  };

  const handleSaveEdit = async (id: number, label: string, path: string) => {
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
    setEditId(null);
    setEditedLabel("");
    setEditedPath("");
    toast.info("Alteração feita, clique em Salvar para publicar.");

    // Já salva no Supabase imediatamente
    if (onUpdateMenuItem) {
      setIsSaving(true);
      await onUpdateMenuItem(id, { label: label.trim(), path: path.trim() });
      setIsSaving(false);
      toast.success("Alteração salva!");
      reloadMenuItems();
    }
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

  // Adicionar novo menu no Supabase
  const handleAddNewMenu = async (e: React.FormEvent) => {
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

    if (onAddMenuItem) {
      setIsSaving(true);
      await onAddMenuItem({
        label: newMenuLabel.trim(),
        path: newMenuPath.trim(),
        visible: true,
        display_order: pendingMenuItems.length
      });
      setIsSaving(false);
    }
    setNewMenuLabel("");
    setNewMenuPath("");
    toast.success("Menu adicionado com sucesso!");
  };

  // Salva todas as alterações no banco
  const handleSaveMenuChanges = async () => {
    if (onReorderMenuItems && onUpdateMenuItem) {
      setIsSaving(true);

      // Persiste ordem no Supabase
      const itemsToSave = pendingMenuItems.map((item, idx) => ({
        ...item,
        display_order: idx
      }));

      await onReorderMenuItems(itemsToSave as MenuItem[]);

      // Persiste alterações de label/path/visible
      await Promise.all(itemsToSave.map(async item => {
        const original = menuItems.find(i => i.id === item.id);
        if (
          original &&
          (
            item.label !== original.label ||
            item.path !== original.path ||
            item.visible !== original.visible
          )
        ) {
          await onUpdateMenuItem(item.id, {
            label: item.label,
            path: item.path,
            visible: item.visible,
          });
        }
        return true;
      }));

      setIsSaving(false);
      toast.success("Menu publicado com sucesso!");
      reloadMenuItems();
    }
  };

  // MANUTENÇÃO: Nova função para deletar menu
  const handleDeleteMenuItem = async (id: number) => {
    if (!onDeleteMenuItem) return;
    setIsSaving(true);
    await onDeleteMenuItem(id);
    setIsSaving(false);
    toast.success("Menu deletado!");
    // Após deletar, reordenar e salvar nova ordem
    const newPending = pendingMenuItems.filter(item => item.id !== id);
    setPendingMenuItems(newPending);
    if (onReorderMenuItems) {
      await onReorderMenuItems(newPending.map((item, idx) => ({
        ...item,
        display_order: idx
      })));
    }
    reloadMenuItems();
  };

  // Renderizar sempre de pendingMenuItems (permite pré-visualizar antes de salvar)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Menu Management</CardTitle>
        <CardDescription>
          Edite nome, link, adicione, reordene ou remova itens do menu abaixo. Todas as configurações são salvas no banco de dados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">Carregando menus...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-row-reverse">
              <Button 
                variant="default" 
                onClick={handleSaveMenuChanges} 
                className="ml-auto flex gap-2"
                disabled={isSaving}
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
            <MenuManagerAddForm
              newMenuLabel={newMenuLabel}
              newMenuPath={newMenuPath}
              setNewMenuLabel={setNewMenuLabel}
              setNewMenuPath={setNewMenuPath}
              handleAddNewMenu={handleAddNewMenu}
            />
            {/* Lista de menus existente, exibindo estado local editável */}
            {pendingMenuItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-4">
                Nenhum menu cadastrado ainda.
              </div>
            ) : (
              pendingMenuItems.map((item) => (
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
                  onDeleteItem={handleDeleteMenuItem}
                />
              ))
            )}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Menu de Recomendações</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      O menu de recomendações permite adicionar serviços de pessoas que não moram no condomínio.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status atual: {showRecommendationsMenu ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                  <Button
                    variant={showRecommendationsMenu ? "outline" : "default"}
                    onClick={handleToggleRecommendations}
                  >
                    {showRecommendationsMenu ? "Desativar" : "Ativar"}
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
