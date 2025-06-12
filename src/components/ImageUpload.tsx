
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  bucket: string;
  maxFiles: number;
  selectedImages: File[];
  onImagesChange: (images: File[]) => void;
  existingUrls?: string[];
  onExistingUrlsChange?: (urls: string[]) => void;
}

const ImageUpload = ({ 
  bucket, 
  maxFiles, 
  selectedImages, 
  onImagesChange,
  existingUrls = [],
  onExistingUrlsChange
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = selectedImages.length + existingUrls.length;
    
    if (totalImages + files.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} ${maxFiles === 1 ? 'imagem' : 'imagens'} permitido${maxFiles === 1 ? '' : 's'}`);
      return;
    }

    // Validar tipos de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error("Apenas arquivos JPG, PNG e WebP são permitidos");
      return;
    }

    // Validar tamanho (max 5MB por arquivo)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Cada imagem deve ter no máximo 5MB");
      return;
    }

    onImagesChange([...selectedImages, ...files]);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeExistingImage = async (url: string, index: number) => {
    if (!onExistingUrlsChange) return;
    
    setUploading(true);
    try {
      // Extrair o path do arquivo da URL
      const filePath = url.split('/').pop();
      if (filePath) {
        const { error } = await supabase.storage
          .from(bucket)
          .remove([filePath]);
        
        if (error) {
          console.error('Erro ao remover imagem:', error);
          toast.error("Erro ao remover imagem");
          return;
        }
      }
      
      const newUrls = existingUrls.filter((_, i) => i !== index);
      onExistingUrlsChange(newUrls);
      toast.success("Imagem removida com sucesso");
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast.error("Erro ao remover imagem");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{maxFiles === 1 ? 'Imagem' : `Imagens (máximo ${maxFiles})`}</Label>
        <div className="mt-2">
          <Input
            type="file"
            accept="image/*"
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
            disabled={uploading || (selectedImages.length + existingUrls.length) >= maxFiles}
            className="cursor-pointer"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Formatos aceitos: JPG, PNG, WebP (máximo 5MB cada)
        </p>
      </div>

      {(selectedImages.length > 0 || existingUrls.length > 0) && (
        <div>
          <Label>Pré-visualização</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {/* Imagens existentes */}
            {existingUrls.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src={url} 
                    alt={`Imagem existente ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeExistingImage(url, index)}
                  disabled={uploading}
                >
                  <X className="h-3 w-3" />
                </Button>
                {index === 0 && existingUrls.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}

            {/* Novas imagens selecionadas */}
            {selectedImages.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {existingUrls.length === 0 && index === 0 && selectedImages.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(selectedImages.length + existingUrls.length) === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            {maxFiles === 1 ? 'Selecione uma imagem' : `Selecione até ${maxFiles} imagens`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
