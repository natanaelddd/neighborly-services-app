
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ImageUpload from "@/components/ImageUpload";
import PropertyFormErrorHandler from "@/components/PropertyFormErrorHandler";
import { PropertyBasicFields } from "./PropertyBasicFields";
import { PropertyTypeAndPrice } from "./PropertyTypeAndPrice";
import { PropertyCharacteristics } from "./PropertyCharacteristics";
import WhatsAppInput from "@/components/forms/WhatsAppInput";

interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  price: string;
  bedrooms: string;
  garageCovered: boolean;
  isRenovated: boolean;
  whatsapp: string;
}

const PropertyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState<any>(null);
  
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    type: "venda",
    price: "",
    bedrooms: "3",
    garageCovered: false,
    isRenovated: false,
    whatsapp: ""
  });

  const uploadImages = async (): Promise<string[]> => {
    if (selectedImages.length === 0) return [];
    
    const uploadPromises = selectedImages.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}-${index}.${fileExt}`;
      
      try {
        const { data, error } = await supabase.storage
          .from('property-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('property-photos')
          .getPublicUrl(fileName);
        
        return publicUrl;
      } catch (error) {
        console.error(`Erro ao fazer upload da imagem ${index}:`, error);
        throw error;
      }
    });
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Erro no upload das imagens:', error);
      toast.error("Erro ao fazer upload das imagens");
      throw error;
    }
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
      // Upload das imagens (se houver)
      let photoUrls: string[] = [];
      try {
        photoUrls = await uploadImages();
      } catch (uploadError) {
        console.error('Erro no upload, continuando sem imagens:', uploadError);
        // Continua sem as imagens se houver erro no upload
      }
      
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
          // Não definir como erro fatal, propriedade já foi criada
          toast.error("Propriedade criada, mas houve erro ao salvar algumas fotos");
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
        <PropertyFormErrorHandler error={error} onRetry={handleRetry} />
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <PropertyBasicFields
            title={formData.title}
            description={formData.description}
            onTitleChange={(title) => setFormData({...formData, title})}
            onDescriptionChange={(description) => setFormData({...formData, description})}
          />

          <PropertyTypeAndPrice
            type={formData.type}
            price={formData.price}
            bedrooms={formData.bedrooms}
            onTypeChange={(type) => setFormData({...formData, type})}
            onPriceChange={(price) => setFormData({...formData, price})}
            onBedroomsChange={(bedrooms) => setFormData({...formData, bedrooms})}
          />

          <PropertyCharacteristics
            garageCovered={formData.garageCovered}
            isRenovated={formData.isRenovated}
            onGarageChange={(garageCovered) => setFormData({...formData, garageCovered})}
            onRenovatedChange={(isRenovated) => setFormData({...formData, isRenovated})}
          />

          <WhatsAppInput
            value={formData.whatsapp}
            onChange={(whatsapp) => setFormData({...formData, whatsapp})}
          />

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
  );
};

export default PropertyForm;
