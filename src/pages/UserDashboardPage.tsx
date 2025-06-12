import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Home, Briefcase, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Service {
  id: number;
  title: string;
  description: string;
  status: string;
}

interface Property {
  id: number;
  title: string;
  type: string;
  status: string;
}

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, title, description, status')
        .eq('unit_id', user?.id)
        .order('created_at', { ascending: false });

      if (servicesError) {
        console.error('Erro ao buscar serviços:', servicesError);
        toast.error("Erro ao carregar serviços");
      } else {
        setServices(servicesData || []);
      }

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('id, title, type, status')
        .eq('unit_id', user?.id)
        .order('created_at', { ascending: false });

      if (propertiesError) {
        console.error('Erro ao buscar casas:', propertiesError);
        toast.error("Erro ao carregar casas");
      } else {
        setProperties(propertiesData || []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meu Dashboard</h1>
              <p className="text-gray-600">Gerencie seus serviços e anúncios</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/services/new')} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Serviço
              </Button>
              <Button onClick={() => navigate('/properties/new')} variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Anunciar Casa
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Serviços */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Meus Serviços
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie seus serviços cadastrados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {services.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      Nenhum serviço cadastrado.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {services.map(service => (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                          <div>
                            <h3 className="font-semibold text-gray-900">{service.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-1">{service.description}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            Status: {service.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Anúncios de Casas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Meus Anúncios de Casas
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie seus anúncios de casas.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {properties.length === 0 ? (
                    <p className="text-center py-4 text-gray-500">
                      Nenhum anúncio de casa cadastrado.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {properties.map(property => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                          <div>
                            <h3 className="font-semibold text-gray-900">{property.title}</h3>
                            <p className="text-gray-600 text-sm">Tipo: {property.type}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            Status: {property.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
