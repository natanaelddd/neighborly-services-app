
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthenticatedState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Propriedades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-orange-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Acesso Restrito</h3>
          <p className="text-gray-500 mb-4">Você precisa estar logado para ver suas propriedades.</p>
          <Link to="/login">
            <Button>Fazer Login</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnauthenticatedState;
