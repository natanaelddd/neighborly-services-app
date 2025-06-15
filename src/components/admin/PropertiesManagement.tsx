import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, CheckCircle, XCircle, Clock, Camera, Plus, Star, StarOff, Delete } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types";
import PropertyPhotoManager from "@/components/property/PropertyPhotoManager";
import { useDemoMode } from "@/hooks/useDemoMode";

interface PropertiesManagementProps {
  onUpdateProperty?: (propertyId: number, updatedData: Partial<Property>) => void;
}

const PropertiesManagement = ({ onUpdateProperty }: PropertiesManagementProps) => {
  const { isDemoMode, mockProperties } = useDemoMode();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [featuredProperties, setFeaturedProperties] = useState<number[]>([]);

  useEffect(() => {
    if (isDemoMode) {
      setProperties(mockProperties as Property[]);
      setIsLoading(false);
    } else {
      fetchProperties();
      loadFeaturedProperties();
    }
  }, [isDemoMode]);

  const loadFeaturedProperties = () => {
    const stored = localStorage.getItem('featuredPropertyIds');
    if (stored) {
      setFeaturedProperties(JSON.parse(stored));
    }
  };

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

      console.log('Propriedades carregadas no admin:', data);

      // Transform data to match Property interface
      const transformedProperties: Property[] = (data || []).map(item => {
        console.log('Transformando propriedade no admin:', item);
        return {
          ...item,
          type: item.type as "venda" | "aluguel",
          profiles: item.profiles ? {
            name: item.profiles.name,
            block: item.profiles.block,
            house_number: item.profiles.house_number
          } : undefined,
          property_photos: item.property_photos || []
        };
      });

      setProperties(transformedProperties);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      toast.error("Erro ao carregar propriedades");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (propertyId: number, newStatus: string) => {
    if (isDemoMode) {
      setProperties(properties.map(property => 
        property.id === propertyId ? { ...property, status: newStatus } : property
      ));
      toast.success(`Status da propriedade atualizado para ${newStatus}!`);
      return;
    }

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

  const toggleFeatured = (propertyId: number) => {
    const newFeatured = featuredProperties.includes(propertyId)
      ? featuredProperties.filter(id => id !== propertyId)
      : [...featuredProperties, propertyId];
    
    setFeaturedProperties(newFeatured);
    localStorage.setItem('featuredPropertyIds', JSON.stringify(newFeatured));
    
    const action = newFeatured.includes(propertyId) ? 'adicionada ao' : 'removida do';
    toast.success(`Propriedade ${action} destaque!`);
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

  const handleDeleteProperty = async (propertyId: number) => {
    if (!window.confirm("Deseja excluir esta propriedade? Esta ação não pode ser desfeita.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) {
        console.error('Erro ao excluir propriedade:', error);
        toast.error("Erro ao excluir propriedade.");
        return;
      }

      // Se estava em destaque, remove também dos destaques locais
      const featuredPropertyIdsStr = localStorage.getItem('featuredPropertyIds');
      if (featuredPropertyIdsStr) {
        let featuredPropertyIds: number[] = [];
        try {
          featuredPropertyIds = JSON.parse(featuredPropertyIdsStr);
        } catch (_) {
          featuredPropertyIds = [];
        }
        if (Array.isArray(featuredPropertyIds)) {
          const updatedFeatured = featuredPropertyIds.filter(id => id !== propertyId);
          localStorage.setItem('featuredPropertyIds', JSON.stringify(updatedFeatured));
          setFeaturedProperties(updatedFeatured);
        }
      }

      setProperties(properties.filter(property => property.id !== propertyId));
      toast.success("Propriedade excluída com sucesso!");
    } catch (error) {
      console.error('Erro ao excluir propriedade:', error);
      toast.error("Erro ao excluir propriedade.");
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
        <CardTitle>Gerenciar Propriedades {isDemoMode && <Badge variant="outline">DEMO</Badge>}</CardTitle>
        <CardDescription>
          Gerencie as propriedades cadastradas pelos moradores. Propriedades aprovadas aparecem no site e podem ser destacadas no carousel da página inicial.
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
                      {featuredProperties.includes(property.id) && (
                        <Badge className="bg-yellow-500">
                          <Star className="w-3 h-3 mr-1" />
                          Destaque
                        </Badge>
                      )}
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
                      <div><strong>Fotos:</strong> {property.property_photos?.length || 0} imagem(ns)</div>
                    </div>
                  </div>
                  
                  {property.property_photos && property.property_photos.length > 0 && (
                    <div className="w-full sm:w-32 h-24 flex-shrink-0">
                      <img
                        src={property.property_photos.find(p => p.is_primary)?.photo_url || property.property_photos[0]?.photo_url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          console.error('Erro ao carregar imagem no admin:', e);
                          console.log('URL da imagem que falhou no admin:', e.currentTarget.src);
                        }}
                        onLoad={() => {
                          console.log('Imagem carregada com sucesso no admin:', property.property_photos?.[0]?.photo_url);
                        }}
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
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(property.id, 'pending')}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Marcar como Pendente
                      </Button>
                      
                      <Button
                        variant={featuredProperties.includes(property.id) ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleFeatured(property.id)}
                      >
                        {featuredProperties.includes(property.id) ? (
                          <>
                            <StarOff className="w-4 h-4 mr-2" />
                            Remover Destaque
                          </>
                        ) : (
                          <>
                            <Star className="w-4 h-4 mr-2" />
                            Destacar
                          </>
                        )}
                      </Button>
                    </>
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

                  {/* Botão para deletar a propriedade */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProperty(property.id)}
                    title="Excluir propriedade"
                  >
                    <Delete className="w-4 h-4 mr-2" />
                    Excluir
                  </Button>

                  {!isDemoMode && (
                    <PropertyPhotoManager
                      propertyId={property.id}
                      propertyTitle={property.title}
                      currentPhotos={property.property_photos || []}
                      onPhotosUpdated={fetchProperties}
                    />
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
