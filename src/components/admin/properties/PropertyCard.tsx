
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { Property } from "@/types";
import PropertyActions from "./PropertyActions";

interface PropertyCardProps {
  property: Property;
  featuredProperties: number[];
  isDemoMode: boolean;
  onStatusChange: (propertyId: number, newStatus: string) => void;
  onToggleFeatured: (propertyId: number) => void;
  onDeleteProperty: (propertyId: number) => void;
  onPhotosUpdated: () => void;
}

const PropertyCard = ({
  property,
  featuredProperties,
  isDemoMode,
  onStatusChange,
  onToggleFeatured,
  onDeleteProperty,
  onPhotosUpdated
}: PropertyCardProps) => {
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

  return (
    <div className="border rounded-lg p-4 space-y-4">
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
      
      <PropertyActions
        property={property}
        featuredProperties={featuredProperties}
        isDemoMode={isDemoMode}
        onStatusChange={onStatusChange}
        onToggleFeatured={onToggleFeatured}
        onDeleteProperty={onDeleteProperty}
        onPhotosUpdated={onPhotosUpdated}
      />
    </div>
  );
};

export default PropertyCard;
