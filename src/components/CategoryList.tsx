
import { getAllCategories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Home, Settings, Info, Edit, Search, Filter, Plus, User } from "lucide-react";

const CategoryList = () => {
  const categories = getAllCategories();
  
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

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-6">Categorias</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-brand-light-blue rounded-full mb-3 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
              {getIcon(category.icon)}
            </div>
            <span className="font-medium text-gray-800">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
