
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service, Category } from "@/types";

interface ServiceEditorProps {
  service: Service | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (serviceId: number, updatedData: Partial<Service>) => void;
}

const ServiceEditor = ({ service, categories, isOpen, onClose, onSave }: ServiceEditorProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatsapp: "",
    categoryId: "",
    status: "",
    block: "",
    house_number: ""
  });

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title,
        description: service.description,
        whatsapp: service.whatsapp,
        categoryId: service.categoryId?.toString() || "",
        status: service.status,
        block: service.block,
        house_number: service.house_number
      });
    }
  }, [service]);

  const handleSave = () => {
    if (!service) return;

    const updatedData: Partial<Service> = {
      title: formData.title,
      description: formData.description,
      whatsapp: formData.whatsapp,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : 0,
      status: formData.status as 'pending' | 'approved' | 'rejected',
      block: formData.block,
      house_number: formData.house_number
    };

    onSave(service.id, updatedData);
    onClose();
  };

  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
          <DialogDescription>
            Edite as informações do serviço abaixo.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título do serviço"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do serviço"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="block">Bloco</Label>
              <Select value={formData.block} onValueChange={(value) => setFormData({ ...formData, block: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bloco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bloco 1</SelectItem>
                  <SelectItem value="2">Bloco 2</SelectItem>
                  <SelectItem value="3">Bloco 3</SelectItem>
                  <SelectItem value="4">Bloco 4</SelectItem>
                  <SelectItem value="5">Bloco 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="house_number">Número da Casa</Label>
              <Input
                id="house_number"
                value={formData.house_number}
                onChange={(e) => setFormData({ ...formData, house_number: e.target.value })}
                placeholder="Ex: 101, 102A"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={formData.categoryId} 
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem categoria</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceEditor;
