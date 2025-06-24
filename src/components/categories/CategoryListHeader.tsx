
interface CategoryListHeaderProps {
  error: string | null;
}

const CategoryListHeader = ({ error }: CategoryListHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-semibold text-center text-foreground flex-1">Categorias de Serviços</h2>
      {error && (
        <div className="text-sm text-orange-500">⚠️ {error}</div>
      )}
    </div>
  );
};

export default CategoryListHeader;
