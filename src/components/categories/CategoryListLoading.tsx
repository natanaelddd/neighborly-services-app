
const CategoryListLoading = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Categorias de Serviços</h2>
      <div className="flex justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  );
};

export default CategoryListLoading;
