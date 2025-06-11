
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import UserServiceEditor from "@/components/user/UserServiceEditor";

interface UserService {
  id: number;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  created_at: string;
  categories?: {
    name: string;
    icon: string;
  };
}

const UserDashboardPage = () => {
  const { user, profile } = useAuth();
  const [services, setServices] = useState<UserService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingService, setEditingService] = useState<UserService | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserServices();
      fetchCategories();
    }
  }, [user]);

  const fetchUserServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          title,
          description,
          whatsapp,
          status,
          created_at,
          categories (
            name,
            icon
          )
        `)
        .eq('unit_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast.error("Erro ao carregar seus serviços");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('unit_id', user?.id);

      if (error) throw error;

      toast.success("Serviço excluído com sucesso!");
      fetchUserServices();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast.error("Erro ao excluir serviço");
    }
  };

  const handleServiceUpdate = () => {
    fetchUserServices();
    setEditingService(null);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      approved: { label: "Aprovado", variant: "default" as const },
      pending: { label: "Pendente", variant: "secondary" as const },
      rejected: { label: "Rejeitado", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getWhatsAppUrl = (service: UserService) => {
    const message = `Olá! Vi seu serviço "${service.title}" no Evidence Resort e gostaria de mais informações.`;
    return `https://wa.me/${service.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  if (isLoading) {
    return (
      <div className="container-custom py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Meu Painel</h1>
          <p className="text-muted-foreground">
            Olá, {profile?.name}! Gerencie seus serviços cadastrados aqui.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{services.length}</CardTitle>
              <CardDescription>Total de Serviços</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {services.filter(s => s.status === 'approved').length}
              </CardTitle>
              <CardDescription>Serviços Aprovados</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {services.filter(s => s.status === 'pending').length}
              </CardTitle>
              <CardDescription>Aguardando Aprovação</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Meus Serviços</h2>
          <Button asChild>
            <Link to="/services/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Serviço
            </Link>
          </Button>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Você ainda não cadastrou nenhum serviço.
              </p>
              <Button asChild>
                <Link to="/services/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar Primeiro Serviço
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        {service.categories && (
                          <Badge variant="outline">
                            <span className="mr-1">{service.categories.icon}</span>
                            {service.categories.name}
                          </Badge>
                        )}
                        {getStatusBadge(service.status)}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getWhatsAppUrl(service), '_blank')}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <UserServiceEditor
          service={editingService}
          categories={categories}
          isOpen={!!editingService}
          onClose={() => setEditingService(null)}
          onSave={handleServiceUpdate}
        />
      </div>
    </div>
  );
};

export default UserDashboardPage;
