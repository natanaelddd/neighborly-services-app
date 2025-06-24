
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useUserProperties } from "@/hooks/useUserProperties";
import UnauthenticatedState from "./UnauthenticatedState";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import EmptyPropertiesState from "./EmptyPropertiesState";
import PropertyCard from "./PropertyCard";

const UserPropertyManager = () => {
  const { user } = useAuth();
  const { properties, isLoading, error, refetch } = useUserProperties();

  if (!user) {
    return <UnauthenticatedState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
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
          <EmptyPropertiesState />
        ) : (
          <div className="space-y-4">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onPhotosUpdated={refetch}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPropertyManager;
