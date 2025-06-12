
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const ServiceForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatsapp: "",
    categoryId: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error("Erro ao carregar categorias");
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (selectedImages.length === 0) return null;
    
    const file = selectedImages[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('service-photos')
      .upload(fileName, file);
    
    if (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('service-photos')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um serviço");
      return;
    }

    if (!formData.title || !formData.description || !formData.whatsapp) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload da imagem (se houver)
      const photoUrl = await uploadImage();
      
      const { error } = await supabase
        .from('services')
        .insert({
          unit_id: user.id,
          title: formData.title,
          description: formData.description,
          whatsapp: formData.whatsapp,
          category_id: formData.categoryId ? parseInt(formData.categoryId) : null,
          photo_url: photoUrl,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Serviço cadastrado com sucesso! Aguarde a aprovação da administração.");
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      toast.error("Erro ao cadastrar serviço. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cadastrar Serviço</h1>
              <p className="text-gray-600">Ofereça seus serviços para a comunidade do Evidence Resort</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Informações do Serviço
              </CardTitle>
              <CardDescription>
                Preencha as informações do seu serviço. Após o cadastro, seu serviço será analisado pela administração.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Título do Serviço *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Limpeza de apartamentos e casas"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva detalhadamente o serviço que você oferece, experiência, horários de atendimento..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({...formData, categoryId: value})}
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
                    <Label htmlFor="whatsapp">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      placeholder="5511999999999"
                      required
                    />
                  </div>
                </div>

                <ImageUpload
                  bucket="service-photos"
                  maxFiles={1}
                  selectedImages={selectedImages}
                  onImagesChange={setSelectedImages}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Salvando...' : 'Cadastrar Serviço'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
