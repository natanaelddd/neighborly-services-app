
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyFormButtonsProps {
  isLoading: boolean;
}

export const PropertyFormButtons = ({ isLoading }: PropertyFormButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate(-1)}
        disabled={isLoading}
        className="flex-1 order-2 sm:order-1"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 order-1 sm:order-2"
      >
        <Save className="mr-2 h-4 w-4" />
        {isLoading ? 'Salvando...' : 'Cadastrar Propriedade'}
      </Button>
    </div>
  );
};
