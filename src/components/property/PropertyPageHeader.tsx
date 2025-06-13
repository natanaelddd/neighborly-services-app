
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PropertyPageHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 mb-4 sm:mb-6">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => navigate(-1)}
        className="shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Anunciar Propriedade</h1>
        <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
          Anuncie sua casa ou apartamento no Evidence Resort
        </p>
      </div>
    </div>
  );
};
