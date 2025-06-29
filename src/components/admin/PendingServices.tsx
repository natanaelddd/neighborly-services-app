
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useDemoMode } from "@/hooks/useDemoMode";
import { Service } from "@/types";

interface PendingServicesProps {
  services: Service[];
  isLoading: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

const PendingServices = ({ services, isLoading, onApprove, onReject }: PendingServicesProps) => {
  const { isDemoMode } = useDemoMode();
  const pendingServices = services.filter(service => service.status === "pending");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Pendentes de Aprovação {isDemoMode && <Badge variant="outline">DEMO</Badge>}</CardTitle>
        <CardDescription>
          Analise e aprove os serviços cadastrados pelos moradores
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : pendingServices.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            Não há serviços pendentes de aprovação no momento.
          </p>
        ) : (
          <div className="space-y-4">
            {pendingServices.map(service => (
              <Card key={service.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <Badge>Pendente</Badge>
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
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <p className="text-sm mt-2">
                    <strong>WhatsApp:</strong> {service.whatsapp}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastrado em: {new Date(service.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => onReject(service.id)}
                    size="sm"
                  >
                    Rejeitar
                  </Button>
                  <Button 
                    onClick={() => onApprove(service.id)}
                    size="sm"
                  >
                    Aprovar
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

export default PendingServices;
