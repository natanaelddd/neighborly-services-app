
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertyTypeAndPriceProps {
  type: string;
  price: string;
  bedrooms: string;
  onTypeChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onBedroomsChange: (value: string) => void;
}

export const PropertyTypeAndPrice = ({ 
  type, 
  price, 
  bedrooms,
  onTypeChange, 
  onPriceChange,
  onBedroomsChange
}: PropertyTypeAndPriceProps) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div>
          <Label htmlFor="type" className="text-sm font-medium">Tipo *</Label>
          <Select 
            value={type} 
            onValueChange={onTypeChange}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="aluguel">Aluguel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price" className="text-sm font-medium">
            Preço {type === 'aluguel' ? '(mensal)' : ''}
          </Label>
          <Input
            id="price"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            placeholder="Ex: R$ 450.000 ou R$ 2.500/mês"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="bedrooms" className="text-sm font-medium">Quartos *</Label>
        <Select 
          value={bedrooms} 
          onValueChange={onBedroomsChange}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3 quartos</SelectItem>
            <SelectItem value="4">4 quartos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
