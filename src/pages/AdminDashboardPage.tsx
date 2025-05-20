
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Service } from "@/types";

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<string[]>(["admin@example.com"]);
  const [newAdmin, setNewAdmin] = useState("");

  useEffect(() => {
    // In a real app, this would fetch from a database
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock service data
      const mockServices: Service[] = [
        {
          id: 1,
          unitId: 1,
          categoryId: 1,
          title: "Limpeza Residencial",
          description: "Serviço de limpeza completa para residências",
          whatsapp: "16992701617",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          unitId: 2,
          categoryId: 2,
          title: "Encanador Profissional",
          description: "Reparos e instalações hidráulicas",
          whatsapp: "16992701617",
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setServices(mockServices);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, status: "approved" } : service
    ));
    toast.success("Serviço aprovado com sucesso!");
  };

  const handleReject = (serviceId: number) => {
    setServices(services.map(service => 
      service.id === serviceId ? { ...service, status: "rejected" } : service
    ));
    toast.success("Serviço rejeitado!");
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin || !newAdmin.includes("@")) {
      toast.error("Digite um email válido");
      return;
    }
    
    if (admins.includes(newAdmin)) {
      toast.error("Este email já é um administrador");
      return;
    }
    
    setAdmins([...admins, newAdmin]);
    setNewAdmin("");
    toast.success("Administrador adicionado com sucesso!");
  };

  if (!isAdmin) {
    return (
      <div className="container-custom py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Acesso Restrito</h1>
          <p className="mb-6 text-gray-600">
            Esta página é exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Serviços Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Analise e aprove os serviços cadastrados pelos moradores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : services.filter(s => s.status === "pending").length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">
                  Não há serviços pendentes de aprovação no momento.
                </p>
              ) : (
                <div className="space-y-4">
                  {services
                    .filter(service => service.status === "pending")
                    .map(service => (
                      <Card key={service.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <Badge>{service.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-sm mt-2">
                            <strong>WhatsApp:</strong> {service.whatsapp}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="destructive" 
                            onClick={() => handleReject(service.id)}
                            size="sm"
                          >
                            Rejeitar
                          </Button>
                          <Button 
                            onClick={() => handleApprove(service.id)}
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
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Administradores</CardTitle>
              <CardDescription>
                Adicione novos administradores para o site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label htmlFor="new-admin" className="block text-sm font-medium mb-1">
                    Email do Novo Admin
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="new-admin"
                      type="email"
                      value={newAdmin}
                      onChange={(e) => setNewAdmin(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <Button type="submit">Adicionar</Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Administradores Atuais</h3>
                <ul className="space-y-2">
                  {admins.map((admin, index) => (
                    <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <span>{admin}</span>
                      {admins.length > 1 && admin !== "admin@example.com" && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setAdmins(admins.filter(a => a !== admin));
                            toast.success("Administrador removido com sucesso!");
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
