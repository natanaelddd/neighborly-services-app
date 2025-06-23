
interface CategoryListEmptyProps {
  error: string | null;
}

const CategoryListEmpty = ({ error }: CategoryListEmptyProps) => {
  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-center text-foreground flex-1">Categorias de Serviços</h2>
        {error && (
          <div className="text-sm text-red-500">⚠️ {error}</div>
        )}
      </div>
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma categoria cadastrada ainda.</p>
      </div>
    </div>
  );
};

export default CategoryListEmpty;
