
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Star, StarOff, Delete } from "lucide-react";
import PropertyPhotoManager from "@/components/property/PropertyPhotoManager";
import { Property } from "@/types";

interface PropertyActionsProps {
  property: Property;
  featuredProperties: number[];
  isDemoMode: boolean;
  onStatusChange: (propertyId: number, newStatus: string) => void;
  onToggleFeatured: (propertyId: number) => void;
  onDeleteProperty: (propertyId: number) => void;
  onPhotosUpdated: () => void;
}

const PropertyActions = ({
  property,
  featuredProperties,
  isDemoMode,
  onStatusChange,
  onToggleFeatured,
  onDeleteProperty,
  onPhotosUpdated
}: PropertyActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 pt-3 border-t">
      {property.status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => onStatusChange(property.id, 'approved')}
            type="button"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Aprovar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onStatusChange(property.id, 'rejected')}
            type="button"
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
            onClick={() => onStatusChange(property.id, 'pending')}
            type="button"
          >
            <Clock className="w-4 h-4 mr-2" />
            Marcar como Pendente
          </Button>
          
          <Button
            variant={featuredProperties.includes(property.id) ? "destructive" : "default"}
            size="sm"
            onClick={() => onToggleFeatured(property.id)}
            type="button"
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
          onClick={() => onStatusChange(property.id, 'pending')}
          type="button"
        >
          <Clock className="w-4 h-4 mr-2" />
          Reabrir
        </Button>
      )}

      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeleteProperty(property.id)}
        title="Excluir propriedade"
        type="button"
      >
        <Delete className="w-4 h-4 mr-2" />
        Excluir
      </Button>

      {!isDemoMode && (
        <PropertyPhotoManager
          propertyId={property.id}
          propertyTitle={property.title}
          currentPhotos={property.property_photos || []}
          onPhotosUpdated={onPhotosUpdated}
        />
      )}
    </div>
  );
};

export default PropertyActions;
