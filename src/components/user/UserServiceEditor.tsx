
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserService {
  id: number;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  categories?: {
    name: string;
    icon: string;
  };
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface UserServiceEditorProps {
  service: UserService | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const UserServiceEditor = ({ service, categories, isOpen, onClose, onSave }: UserServiceEditorProps) => {
  const { user } = useAuth();
  const [editedService, setEditedService] = useState<Partial<UserService & { category_id: number }>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (service && isOpen) {
      // Converter o WhatsApp de volta para formato brasileiro (remover código do país)
      let displayWhatsApp = service.whatsapp;
      if (service.whatsapp.startsWith('55')) {
        const number = service.whatsapp.slice(2);
        displayWhatsApp = formatWhatsApp(number);
      }

      setEditedService({
        title: service.title,
        description: service.description,
        whatsapp: displayWhatsApp,
        category_id: categories.find(c => c.name === service.categories?.name)?.id
      });
    }
  }, [service, isOpen, categories]);

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + número)
    const limited = numbers.slice(0, 11);
    
    // Aplica máscara
    if (limited.length <= 2) {
      return limited;
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setEditedService({...editedService, whatsapp: formatted});
  };

  const handleSave = async () => {
    if (!service || !editedService.title || !editedService.description || !editedService.whatsapp) {
      toast.error("Todos os campos obrigatórios devem ser preenchidos");
      return;
    }

    // Validar WhatsApp (deve ter pelo menos 10 dígitos)
    const whatsappNumbers = editedService.whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10) {
      toast.error("Digite um número de WhatsApp válido");
      return;
    }

    setIsLoading(true);
    try {
      // Salvar com código do país (55) + DDD + número
      const fullWhatsApp = `55${whatsappNumbers}`;

      const { error } = await supabase
        .from('services')
        .update({
          title: editedService.title,
          description: editedService.description,
          whatsapp: fullWhatsApp,
          category_id: editedService.category_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', service.id)
        .eq('unit_id', user?.id); // Garantir que só pode editar seus próprios serviços

      if (error) throw error;

      toast.success("Serviço atualizado com sucesso!");
      onSave();
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error("Erro ao atualizar serviço");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedService({});
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleCancel();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>
            Modifique as informações do seu serviço.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="edit-title">Título do Serviço *</Label>
            <Input
              id="edit-title"
              value={editedService.title || ''}
              onChange={(e) => setEditedService({...editedService, title: e.target.value})}
              placeholder="Ex: Limpeza de apartamentos"
              className="mt-1"
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
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="edit-whatsapp">WhatsApp *</Label>
            <Input
              id="edit-whatsapp"
              value={editedService.whatsapp || ''}
              onChange={handleWhatsAppChange}
              placeholder="(16) 99999-9999"
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Digite apenas o DDD e número</p>
          </div>

          <div>
            <Label htmlFor="edit-category">Categoria</Label>
            <Select
              value={editedService.category_id?.toString() || ''}
              onValueChange={(value) => setEditedService({...editedService, category_id: parseInt(value)})}
            >
              <SelectTrigger className="mt-1">
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

          {service.status !== 'approved' && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Status:</strong> {service.status === 'pending' ? 'Aguardando aprovação' : 'Rejeitado'}
                <br />
                {service.status === 'pending' && 'Seu serviço está sendo analisado pela administração.'}
                {service.status === 'rejected' && 'Entre em contato com a administração para mais detalhes.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading} className="flex-1 sm:flex-none">
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="flex-1 sm:flex-none">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserServiceEditor;
