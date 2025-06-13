
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { useDemoMode } from "@/hooks/useDemoMode";
import { toast } from "sonner";

const DemoModeToggle = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();

  const handleToggle = () => {
    if (isDemoMode) {
      disableDemoMode();
      toast.success("Modo demo desativado");
      // Recarregar a página para atualizar os dados
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else {
      enableDemoMode();
      toast.success("Modo demo ativado! Dados de demonstração carregados.");
      // Recarregar a página para carregar os dados demo
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2">
        {isDemoMode && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Modo Demo Ativo
          </Badge>
        )}
        <Button
          variant={isDemoMode ? "destructive" : "default"}
          size="sm"
          onClick={handleToggle}
          className="shadow-lg"
        >
          {isDemoMode ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Desativar Demo
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Ativar Demo
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DemoModeToggle;
