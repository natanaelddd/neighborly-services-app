
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, ImageIcon, Plus } from "lucide-react";
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

  const canAddMore = (selectedImages.length + existingUrls.length) < maxFiles;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          {maxFiles === 1 ? 'Imagem' : `Imagens (máximo ${maxFiles})`}
        </Label>
        
        {/* Botão personalizado mais destacado */}
        <div className="relative">
          <Input
            type="file"
            accept="image/*"
            multiple={maxFiles > 1}
            onChange={handleFileSelect}
            disabled={uploading || !canAddMore}
            className="sr-only"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className={`
              flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200
              ${canAddMore && !uploading 
                ? 'border-primary bg-primary/5 hover:bg-primary/10 hover:border-primary/70' 
                : 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-50'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <div className={`
                w-12 h-12 mb-3 rounded-full flex items-center justify-center
                ${canAddMore && !uploading 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-300 text-gray-500'
                }
              `}>
                {canAddMore && !uploading ? <Plus className="w-6 h-6" /> : <ImageIcon className="w-6 h-6" />}
              </div>
              <p className={`mb-2 text-sm font-medium ${canAddMore && !uploading ? 'text-primary' : 'text-gray-500'}`}>
                {canAddMore 
                  ? `Clique para ${maxFiles === 1 ? 'adicionar imagem' : 'adicionar imagens'}`
                  : maxFiles === 1 
                    ? 'Imagem já adicionada' 
                    : `Máximo de ${maxFiles} imagens atingido`
                }
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, WebP (máx. 5MB cada)
              </p>
            </div>
          </Label>
        </div>
      </div>

      {(selectedImages.length > 0 || existingUrls.length > 0) && (
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Pré-visualização</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Imagens existentes */}
            {existingUrls.map((url, index) => (
              <div key={`existing-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
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
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => removeExistingImage(url, index)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                {index === 0 && existingUrls.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-sm">
                    Principal
                  </div>
                )}
              </div>
            ))}

            {/* Novas imagens selecionadas */}
            {selectedImages.map((file, index) => (
              <div key={`new-${index}`} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
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
                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                {existingUrls.length === 0 && index === 0 && selectedImages.length > 1 && (
                  <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded shadow-sm">
                    Principal
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
