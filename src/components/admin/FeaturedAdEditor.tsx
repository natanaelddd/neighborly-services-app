
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const FeaturedAdEditor = ({ properties: initialProperties, onSave }: FeaturedAdEditorProps) => {
  const [propertyList, setPropertyList] = useState<FeaturedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('featured_properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar propriedades em destaque:', error);
        toast.error("Erro ao carregar propriedades");
        return;
      }

      const transformedProperties = (data || []).map(prop => ({
        id: prop.id,
        title: prop.title,
        description: prop.description,
        details: prop.details,
        imageUrl: prop.image_url,
        type: prop.type as 'venda' | 'aluguel',
        price: prop.price || ""
      }));

      setPropertyList(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error("Erro ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
  };

  const addProperty = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_properties')
        .insert([{
          title: "Nova Propriedade",
          description: "Descrição da propriedade",
          details: "Detalhes adicionais",
          image_url: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png",
          type: "venda",
          price: ""
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar propriedade:', error);
        toast.error("Erro ao adicionar propriedade");
        return;
      }

      const newProperty: FeaturedProperty = {
        id: data.id,
        title: data.title,
        description: data.description,
        details: data.details,
        imageUrl: data.image_url,
        type: data.type as 'venda' | 'aluguel',
        price: data.price || ""
      };

      setPropertyList([...propertyList, newProperty]);
      toast.success("Propriedade adicionada com sucesso!");
    } catch (error) {
      console.error('Erro ao adicionar propriedade:', error);
      toast.error("Erro ao adicionar propriedade");
    }
  };

  const removeProperty = async (id: number) => {
    try {
      const { error } = await supabase
        .from('featured_properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover propriedade:', error);
        toast.error("Erro ao remover propriedade");
        return;
      }

      setPropertyList(propertyList.filter(prop => prop.id !== id));
      toast.success("Propriedade removida com sucesso!");
    } catch (error) {
      console.error('Erro ao remover propriedade:', error);
      toast.error("Erro ao remover propriedade");
    }
  };

  const updateProperty = async (id: number, field: keyof FeaturedProperty, value: string) => {
    const updatedList = propertyList.map(prop => 
      prop.id === id ? { ...prop, [field]: value } : prop
    );
    setPropertyList(updatedList);

    // Debounce the database update
    try {
      const updateData: any = {};
      if (field === 'imageUrl') {
        updateData.image_url = value;
      } else {
        updateData[field] = value;
      }

      const { error } = await supabase
        .from('featured_properties')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar propriedade:', error);
      }
    } catch (error) {
      console.error('Erro ao atualizar propriedade:', error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Chamar callback do componente pai para atualizar o estado
    onSave(propertyList);
    
    toast.success("Propriedades em destaque atualizadas com sucesso!");
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Propriedades em Destaque</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propriedades em Destaque</CardTitle>
        <CardDescription>
          Gerencie as casas/propriedades exibidas no carousel da página inicial. As alterações são salvas automaticamente no banco de dados.
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
