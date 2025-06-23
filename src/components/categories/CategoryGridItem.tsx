
import { Link } from "react-router-dom";
import CategoryIcon from "./CategoryIcon";

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface CategoryGridItemProps {
  category: Category;
}

const CategoryGridItem = ({ category }: CategoryGridItemProps) => {
  return (
    <Link
      to={`/services?category=${category.id}`}
      className="flex flex-col items-center justify-center p-6 glass-morphism rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group"
    >
      <div className="w-14 h-14 flex items-center justify-center bg-blue-800/30 rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <CategoryIcon iconName={category.icon} size={20} />
      </div>
      <span className="font-medium text-foreground">{category.name}</span>
    </Link>
  );
};

export default CategoryGridItem;
