
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddressFieldsProps {
  block: string;
  houseNumber: string;
  onBlockChange: (value: string) => void;
  onHouseNumberChange: (value: string) => void;
}

const AddressFields = ({ 
  block, 
  houseNumber, 
  onBlockChange, 
  onHouseNumberChange 
}: AddressFieldsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="block" className="text-sm font-medium">Bloco *</Label>
        <Select value={block} onValueChange={onBlockChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione o bloco" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Bloco 1</SelectItem>
            <SelectItem value="2">Bloco 2</SelectItem>
            <SelectItem value="3">Bloco 3</SelectItem>
            <SelectItem value="4">Bloco 4</SelectItem>
            <SelectItem value="5">Bloco 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="houseNumber" className="text-sm font-medium">Número da Casa *</Label>
        <Input
          id="houseNumber"
          value={houseNumber}
          onChange={(e) => onHouseNumberChange(e.target.value)}
          placeholder="Ex: 101, 102A"
          required
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default AddressFields;
