
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Service, Category } from "@/types";
import { PlusCircle, Edit, Trash, Eye, EyeOff } from "lucide-react";

const AdminDashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<string[]>(["admin@example.com"]);
  const [newAdmin, setNewAdmin] = useState("");
  const [showRecommendationsMenu, setShowRecommendationsMenu] = useState(false);
  
  // New states for category management
  const [newCategory, setNewCategory] = useState({ name: "", icon: "" });
  
  // New states for featured ad management
  const [featuredAd, setFeaturedAd] = useState({
    title: "Evidence Resort - Seu novo lar",
    description: "Localizado em uma região privilegiada, o Evidence Resort conta com 5 blocos de casas modernas e confortáveis.",
    imageUrl: "/lovable-uploads/85911a86-bc61-477f-aeef-601c1571370b.png"
  });

  // New states for menu management
  const [menuItems, setMenuItems] = useState([
    { id: 1, label: "Início", path: "/", visible: true },
    { id: 2, label: "Categorias", path: "/categories", visible: true },
    { id: 3, label: "Sobre", path: "/about", visible: true },
    { id: 4, label: "Contato", path: "/contact", visible: true },
    { id: 5, label: "Indicações", path: "/recommendations", visible: false },
  ]);

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
      
      // Mock categories data
      const mockCategories: Category[] = [
        {
          id: 1,
          name: "Limpeza",
          icon: "🧹",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Manutenção",
          icon: "🔧",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      
      setServices(mockServices);
      setCategories(mockCategories);
      setIsLoading(false);
    }, 1000);

    // Check if recommendations menu is enabled
    const storedShowRecommendations = localStorage.getItem("showRecommendationsMenu");
    if (storedShowRecommendations) {
      setShowRecommendationsMenu(JSON.parse(storedShowRecommendations));
    }
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    
    const category: Category = {
      id: newId,
      name: newCategory.name,
      icon: newCategory.icon,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCategories([...categories, category]);
    setNewCategory({ name: "", icon: "" });
    toast.success("Categoria adicionada com sucesso!");
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    toast.success("Categoria removida com sucesso!");
  };

  const handleSaveFeaturedAd = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Anúncio em destaque atualizado com sucesso!");
  };

  const toggleMenuItem = (id: number, visible: boolean) => {
    const updatedMenuItems = menuItems.map(item => 
      item.id === id ? { ...item, visible } : item
    );
    setMenuItems(updatedMenuItems);
    toast.success(`Menu ${visible ? 'ativado' : 'desativado'} com sucesso!`);
  };

  const toggleRecommendationsMenu = () => {
    const newValue = !showRecommendationsMenu;
    setShowRecommendationsMenu(newValue);
    localStorage.setItem("showRecommendationsMenu", JSON.stringify(newValue));
    
    // Update menu items visibility
    const updatedMenuItems = menuItems.map(item => 
      item.label === "Indicações" ? { ...item, visible: newValue } : item
    );
    setMenuItems(updatedMenuItems);
    
    toast.success(newValue 
      ? "Menu de Indicações ativado! Será visível no site." 
      : "Menu de Indicações desativado! Não será visível no site."
    );
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
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Painel do Administrador - Vitrine Evidence</h1>
      
      <Tabs defaultValue="pending-services">
        <TabsList className="mb-6 flex flex-wrap">
          <TabsTrigger value="pending-services">Serviços Pendentes</TabsTrigger>
          <TabsTrigger value="all-services">Todos Serviços</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="featured-ad">Anúncio em Destaque</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="recommendations">Indicações</TabsTrigger>
          <TabsTrigger value="admins">Administradores</TabsTrigger>
        </TabsList>

        {/* Serviços Pendentes */}
        <TabsContent value="pending-services">
          <Card>
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
                            <Badge>Pendente</Badge>
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
        </TabsContent>
        
        {/* Todos Serviços */}
        <TabsContent value="all-services">
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
        </TabsContent>
        
        {/* Categorias */}
        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>
                    Gerencie as categorias de serviços disponíveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">
                      Nenhuma categoria cadastrada.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {categories.map(category => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{category.icon}</span>
                            <span>{category.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Categoria</CardTitle>
                  <CardDescription>
                    Crie uma nova categoria de serviços
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div>
                      <Label htmlFor="category-name">Nome da Categoria</Label>
                      <Input
                        id="category-name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        placeholder="Ex: Limpeza, Manutenção"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category-icon">Ícone (emoji)</Label>
                      <Input
                        id="category-icon"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                        placeholder="Ex: 🧹, 🔧"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Categoria
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Anúncio em Destaque */}
        <TabsContent value="featured-ad">
          <Card>
            <CardHeader>
              <CardTitle>Anúncio em Destaque</CardTitle>
              <CardDescription>
                Personalize o anúncio em destaque na página inicial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveFeaturedAd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ad-title">Título do Anúncio</Label>
                      <Input
                        id="ad-title"
                        value={featuredAd.title}
                        onChange={(e) => setFeaturedAd({...featuredAd, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ad-description">Descrição</Label>
                      <Textarea
                        id="ad-description"
                        value={featuredAd.description}
                        onChange={(e) => setFeaturedAd({...featuredAd, description: e.target.value})}
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ad-image">URL da Imagem</Label>
                      <Input
                        id="ad-image"
                        value={featuredAd.imageUrl}
                        onChange={(e) => setFeaturedAd({...featuredAd, imageUrl: e.target.value})}
                        placeholder="/path/to/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-2">Pré-visualização</h3>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                      <img 
                        src={featuredAd.imageUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h4 className="font-bold">{featuredAd.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {featuredAd.description.length > 100
                        ? `${featuredAd.description.substring(0, 100)}...`
                        : featuredAd.description}
                    </p>
                  </div>
                </div>
                
                <Button type="submit">Salvar Alterações</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Menu */}
        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento do Menu</CardTitle>
              <CardDescription>
                Personalize as opções de menu do site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span className="font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground ml-2">({item.path})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.visible ? "default" : "outline"}>
                        {item.visible ? "Visível" : "Oculto"}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => toggleMenuItem(item.id, !item.visible)}
                        disabled={item.label === "Início" || (item.label === "Indicações" && !showRecommendationsMenu)}
                      >
                        {item.visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Menu de Indicações</h3>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">
                          O menu de indicações permite cadastrar serviços de pessoas que não moram no condomínio.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Status atual: {showRecommendationsMenu ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                      <Button
                        variant={showRecommendationsMenu ? "outline" : "default"}
                        onClick={toggleRecommendationsMenu}
                      >
                        {showRecommendationsMenu ? "Desativar" : "Ativar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Indicações */}
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Indicações</CardTitle>
              <CardDescription>
                Cadastre serviços de pessoas que não moram no condomínio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showRecommendationsMenu ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        O menu de indicações está desativado. Para gerenciar indicações, primeiro ative este recurso na aba "Menu".
                      </p>
                      <Button 
                        variant="link" 
                        className="text-yellow-700 p-0 h-auto mt-1"
                        onClick={() => toggleRecommendationsMenu()}
                      >
                        Ativar agora
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  Funcionalidade de indicações será implementada futuramente.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Administradores */}
        <TabsContent value="admins">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Administradores do Sistema</CardTitle>
                  <CardDescription>
                    Gerencie os usuários com acesso administrativo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {admins.map((admin, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
                            <Trash className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Administrador</CardTitle>
                  <CardDescription>
                    Forneça acesso administrativo a novos usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                    <div>
                      <Label htmlFor="new-admin">Email do Novo Admin</Label>
                      <Input
                        id="new-admin"
                        type="email"
                        value={newAdmin}
                        onChange={(e) => setNewAdmin(e.target.value)}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Adicionar Administrador
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;
