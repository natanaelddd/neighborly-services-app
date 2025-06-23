
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CategoryIcon from "./CategoryIcon";

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface CategoryMobileSelectProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryMobileSelect = ({ categories, selectedCategory, onCategorySelect }: CategoryMobileSelectProps) => {
  return (
    <div className="block md:hidden mb-8">
      <Select value={selectedCategory} onValueChange={onCategorySelect}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione uma categoria..." />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg z-[100] max-h-80">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <CategoryIcon iconName={category.icon} />
                </div>
                <span>{category.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryMobileSelect;
