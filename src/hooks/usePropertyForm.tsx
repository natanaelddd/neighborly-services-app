
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { PropertyFormData, initialFormData } from "@/components/property/PropertyFormData";

export const usePropertyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [error, setError] = useState<any>(null);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);

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

  const validateForm = (): boolean => {
    if (!user) {
      const authError = new Error("Você precisa estar logado para cadastrar uma propriedade");
      authError.name = "AuthenticationError";
      setError(authError);
      return false;
    }

    if (!formData.title || !formData.description || !formData.whatsapp) {
      const validationError = new Error("Preencha todos os campos obrigatórios");
      validationError.name = "ValidationError";
      setError(validationError);
      return false;
    }

    const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
    if (whatsappNumbers.length < 10) {
      const whatsappError = new Error("Digite um número de WhatsApp válido");
      whatsappError.name = "WhatsAppValidationError";
      setError(whatsappError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      let photoUrls: string[] = [];
      try {
        photoUrls = await uploadImages();
      } catch (uploadError) {
        console.error('Erro no upload, continuando sem imagens:', uploadError);
      }
      
      const whatsappNumbers = formData.whatsapp.replace(/\D/g, '');
      const fullWhatsApp = `55${whatsappNumbers}`;
      
      console.log('Tentando inserir propriedade com dados:', {
        unit_id: user?.id,
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

  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event('submit') as any);
  };

  return {
    formData,
    setFormData,
    isLoading,
    selectedImages,
    setSelectedImages,
    error,
    handleSubmit,
    handleRetry
  };
};
