
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

interface Service {
  id: number;
  unit_id: string;
  category_id: number | null;
  title: string;
  description: string;
  whatsapp: string;
  status: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  categories?: {
    name: string;
    icon: string;
  };
}

interface AllServicesProps {
  services: Service[];
  isLoading: boolean;
}

const AllServices = ({ services, isLoading }: AllServicesProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case "rejected":
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      case "pending":
        return <Badge>Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os Serviços</CardTitle>
        <CardDescription>
          Visualize todos os serviços cadastrados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            Nenhum serviço cadastrado.
          </p>
        ) : (
          <div className="space-y-4">
            {services.map(service => (
              <Card key={service.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    {getStatusBadge(service.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {service.categories && (
                      <span className="inline-flex items-center gap-1 mr-4">
                        <span>{service.categories.icon}</span>
                        <span>{service.categories.name}</span>
                      </span>
                    )}
                    {service.profiles && (
                      <span>
                        por {service.profiles.name} - Bloco {service.profiles.block}, Casa {service.profiles.house_number}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <p className="text-sm mt-2">
                    <strong>WhatsApp:</strong> {service.whatsapp}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastrado em: {new Date(service.created_at).toLocaleDateString('pt-BR')} | 
                    Atualizado em: {new Date(service.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                  >
                    <Edit className="mr-1 h-4 w-4" /> Editar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllServices;
