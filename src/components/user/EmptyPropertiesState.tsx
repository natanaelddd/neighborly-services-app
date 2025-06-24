
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyPropertiesState = () => {
  return (
    <div className="text-center py-12">
      <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma propriedade cadastrada</h3>
      <p className="text-gray-500 mb-4">Cadastre sua primeira propriedade para começar.</p>
      <Link to="/properties/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Propriedade
        </Button>
      </Link>
    </div>
  );
};

export default EmptyPropertiesState;
