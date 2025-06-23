
import { useCategoryList } from '@/hooks/useCategoryList';
import CategoryListLoading from './categories/CategoryListLoading';
import CategoryListEmpty from './categories/CategoryListEmpty';
import CategoryListHeader from './categories/CategoryListHeader';
import CategoryMobileSelect from './categories/CategoryMobileSelect';
import CategoryDesktopGrid from './categories/CategoryDesktopGrid';

const CategoryList = () => {
  const {
    categories,
    isLoading,
    error,
    selectedCategory,
    handleCategorySelect
  } = useCategoryList();

  if (isLoading) {
    return <CategoryListLoading />;
  }

  if (categories.length === 0) {
    return <CategoryListEmpty error={error} />;
  }

  return (
    <div className="py-12">
      <CategoryListHeader error={error} />
      
      <CategoryMobileSelect
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <CategoryDesktopGrid categories={categories} />
    </div>
  );
};

export default CategoryList;
