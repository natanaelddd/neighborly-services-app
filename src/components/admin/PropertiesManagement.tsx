
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: number;
  unit_id: string;
  title: string;
  description: string;
  type: "venda" | "aluguel";
  price?: string;
  bedrooms: number;
  garage_covered: boolean;
  is_renovated: boolean;
  whatsapp: string;
  status: string;
  created_at: string;
  profiles?: {
    name: string;
    block: string;
    house_number: string;
  };
  property_photos?: {
    photo_url: string;
    is_primary: boolean;
  }[];
}

interface PropertiesManagementProps {
  onUpdateProperty?: (propertyId: number, updatedData: Partial<Property>) => void;
}

const PropertiesManagement = ({ onUpdateProperty }: PropertiesManagementProps) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          property_photos (photo_url, is_primary)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propriedades:', error);
        toast.error("Erro ao carregar propriedades");
        return;
      }

      setProperties(data || []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error("Erro ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', propertyId);

      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error("Erro ao atualizar status da propriedade");
        return;
      }

      setProperties(properties.map(property => 
        property.id === propertyId ? { ...property, status: newStatus } : property
      ));

      const statusMessages = {
        approved: "Propriedade aprovada com sucesso!",
        rejected: "Propriedade rejeitada!",
        pending: "Propriedade marcada como pendente!"
      };

      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || "Status atualizado!");
      
      if (onUpdateProperty) {
        onUpdateProperty(propertyId, { status: newStatus });
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error("Erro ao atualizar status");
    }
  };

  const formatWhatsApp = (whatsapp: string) => {
    if (!whatsapp) return '';
    const cleaned = whatsapp.replace(/\D/g, '');
    if (cleaned.length >= 13) {
      return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
    }
    return whatsapp;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aprovada</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeitada</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.status === filter;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Propriedades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Propriedades</CardTitle>
        <CardDescription>
          Gerencie as propriedades cadastradas pelos moradores. Propriedades aprovadas aparecerão no carousel da página inicial.
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todas ({properties.length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pendentes ({properties.filter(p => p.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Aprovadas ({properties.filter(p => p.status === 'approved').length})
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejeitadas ({properties.filter(p => p.status === 'rejected').length})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredProperties.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            {filter === 'all' ? 'Nenhuma propriedade cadastrada.' : `Nenhuma propriedade ${filter === 'pending' ? 'pendente' : filter === 'approved' ? 'aprovada' : 'rejeitada'}.`}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map(property => (
              <div key={property.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      {getStatusBadge(property.status)}
                      <Badge variant="outline">
                        {property.type === 'venda' ? 'Venda' : 'Aluguel'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{property.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                      <div><strong>Proprietário:</strong> {property.profiles?.name}</div>
                      <div><strong>Endereço:</strong> Bloco {property.profiles?.block}, Casa {property.profiles?.house_number}</div>
                      <div><strong>Quartos:</strong> {property.bedrooms}</div>
                      <div><strong>WhatsApp:</strong> {formatWhatsApp(property.whatsapp)}</div>
                      {property.price && <div><strong>Preço:</strong> {property.price}</div>}
                      <div><strong>Características:</strong> 
                        {property.garage_covered && ' Garagem coberta'}
                        {property.is_renovated && ' Reformada'}
                      </div>
                    </div>
                  </div>
                  
                  {property.property_photos && property.property_photos.length > 0 && (
                    <div className="w-full sm:w-32 h-24 flex-shrink-0">
                      <img
                        src={property.property_photos.find(p => p.is_primary)?.photo_url || property.property_photos[0]?.photo_url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 pt-3 border-t">
                  {property.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(property.id, 'approved')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleStatusChange(property.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejeitar
                      </Button>
                    </>
                  )}
                  
                  {property.status === 'approved' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(property.id, 'pending')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Marcar como Pendente
                    </Button>
                  )}
                  
                  {property.status === 'rejected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(property.id, 'pending')}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reabrir
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesManagement;
