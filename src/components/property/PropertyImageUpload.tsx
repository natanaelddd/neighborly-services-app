
import ImageUpload from "@/components/ImageUpload";

interface PropertyImageUploadProps {
  selectedImages: File[];
  onImagesChange: (images: File[]) => void;
}

export const PropertyImageUpload = ({ selectedImages, onImagesChange }: PropertyImageUploadProps) => {
  return (
    <div>
      <ImageUpload
        bucket="property-photos"
        maxFiles={5}
        selectedImages={selectedImages}
        onImagesChange={onImagesChange}
      />
    </div>
  );
};
