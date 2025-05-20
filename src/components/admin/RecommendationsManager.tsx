
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RecommendationsManagerProps {
  showRecommendationsMenu: boolean;
  onToggleRecommendations: () => void;
}

const RecommendationsManager = ({ 
  showRecommendationsMenu, 
  onToggleRecommendations 
}: RecommendationsManagerProps) => {
  return (
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
                  onClick={onToggleRecommendations}
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
  );
};

export default RecommendationsManager;
