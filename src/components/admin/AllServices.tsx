
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Service } from "@/types";

interface AllServicesProps {
  services: Service[];
  isLoading: boolean;
}

const AllServices = ({ services, isLoading }: AllServicesProps) => {
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
                    <Badge 
                      className={
                        service.status === "approved" 
                          ? "bg-green-500" 
                          : service.status === "rejected" 
                          ? "bg-red-500" 
                          : ""
                      }
                    >
                      {service.status === "approved" 
                        ? "Aprovado" 
                        : service.status === "rejected" 
                        ? "Rejeitado" 
                        : "Pendente"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
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
