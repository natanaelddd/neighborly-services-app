
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";

const PropertiesPage = () => {
  return (
    <div className="container-custom py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Em breve listaremos todas as propriedades anunciadas pelos moradores!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPage;
