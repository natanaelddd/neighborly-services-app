
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Home, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ImageUpload from "@/components/ImageUpload";

const NewPropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "venda",
    price: "",
    bedrooms: "3",
    garageCovered: false,
    isRenovated: false,
    whatsapp: ""
  });

  const uploadImages = async (propertyId: number): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${propertyId}-${Date.now()}-${i}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(fileName, file);
      
      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para anunciar uma casa");
      return;
    }

    if (!formData.title || !formData.description || !formData.whatsapp) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (selectedImages.length === 0) {
      toast.error("Adicione pelo menos uma foto da casa");
      return;
    }

    setIsLoading(true);
    
    try {
      // Inserir a propriedade
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          unit_id: user.id,
          title: formData.title,
          description: formData.description,
          type: formData.type,
          price: formData.price || null,
          bedrooms: parseInt(formData.bedrooms),
          garage_covered: formData.garageCovered,
          is_renovated: formData.isRenovated,
          whatsapp: formData.whatsapp,
          status: 'pending'
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload das imagens
      const uploadedUrls = await uploadImages(property.id);
      
      // Inserir as fotos na tabela property_photos
      const photoInserts = uploadedUrls.map((url, index) => ({
        property_id: property.id,
        photo_url: url,
        is_primary: index === 0 // Primeira imagem é a principal
      }));

      const { error: photosError } = await supabase
        .from('property_photos')
        .insert(photoInserts);

      if (photosError) throw photosError;

      toast.success("Casa anunciada com sucesso! Aguarde a aprovação da administração.");
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Erro ao anunciar casa:', error);
      toast.error("Erro ao anunciar casa. Tente novamente.");
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
              <h1 className="text-2xl font-bold text-gray-900">Anunciar Casa</h1>
              <p className="text-gray-600">Cadastre sua casa no Evidence Resort</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Informações da Casa
              </CardTitle>
              <CardDescription>
                Preencha as informações da sua casa. Após o cadastro, seu anúncio será analisado pela administração.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Título do Anúncio *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Casa 3 quartos reformada no Evidence Resort"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
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
                    <Label htmlFor="price">Preço</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="Ex: R$ 450.000 ou R$ 2.500/mês"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Quartos *</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => setFormData({...formData, bedrooms: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 quartos</SelectItem>
                        <SelectItem value="4">4 quartos</SelectItem>
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

                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva sua casa: localização no condomínio, características especiais, condições..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="garage"
                      checked={formData.garageCovered}
                      onCheckedChange={(checked) => setFormData({...formData, garageCovered: !!checked})}
                    />
                    <Label htmlFor="garage">Garagem coberta</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="renovated"
                      checked={formData.isRenovated}
                      onCheckedChange={(checked) => setFormData({...formData, isRenovated: !!checked})}
                    />
                    <Label htmlFor="renovated">Casa reformada</Label>
                  </div>
                </div>

                <ImageUpload
                  bucket="property-photos"
                  maxFiles={5}
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
                    {isLoading ? 'Salvando...' : 'Anunciar Casa'}
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

export default NewPropertyPage;
