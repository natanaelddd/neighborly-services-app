
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Propriedades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center p-6">
          <Loader2 className="h-8 w-8 animate-spin mr-3" />
          <span>Carregando suas propriedades...</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
