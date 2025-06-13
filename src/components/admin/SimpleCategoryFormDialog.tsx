
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import IconSelector from "./IconSelector";

interface SimpleCategoryFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, icon: string) => Promise<void>;
  title: string;
  initialName?: string;
  initialIcon?: string;
}

const SimpleCategoryFormDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  initialName = "",
  initialIcon = "📋"
}: SimpleCategoryFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: initialName,
    icon: initialIcon
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      return;
    }

    await onSubmit(formData.name.trim(), formData.icon);
    setFormData({ name: "", icon: "📋" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha as informações da categoria
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
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleCategoryFormDialog;
