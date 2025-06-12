
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface ServiceCategorySelectProps {
  categories: Category[];
  categoryId: string;
  onCategoryChange: (value: string) => void;
}

const ServiceCategorySelect = ({ categories, categoryId, onCategoryChange }: ServiceCategorySelectProps) => {
  return (
    <div>
      <Label htmlFor="category" className="text-sm font-medium">Categoria</Label>
      <Select 
        value={categoryId} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id.toString()}>
              <div className="flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ServiceCategorySelect;
