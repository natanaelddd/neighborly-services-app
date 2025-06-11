
import { getAllCategories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Home, Settings, Info, Edit, Search, Filter, Plus, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryList = () => {
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  
  // Função para obter o ícone baseado no nome do ícone
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'home':
        return <Home size={20} />;
      case 'settings':
        return <Settings size={20} />;
      case 'info':
        return <Info size={20} />;
      case 'edit':
        return <Edit size={20} />;
      case 'search':
        return <Search size={20} />;
      case 'filter':
        return <Filter size={20} />;
      case 'plus':
        return <Plus size={20} />;
      case 'user':
        return <User size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="py-12">
      <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Categorias de Serviços</h2>
      
      {/* Select dropdown para dispositivos móveis */}
      <div className="block md:hidden mb-8">
        <Select value={selectedCategory} onValueChange={handleCategorySelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria..." />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-50">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {getIcon(category.icon)}
                  </div>
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid de categorias para desktop */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex flex-col items-center justify-center p-6 glass-morphism rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-blue-800/30 rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {getIcon(category.icon)}
            </div>
            <span className="font-medium text-foreground">{category.name}</span>
          </Link>
        ))}
      </div>

      {/* Grid responsivo para tablets */}
      <div className="block md:hidden sm:grid sm:grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex flex-col items-center justify-center p-4 glass-morphism rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-800/30 rounded-full mb-3 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {getIcon(category.icon)}
            </div>
            <span className="font-medium text-foreground text-sm">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
