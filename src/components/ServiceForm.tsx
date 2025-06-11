import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ServiceForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const categories = [
    { id: 1, name: "Limpeza", icon: "🧹" },
    { id: 2, name: "Jardinagem", icon: "🌱" },
    { id: 3, name: "Manutenção", icon: "🔧" },
    { id: 4, name: "Beleza", icon: "💄" },
    { id: 5, name: "Educação", icon: "📚" },
    { id: 6, name: "Saúde", icon: "🏥" },
    { id: 7, name: "Tecnologia", icon: "💻" },
    { id: 8, name: "Alimentação", icon: "🍕" },
    { id: 9, name: "Transporte", icon: "🚗" },
    { id: 10, name: "Pet Care", icon: "🐕" },
    { id: 11, name: "Consultoria", icon: "💼" },
    { id: 12, name: "Outros", icon: "🔧" }
  ];

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
          status: 'pending' // Serviços ficam pendentes para aprovação
        });

      if (error) throw error;

      toast.success("Serviço cadastrado com sucesso! Aguarde a aprovação do administrador.");
      navigate("/services");
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
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastrar Serviço"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
