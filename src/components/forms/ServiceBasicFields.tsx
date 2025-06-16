
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ServiceBasicFieldsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

const ServiceBasicFields = ({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: ServiceBasicFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="title" className="text-sm font-medium">Título do Serviço *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Limpeza de apartamentos e casas"
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
          placeholder="Descreva detalhadamente o serviço que você oferece, experiência, horários de atendimento..."
          rows={4}
          required
          className="mt-1"
        />
      </div>
    </>
  );
};

export default ServiceBasicFields;
