
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "./ImageUpload";
import ServiceBasicFields from "./forms/ServiceBasicFields";
import ServiceCategorySelect from "./forms/ServiceCategorySelect";
import WhatsAppInput from "./forms/WhatsAppInput";
import { useServiceForm } from "@/hooks/useServiceForm";

const ServiceForm = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    categories,
    isLoading,
    selectedImages,
    setSelectedImages,
    handleSubmit
  } = useServiceForm();

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Cadastrar Serviço</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Ofereça seus serviços para a comunidade do Evidence Resort
              </p>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Briefcase className="h-5 w-5 shrink-0" />
                <span>Informações do Serviço</span>
              </CardTitle>
              <CardDescription className="text-sm">
                Preencha as informações do seu serviço. Após o cadastro, seu serviço será analisado pela administração.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <ServiceBasicFields
                  title={formData.title}
                  description={formData.description}
                  houseNumber={formData.houseNumber}
                  onTitleChange={(value) => setFormData({...formData, title: value})}
                  onDescriptionChange={(value) => setFormData({...formData, description: value})}
                  onHouseNumberChange={(value) => setFormData({...formData, houseNumber: value})}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <ServiceCategorySelect
                    categories={categories}
                    categoryId={formData.categoryId}
                    onCategoryChange={(value) => setFormData({...formData, categoryId: value})}
                  />

                  <WhatsAppInput
                    value={formData.whatsapp}
                    onChange={(value) => setFormData({...formData, whatsapp: value})}
                  />
                </div>

                <div>
                  <ImageUpload
                    bucket="service-photos"
                    maxFiles={1}
                    selectedImages={selectedImages}
                    onImagesChange={setSelectedImages}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isLoading}
                    className="flex-1 order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 order-1 sm:order-2"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Salvando...' : 'Cadastrar Serviço'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm;
