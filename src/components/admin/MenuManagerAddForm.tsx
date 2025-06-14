
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MenuManagerAddFormProps {
  newMenuLabel: string;
  newMenuPath: string;
  setNewMenuLabel: (val: string) => void;
  setNewMenuPath: (val: string) => void;
  handleAddNewMenu: (e: React.FormEvent) => void;
}

const MenuManagerAddForm = ({
  newMenuLabel,
  newMenuPath,
  setNewMenuLabel,
  setNewMenuPath,
  handleAddNewMenu,
}: MenuManagerAddFormProps) => {
  return (
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
  );
};

export default MenuManagerAddForm;
