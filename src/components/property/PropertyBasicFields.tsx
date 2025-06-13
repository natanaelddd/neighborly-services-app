
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PropertyBasicFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export const PropertyBasicFields = ({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: PropertyBasicFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-sm font-medium">Título do Anúncio *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Casa 3 quartos com reforma completa"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-sm font-medium">Descrição *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva a propriedade, características especiais, localização dentro do condomínio..."
          rows={4}
          required
          className="mt-1"
        />
      </div>
    </>
  );
};
