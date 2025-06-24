
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types";
import PropertyStatusBadge from "./PropertyStatusBadge";
import PropertyPhotoManager from "@/components/property/PropertyPhotoManager";

interface PropertyCardProps {
  property: Property;
  onPhotosUpdated: () => void;
}

const PropertyCard = ({ property, onPhotosUpdated }: PropertyCardProps) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{property.title}</h3>
            <PropertyStatusBadge status={property.status} />
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
          onPhotosUpdated={onPhotosUpdated}
        />
      </div>
    </div>
  );
};

export default PropertyCard;
