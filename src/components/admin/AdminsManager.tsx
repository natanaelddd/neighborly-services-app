
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash } from "lucide-react";
import { toast } from "sonner";

interface AdminsManagerProps {
  admins: string[];
  onAddAdmin: (email: string) => void;
  onRemoveAdmin: (email: string) => void;
}

const AdminsManager = ({ admins, onAddAdmin, onRemoveAdmin }: AdminsManagerProps) => {
  const [newAdmin, setNewAdmin] = useState("");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin || !newAdmin.includes("@")) {
      toast.error("Digite um email válido");
      return;
    }
    
    if (admins.includes(newAdmin)) {
      toast.error("Este email já é um administrador");
      return;
    }
    
    onAddAdmin(newAdmin);
    setNewAdmin("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Administradores do Sistema</CardTitle>
            <CardDescription>
              Gerencie os usuários com acesso administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {admins.map((admin, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span>{admin}</span>
                  {admins.length > 1 && admin !== "admin@example.com" && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemoveAdmin(admin)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Administrador</CardTitle>
            <CardDescription>
              Forneça acesso administrativo a novos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <Label htmlFor="new-admin">Email do Novo Admin</Label>
                <Input
                  id="new-admin"
                  type="email"
                  value={newAdmin}
                  onChange={(e) => setNewAdmin(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Administrador
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminsManager;
