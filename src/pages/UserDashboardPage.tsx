
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Home, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import UserServiceEditor from "@/components/user/UserServiceEditor";
import UserPropertyManager from "@/components/user/UserPropertyManager";

const UserDashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Olá, {user?.name}! 👋
        </h1>
        <Button variant="outline" onClick={logout}>
          Sair
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Meus Serviços
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Minhas Propriedades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Cadastrar Novo Serviço
                </CardTitle>
                <CardDescription>
                  Adicione um novo serviço para oferecer aos moradores do condomínio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/novo-servico">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Serviço
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Cadastrar Propriedade
                </CardTitle>
                <CardDescription>
                  Anuncie sua casa ou apartamento para venda ou aluguel.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/nova-propriedade">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Propriedade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <UserServiceEditor />
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <UserPropertyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardPage;
