
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState = ({ error, onRetry }: ErrorStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Propriedades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Erro ao Carregar</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
