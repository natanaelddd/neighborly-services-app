
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Category {
  id: number;
  name: string;
  icon: string;
}

const ServiceForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error("Erro ao carregar categorias");
      } else {
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !profile) {
      toast.error("Você precisa estar logado para cadastrar um serviço");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('services')
        .insert({
          title,
          description,
          whatsapp,
          category_id: parseInt(categoryId),
          photo_url: photoUrl,
          unit_id: profile.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Serviço cadastrado com sucesso! Aguarde a aprovação do administrador.");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Erro ao cadastrar serviço:', error);
      toast.error(error.message || "Erro ao cadastrar serviço");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gradient">
          Cadastrar Novo Serviço
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Título do Serviço *
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Aulas de Piano"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Descrição *
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva seu serviço em detalhes..."
              rows={4}
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Categoria *
            </label>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {categories.length === 0 && !isLoadingCategories && (
              <p className="text-sm text-muted-foreground mt-1">
                Nenhuma categoria disponível. Entre em contato com o administrador.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
              WhatsApp *
            </label>
            <Input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium mb-2">
              URL da Foto (opcional)
            </label>
            <Input
              id="photo"
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-blue-700"
            disabled={isLoading || categories.length === 0}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Serviço"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
