
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
    setFormData({...formData, whatsapp: formatted});
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

    // Validar WhatsApp (deve ter pelo menos 10 dígitos)
    const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10) {
      toast.error("Digite um número de WhatsApp válido");
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload da imagem (se houver)
      const photoUrl = await uploadImage();
      
      // Salvar com código do país (55) + DDD + número
      const fullWhatsApp = `55${whatsappNumbers}`;
      
      const { error } = await supabase
        .from('services')
        .insert({
          unit_id: user.id,
          title: formData.title,
          description: formData.description,
          whatsapp: fullWhatsApp,
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
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Cadastrar Serviço</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Ofereça seus serviços para a comunidade do Evidence Resort
              </p>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Briefcase className="h-5 w-5 shrink-0" />
                <span>Informações do Serviço</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Preencha as informações do seu serviço. Após o cadastro, seu serviço será analisado pela administração.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Título do Serviço *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Limpeza de apartamentos e casas"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva detalhadamente o serviço que você oferece, experiência, horários de atendimento..."
                    rows={4}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
                    <Select 
                      value={formData.categoryId} 
                      onValueChange={(value) => setFormData({...formData, categoryId: value})}
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

                  <div>
                    <Label htmlFor="whatsapp" className="text-sm font-medium">WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleWhatsAppChange}
                      placeholder="(16) 99999-9999"
                      required
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Digite apenas o DDD e número</p>
                  </div>
                </div>

                <div>
                  <ImageUpload
                    bucket="service-photos"
                    maxFiles={1}
                    selectedImages={selectedImages}
                    onImagesChange={setSelectedImages}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                    className="flex-1 order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 order-1 sm:order-2"
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
