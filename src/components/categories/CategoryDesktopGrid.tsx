
import CategoryGridItem from "./CategoryGridItem";

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

interface CategoryDesktopGridProps {
  categories: Category[];
}

const CategoryDesktopGrid = ({ categories }: CategoryDesktopGridProps) => {
  return (
    <>
      {/* Grid de categorias para desktop */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <CategoryGridItem key={category.id} category={category} />
        ))}
      </div>

      {/* Grid responsivo para tablets */}
      <div className="block md:hidden sm:grid sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <CategoryGridItem key={category.id} category={category} />
        ))}
      </div>
    </>
  );
};

export default CategoryDesktopGrid;
