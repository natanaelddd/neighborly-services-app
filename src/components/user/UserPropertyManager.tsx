
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Home } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import PropertyPhotoManager from "@/components/property/PropertyPhotoManager";

const UserPropertyManager = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProperties();
    }
  }, [user]);

  const fetchUserProperties = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:unit_id (name, block, house_number),
          property_photos (photo_url, is_primary)
        `)
        .eq('unit_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar propriedades do usuário:', error);
        toast.error("Erro ao carregar suas propriedades");
        return;
      }

      const transformedProperties: Property[] = (data || []).map(item => ({
        ...item,
        type: item.type as "venda" | "aluguel",
        profiles: item.profiles ? {
          name: item.profiles.name,
          block: item.profiles.block,
          house_number: item.profiles.house_number
        } : undefined,
        property_photos: item.property_photos || []
      }));

      setProperties(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error("Erro ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Minhas Propriedades</CardTitle>
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
        <CardTitle>Minhas Propriedades</CardTitle>
        <CardDescription>
          Gerencie suas propriedades cadastradas. Você pode adicionar ou editar fotos de suas propriedades.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma propriedade cadastrada</h3>
            <p className="text-gray-500 mb-4">Cadastre sua primeira propriedade para começar.</p>
            <Button onClick={() => window.location.href = '/nova-propriedade'}>
              Cadastrar Propriedade
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map(property => (
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
                      <div><strong>Quartos:</strong> {property.bedrooms}</div>
                      {property.price && <div><strong>Preço:</strong> {property.price}</div>}
                      <div><strong>Características:</strong> 
                        {property.garage_covered && ' Garagem coberta'}
                        {property.is_renovated && ' Reformada'}
                      </div>
                      <div><strong>Fotos:</strong> {property.property_photos?.length || 0} imagem(ns)</div>
                    </div>

                    {property.status === 'rejected' && property.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Motivo da rejeição:</strong> {property.rejection_reason}
                        </p>
                      </div>
                    )}
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
                
                <div className="flex gap-2 pt-3 border-t">
                  <PropertyPhotoManager
                    propertyId={property.id}
                    propertyTitle={property.title}
                    currentPhotos={property.property_photos || []}
                    onPhotosUpdated={fetchUserProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPropertyManager;
