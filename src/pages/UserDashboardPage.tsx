
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Settings, Home, Briefcase, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import UserPropertyManager from "@/components/user/UserPropertyManager";

const UserDashboardPage = () => {
  const { profile, logout, user, isLoading } = useAuth();

  console.log('UserDashboardPage - Debug info:', {
    user: user?.email,
    profile: profile?.name,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-custom py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Você precisa estar logado para acessar esta página.
            </p>
            <div className="flex justify-center mt-4">
              <Link to="/login">
                <Button>Fazer Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Olá, {profile?.name || user.email?.split('@')[0] || 'Usuário'}! 👋
        </h1>
        <Button variant="outline" onClick={logout}>
          Sair
        </Button>
      </div>

      {!profile && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-orange-800">
              <strong>Atenção:</strong> Seu perfil ainda não foi completamente configurado. 
              Algumas funcionalidades podem estar limitadas.
            </p>
          </CardContent>
        </Card>
      )}

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
                <Link to="/servicos/novo">
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
                <Link to="/properties/new">
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar Propriedade
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meus Serviços Cadastrados</CardTitle>
              <CardDescription>
                Em breve você poderá visualizar e gerenciar seus serviços aqui.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Gerenciamento de serviços será implementado em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-6">
          <UserPropertyManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardPage;
