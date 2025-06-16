
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  icon: string;
}

export const useServiceForm = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    whatsapp: "",
    categoryId: "",
    houseNumber: profile?.house_number || ""
  });

  useEffect(() => {
    fetchCategories();
    // Atualizar número da casa quando o perfil for carregado
    if (profile?.house_number && !formData.houseNumber) {
      setFormData(prev => ({ ...prev, houseNumber: profile.house_number }));
    }
  }, [profile]);

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
    
    try {
      const { data, error } = await supabase.storage
        .from('service-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        throw error;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('service-photos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error("Erro ao fazer upload da imagem");
      throw error;
    }
  };

  const updateProfileHouseNumber = async (houseNumber: string) => {
    if (!user || !profile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ house_number: houseNumber })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar número da casa:', error);
        // Não bloqueia o cadastro do serviço se falhar
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para cadastrar um serviço");
      return;
    }

    if (!formData.title || !formData.description || !formData.whatsapp || !formData.houseNumber) {
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
      // Atualizar número da casa no perfil se necessário
      if (profile?.house_number !== formData.houseNumber) {
        await updateProfileHouseNumber(formData.houseNumber);
      }

      // Upload da imagem (se houver)
      let photoUrl = null;
      try {
        photoUrl = await uploadImage();
      } catch (uploadError) {
        console.error('Erro no upload, continuando sem imagem:', uploadError);
        // Continua sem a imagem se houver erro no upload
      }
      
      // Salvar com código do país (55) + DDD + número
      const fullWhatsApp = `55${whatsappNumbers}`;
      
      console.log('Inserindo serviço:', {
        unit_id: user.id,
        title: formData.title,
        description: formData.description,
        whatsapp: fullWhatsApp,
        category_id: formData.categoryId ? parseInt(formData.categoryId) : null,
        photo_url: photoUrl,
        status: 'pending'
      });

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

      if (error) {
        console.error('Erro ao inserir serviço:', error);
        throw error;
      }

      toast.success("Serviço cadastrado com sucesso! Aguarde a aprovação da administração.");
      navigate('/user-dashboard');
      
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      toast.error("Erro ao cadastrar serviço. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    categories,
    isLoading,
    selectedImages,
    setSelectedImages,
    handleSubmit
  };
};
