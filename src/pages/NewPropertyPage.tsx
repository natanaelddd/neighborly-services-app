import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";
import PropertyFormErrorHandler from "@/components/PropertyFormErrorHandler";
import StorageBuckets from "@/components/admin/StorageBuckets";

const NewPropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState<any>(null);
  
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

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];
    
    const uploadPromises = selectedImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}-${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('property-photos')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('property-photos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    });
    
    return Promise.all(uploadPromises);
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event('submit') as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!user) {
      const authError = new Error("Você precisa estar logado para cadastrar uma propriedade");
      authError.name = "AuthenticationError";
      setError(authError);
      return;
    }

    if (!formData.title || !formData.description || !formData.whatsapp) {
      const validationError = new Error("Preencha todos os campos obrigatórios");
      validationError.name = "ValidationError";
      setError(validationError);
      return;
    }

    // Validar WhatsApp (deve ter pelo menos 10 dígitos)
    const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10) {
      const whatsappError = new Error("Digite um número de WhatsApp válido");
      whatsappError.name = "WhatsAppValidationError";
      setError(whatsappError);
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload das imagens
      const photoUrls = await uploadImages();
      
      // Salvar com código do país (55) + DDD + número
      const fullWhatsApp = `55${whatsappNumbers}`;
      
      console.log('Tentando inserir propriedade com dados:', {
        unit_id: user.id,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: formData.price || null,
        bedrooms: parseInt(formData.bedrooms),
        garage_covered: formData.garageCovered,
        is_renovated: formData.isRenovated,
        whatsapp: fullWhatsApp,
        status: 'pending'
      });
      
      // Inserir propriedade
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
          whatsapp: fullWhatsApp,
          status: 'pending'
        })
        .select()
        .single();

      if (propertyError) {
        console.error('Erro ao inserir propriedade:', propertyError);
        setError(propertyError);
        return;
      }

      // Inserir fotos se houver
      if (photoUrls.length > 0 && property) {
        const photoInserts = photoUrls.map((url, index) => ({
          property_id: property.id,
          photo_url: url,
          is_primary: index === 0
        }));

        const { error: photosError } = await supabase
          .from('property_photos')
          .insert(photoInserts);

        if (photosError) {
          console.error('Erro ao inserir fotos:', photosError);
          setError(photosError);
          return;
        }
      }

      toast.success("Propriedade cadastrada com sucesso! Aguarde a aprovação da administração.");
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Erro ao cadastrar propriedade:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StorageBuckets />
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Anunciar Propriedade</h1>
                <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                  Anuncie sua casa ou apartamento no Evidence Resort
                </p>
              </div>
            </div>

            <PropertyFormErrorHandler error={error} onRetry={handleRetry} />

            <Card className="shadow-sm">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Home className="h-5 w-5 shrink-0" />
                  <span>Informações da Propriedade</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Preencha as informações da sua propriedade. Após o cadastro, o anúncio será analisado pela administração.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">Título do Anúncio *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Casa 3 quartos com reforma completa"
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
                      placeholder="Descreva a propriedade, características especiais, localização dentro do condomínio..."
                      rows={4}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                    <div>
                      <Label htmlFor="type" className="text-sm font-medium">Tipo *</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({...formData, type: value})}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venda">Venda</SelectItem>
                          <SelectItem value="aluguel">Aluguel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        Preço {formData.type === 'aluguel' ? '(mensal)' : ''}
                      </Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="Ex: R$ 450.000 ou R$ 2.500/mês"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bedrooms" className="text-sm font-medium">Quartos *</Label>
                    <Select 
                      value={formData.bedrooms} 
                      onValueChange={(value) => setFormData({...formData, bedrooms: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 quartos</SelectItem>
                        <SelectItem value="4">4 quartos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Características</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="garage"
                          checked={formData.garageCovered}
                          onCheckedChange={(checked) => setFormData({...formData, garageCovered: !!checked})}
                        />
                        <Label htmlFor="garage" className="text-sm">Garagem coberta</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="renovated"
                          checked={formData.isRenovated}
                          onCheckedChange={(checked) => setFormData({...formData, isRenovated: !!checked})}
                        />
                        <Label htmlFor="renovated" className="text-sm">Casa reformada</Label>
                      </div>
                    </div>
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

                  <div>
                    <ImageUpload
                      bucket="property-photos"
                      maxFiles={5}
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
                      {isLoading ? 'Salvando...' : 'Cadastrar Propriedade'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPropertyPage;
