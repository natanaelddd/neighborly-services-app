
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
}

interface MenuManagerProps {
  menuItems: MenuItem[];
  showRecommendationsMenu: boolean;
  onToggleMenuItem: (id: number, visible: boolean) => void;
  onToggleRecommendations: () => void;
}

const MenuManager = ({ 
  menuItems, 
  showRecommendationsMenu, 
  onToggleMenuItem, 
  onToggleRecommendations 
}: MenuManagerProps) => {
  
  const handleToggleItem = (id: number, visible: boolean) => {
    onToggleMenuItem(id, visible);
    
    // Salvar no localStorage
    const updatedItems = menuItems.map(item => 
      item.id === id ? { ...item, visible } : item
    );
    
    const menuConfig = updatedItems.reduce((acc, item) => {
      const key = item.label.toLowerCase().replace(' ', '');
      acc[key] = item.visible;
      return acc;
    }, {} as Record<string, boolean>);
    
    localStorage.setItem('menuItems', JSON.stringify(menuConfig));
    toast.success(`Menu "${updatedItems.find(i => i.id === id)?.label}" ${visible ? 'ativado' : 'desativado'}`);
  };

  const handleToggleRecommendations = () => {
    onToggleRecommendations();
    localStorage.setItem('showRecommendationsMenu', JSON.stringify(!showRecommendationsMenu));
    toast.success(`Menu de indicações ${!showRecommendationsMenu ? 'ativado' : 'desativado'}`);
  };

  return (
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
                  onClick={() => handleToggleItem(item.id, !item.visible)}
                  disabled={item.label === "Início"}
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
                  onClick={handleToggleRecommendations}
                >
                  {showRecommendationsMenu ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuManager;
