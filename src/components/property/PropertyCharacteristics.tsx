
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface PropertyCharacteristicsProps {
  garageCovered: boolean;
  isRenovated: boolean;
  onGarageChange: (value: boolean) => void;
  onRenovatedChange: (value: boolean) => void;
}

export const PropertyCharacteristics = ({ 
  garageCovered, 
  isRenovated, 
  onGarageChange, 
  onRenovatedChange 
}: PropertyCharacteristicsProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Características</Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="garage"
            checked={garageCovered}
            onCheckedChange={(checked) => onGarageChange(!!checked)}
          />
          <Label htmlFor="garage" className="text-sm">Garagem coberta</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="renovated"
            checked={isRenovated}
            onCheckedChange={(checked) => onRenovatedChange(!!checked)}
          />
          <Label htmlFor="renovated" className="text-sm">Casa reformada</Label>
        </div>
      </div>
    </div>
  );
};
