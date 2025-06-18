
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import ServiceEditor from "./ServiceEditor";
import { Service, Category } from "@/types";

interface AllServicesProps {
  services: Service[];
  categories: Category[];
  isLoading: boolean;
  onUpdateService: (serviceId: number, updatedData: Partial<Service>) => void;
  onDeleteService?: (serviceId: number) => void;
}

const AllServices = ({ services, categories, isLoading, onUpdateService, onDeleteService }: AllServicesProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setSelectedService(null);
    setIsEditorOpen(false);
  };

  const handleSaveService = (serviceId: number, updatedData: Partial<Service>) => {
    onUpdateService(serviceId, updatedData);
    handleCloseEditor();
  };

  const handleDelete = (serviceId: number) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.")) {
      if (onDeleteService) {
        onDeleteService(serviceId);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Todos os Serviços</CardTitle>
          <CardDescription>
            Visualize, edite ou remova todos os serviços cadastrados
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
                      {service.category && (
                        <span className="inline-flex items-center gap-1 mr-4">
                          <span>{service.category.icon}</span>
                          <span>{service.category.name}</span>
                        </span>
                      )}
                      <span>
                        Bloco {service.block}, Casa {service.house_number}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <p className="text-sm mt-2">
                      <strong>WhatsApp:</strong> {service.whatsapp}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cadastrado em: {new Date(service.createdAt).toLocaleDateString('pt-BR')} | 
                      Atualizado em: {new Date(service.updatedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditService(service)}
                      type="button"
                    >
                      <Edit className="mr-1 h-4 w-4" /> Editar
                    </Button>
                    {onDeleteService && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        title="Excluir serviço"
                        type="button"
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> Remover
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <ServiceEditor
        service={selectedService}
        categories={categories}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveService}
      />
    </>
  );
};

export default AllServices;
