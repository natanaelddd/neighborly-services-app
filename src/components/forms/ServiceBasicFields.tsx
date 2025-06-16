
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ServiceBasicFieldsProps {
  title: string;
  description: string;
  houseNumber: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onHouseNumberChange: (value: string) => void;
}

const ServiceBasicFields = ({
  title,
  description,
  houseNumber,
  onTitleChange,
  onDescriptionChange,
  onHouseNumberChange,
}: ServiceBasicFieldsProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="service-title" className="text-sm font-medium">
          Título do Serviço *
        </Label>
        <Input
          id="service-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Ex: Manutenção de ar condicionado"
          className="mt-1"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Seja claro e específico sobre o serviço oferecido
        </p>
      </div>

      <div>
        <Label htmlFor="house-number" className="text-sm font-medium">
          Número da Casa *
        </Label>
        <Input
          id="house-number"
          type="text"
          value={houseNumber}
          onChange={(e) => onHouseNumberChange(e.target.value)}
          placeholder="Ex: 123"
          className="mt-1"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Número da sua casa no condomínio
        </p>
      </div>

      <div>
        <Label htmlFor="service-description" className="text-sm font-medium">
          Descrição do Serviço *
        </Label>
        <Textarea
          id="service-description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Descreva detalhadamente seu serviço, experiência e diferenciais..."
          className="mt-1 min-h-[120px] resize-none"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Inclua informações sobre experiência, preços e disponibilidade
        </p>
      </div>
    </div>
  );
};

export default ServiceBasicFields;
