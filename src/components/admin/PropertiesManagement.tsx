
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePropertiesManagement } from "./properties/usePropertiesManagement";
import PropertyFilters from "./properties/PropertyFilters";
import PropertyCard from "./properties/PropertyCard";
import { Property } from "@/types";

interface PropertiesManagementProps {
  onUpdateProperty?: (propertyId: number, updatedData: Partial<Property>) => void;
}

const PropertiesManagement = ({ onUpdateProperty }: PropertiesManagementProps) => {
  const {
    properties,
    filteredProperties,
    isLoading,
    filter,
    setFilter,
    featuredProperties,
    isDemoMode,
    handleStatusChange,
    toggleFeatured,
    handleDeleteProperty,
    fetchProperties
  } = usePropertiesManagement(onUpdateProperty);

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
        
        <PropertyFilters
          filter={filter}
          setFilter={setFilter}
          properties={properties}
        />
      </CardHeader>
      
      <CardContent>
        {filteredProperties.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground">
            {filter === 'all' ? 'Nenhuma propriedade cadastrada.' : `Nenhuma propriedade ${filter === 'pending' ? 'pendente' : filter === 'approved' ? 'aprovada' : 'rejeitada'}.`}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                featuredProperties={featuredProperties}
                isDemoMode={isDemoMode}
                onStatusChange={handleStatusChange}
                onToggleFeatured={toggleFeatured}
                onDeleteProperty={handleDeleteProperty}
                onPhotosUpdated={fetchProperties}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesManagement;
