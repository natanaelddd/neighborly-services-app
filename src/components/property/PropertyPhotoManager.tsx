import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Plus, X, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "@/components/ImageUpload";

interface PropertyPhotoManagerProps {
  propertyId: number;
  propertyTitle: string;
  currentPhotos: { photo_url: string; is_primary: boolean }[];
  onPhotosUpdated: () => void;
}

const PropertyPhotoManager = ({ propertyId, propertyTitle, currentPhotos, onPhotosUpdated }: PropertyPhotoManagerProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>(
    currentPhotos.map(photo => photo.photo_url)
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const movePhotoUp = (index: number) => {
    if (index === 0) return;
    const newUrls = [...existingUrls];
    [newUrls[index], newUrls[index - 1]] = [newUrls[index - 1], newUrls[index]];
    setExistingUrls(newUrls);
  };

  const movePhotoDown = (index: number) => {
    if (index === existingUrls.length - 1) return;
    const newUrls = [...existingUrls];
    [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
    setExistingUrls(newUrls);
  };

  const handleSavePhotos = async () => {
    setIsUploading(true);
    try {
      // Upload new images
      if (selectedImages.length > 0) {
        const uploadPromises = selectedImages.map(async (file, index) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `property-${propertyId}-${Date.now()}-${index}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property-photos')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('property-photos')
            .getPublicUrl(fileName);

          return publicUrl;
        });

        const newUrls = await Promise.all(uploadPromises);
        const combinedUrls = [...existingUrls, ...newUrls];
        setExistingUrls(combinedUrls);
      }

      // Remove old photos from database
      const { error: deleteOldError } = await supabase
        .from('property_photos')
        .delete()
        .eq('property_id', propertyId);

      if (deleteOldError) throw deleteOldError;

      // Insert all photos with correct order
      const photoInserts = existingUrls.map((url, index) => ({
        property_id: propertyId,
        photo_url: url,
        is_primary: index === 0
      }));

      const { error: insertError } = await supabase
        .from('property_photos')
        .insert(photoInserts);

      if (insertError) throw insertError;

      // Handle removed photos from storage
      const removedUrls = currentPhotos
        .map(photo => photo.photo_url)
        .filter(url => !existingUrls.includes(url));

      if (removedUrls.length > 0) {
        for (const url of removedUrls) {
          const fileName = url.split('/').pop();
          if (fileName) {
            await supabase.storage
              .from('property-photos')
              .remove([fileName]);
          }
        }
      }

      toast.success("Fotos atualizadas com sucesso!");
      setSelectedImages([]);
      setIsOpen(false);
      onPhotosUpdated();
    } catch (error) {
      console.error('Erro ao atualizar fotos:', error);
      toast.error("Erro ao atualizar fotos");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Camera className="w-4 h-4 mr-2" />
          Gerenciar Fotos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Fotos - {propertyTitle}</DialogTitle>
          <DialogDescription>
            Adicione ou remova fotos da sua propriedade. A primeira foto será definida como principal. Use as setas para reordenar.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Existing photos with reorder controls */}
          {existingUrls.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Fotos Atuais</h4>
              {existingUrls.map((url, index) => (
                <div key={url} className="flex items-center gap-2 p-2 border rounded">
                  <img src={url} alt={`Foto ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                  <span className="flex-1 text-sm">
                    {index === 0 ? "Foto Principal" : `Foto ${index + 1}`}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => movePhotoUp(index)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => movePhotoDown(index)}
                      disabled={index === existingUrls.length - 1}
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setExistingUrls(existingUrls.filter((_, i) => i !== index))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <ImageUpload
            bucket="property-photos"
            maxFiles={10}
            selectedImages={selectedImages}
            onImagesChange={setSelectedImages}
          />
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedImages([]);
                setExistingUrls(currentPhotos.map(photo => photo.photo_url));
                setIsOpen(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSavePhotos}
              disabled={isUploading}
            >
              {isUploading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPhotoManager;
