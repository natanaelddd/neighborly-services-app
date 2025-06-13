
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import PropertyFormErrorHandler from "@/components/PropertyFormErrorHandler";
import { PropertyBasicFields } from "./PropertyBasicFields";
import { PropertyTypeAndPrice } from "./PropertyTypeAndPrice";
import { PropertyCharacteristics } from "./PropertyCharacteristics";
import { PropertyImageUpload } from "./PropertyImageUpload";
import { PropertyFormButtons } from "./PropertyFormButtons";
import WhatsAppInput from "@/components/forms/WhatsAppInput";
import { usePropertyForm } from "@/hooks/usePropertyForm";

const PropertyForm = () => {
  const {
    formData,
    setFormData,
    isLoading,
    selectedImages,
    setSelectedImages,
    error,
    handleSubmit,
    handleRetry
  } = usePropertyForm();

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Home className="h-5 w-5 shrink-0" />
          <span>Informações da Propriedade</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Preencha as informações da sua propriedade. Após o cadastro, o anúncio será analisado pela administração.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <PropertyFormErrorHandler error={error} onRetry={handleRetry} />
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <PropertyBasicFields
            title={formData.title}
            description={formData.description}
            onTitleChange={(title) => setFormData({...formData, title})}
            onDescriptionChange={(description) => setFormData({...formData, description})}
          />

          <PropertyTypeAndPrice
            type={formData.type}
            price={formData.price}
            bedrooms={formData.bedrooms}
            onTypeChange={(type) => setFormData({...formData, type})}
            onPriceChange={(price) => setFormData({...formData, price})}
            onBedroomsChange={(bedrooms) => setFormData({...formData, bedrooms})}
          />

          <PropertyCharacteristics
            garageCovered={formData.garageCovered}
            isRenovated={formData.isRenovated}
            onGarageChange={(garageCovered) => setFormData({...formData, garageCovered})}
            onRenovatedChange={(isRenovated) => setFormData({...formData, isRenovated})}
          />

          <WhatsAppInput
            value={formData.whatsapp}
            onChange={(whatsapp) => setFormData({...formData, whatsapp})}
          />

          <PropertyImageUpload
            selectedImages={selectedImages}
            onImagesChange={setSelectedImages}
          />

          <PropertyFormButtons isLoading={isLoading} />
        </form>
      </CardContent>
    </Card>
  );
};

export default PropertyForm;
