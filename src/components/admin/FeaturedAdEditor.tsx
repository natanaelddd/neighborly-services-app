
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

interface FeaturedProperty {
  id: number;
  title: string;
  description: string;
  details: string;
  imageUrl: string;
  type: "venda" | "aluguel";
  price?: string;
}

interface FeaturedAdEditorProps {
  properties: FeaturedProperty[];
  onSave: (properties: FeaturedProperty[]) => void;
}

const FeaturedAdEditor = ({ properties, onSave }: FeaturedAdEditorProps) => {
  const [propertyList, setPropertyList] = useState<FeaturedProperty[]>(properties);

  const addProperty = () => {
    const newProperty: FeaturedProperty = {
      id: Date.now(),
      title: "",
      description: "",
      details: "",
      imageUrl: "",
      type: "venda",
      price: ""
    };
    setPropertyList([...propertyList, newProperty]);
  };

  const removeProperty = (id: number) => {
    setPropertyList(propertyList.filter(prop => prop.id !== id));
  };

  const updateProperty = (id: number, field: keyof FeaturedProperty, value: string) => {
    setPropertyList(propertyList.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    ));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(propertyList);
    toast.success("Propriedades em destaque atualizadas com sucesso!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propriedades em Destaque</CardTitle>
        <CardDescription>
          Gerencie as casas/propriedades exibidas no carousel da página inicial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          {propertyList.map((property, index) => (
            <div key={property.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Propriedade {index + 1}</h3>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProperty(property.id)}
                  disabled={propertyList.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`title-${property.id}`}>Título</Label>
                  <Input
                    id={`title-${property.id}`}
                    value={property.title}
                    onChange={(e) => updateProperty(property.id, "title", e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor={`type-${property.id}`}>Tipo</Label>
                  <Select
                    value={property.type}
                    onValueChange={(value: "venda" | "aluguel") => updateProperty(property.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venda">Venda</SelectItem>
                      <SelectItem value="aluguel">Aluguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`price-${property.id}`}>Preço</Label>
                  <Input
                    id={`price-${property.id}`}
                    value={property.price}
                    onChange={(e) => updateProperty(property.id, "price", e.target.value)}
                    placeholder="R$ 450.000 ou R$ 2.800/mês"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`image-${property.id}`}>URL da Imagem</Label>
                  <Input
                    id={`image-${property.id}`}
                    value={property.imageUrl}
                    onChange={(e) => updateProperty(property.id, "imageUrl", e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`description-${property.id}`}>Descrição</Label>
                <Textarea
                  id={`description-${property.id}`}
                  value={property.description}
                  onChange={(e) => updateProperty(property.id, "description", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor={`details-${property.id}`}>Detalhes Adicionais</Label>
                <Textarea
                  id={`details-${property.id}`}
                  value={property.details}
                  onChange={(e) => updateProperty(property.id, "details", e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={addProperty}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar Propriedade
            </Button>
            
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeaturedAdEditor;
