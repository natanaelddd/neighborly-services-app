
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { useDemoMode } from "@/hooks/useDemoMode";

const DemoModeToggle = () => {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2">
        {isDemoMode && <Badge variant="secondary">Modo Demo Ativo</Badge>}
        <Button
          variant={isDemoMode ? "destructive" : "default"}
          size="sm"
          onClick={isDemoMode ? disableDemoMode : enableDemoMode}
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
