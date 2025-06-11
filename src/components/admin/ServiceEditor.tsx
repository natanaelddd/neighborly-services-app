
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: number;
  unit_id: string;
  category_id: number | null;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  categories?: {
    name: string;
    icon: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface ServiceEditorProps {
  service: Service | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceId: number, updatedData: Partial<Service>) => void;
}

const ServiceEditor = ({ service, categories, isOpen, onClose, onSave }: ServiceEditorProps) => {
  const [editedService, setEditedService] = useState<Partial<Service>>({});

  const handleOpen = () => {
    if (service) {
      setEditedService({
        title: service.title,
        description: service.description,
        whatsapp: service.whatsapp,
        category_id: service.category_id,
        status: service.status
      });
    }
  };

  const handleSave = () => {
    if (!service || !editedService.title || !editedService.description || !editedService.whatsapp) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    onSave(service.id, editedService);
    onClose();
  };

  const handleCancel = () => {
    setEditedService({});
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (open) handleOpen();
      else handleCancel();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>
            Modifique as informações do serviço de {service.profiles?.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="edit-title">Título do Serviço *</Label>
            <Input
              id="edit-title"
              value={editedService.title || ''}
              onChange={(e) => setEditedService({...editedService, title: e.target.value})}
              placeholder="Ex: Limpeza de apartamentos"
            />
          </div>

          <div>
            <Label htmlFor="edit-description">Descrição *</Label>
            <Textarea
              id="edit-description"
              value={editedService.description || ''}
              onChange={(e) => setEditedService({...editedService, description: e.target.value})}
              placeholder="Descreva detalhadamente o serviço oferecido..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="edit-whatsapp">WhatsApp *</Label>
            <Input
              id="edit-whatsapp"
              value={editedService.whatsapp || ''}
              onChange={(e) => setEditedService({...editedService, whatsapp: e.target.value})}
              placeholder="Ex: 5511999999999"
            />
          </div>

          <div>
            <Label htmlFor="edit-category">Categoria</Label>
            <Select
              value={editedService.category_id?.toString() || ''}
              onValueChange={(value) => setEditedService({...editedService, category_id: parseInt(value)})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={editedService.status || ''}
              onValueChange={(value) => setEditedService({...editedService, status: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Prestador:</strong> {service.profiles?.name}<br/>
              <strong>Endereço:</strong> Bloco {service.profiles?.block}, Casa {service.profiles?.house_number}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditor;
