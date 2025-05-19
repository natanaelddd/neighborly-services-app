
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
    <div className="py-12">
      <h2 className="text-3xl font-semibold mb-8 text-center">Categorias de Serviços</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/categories/${category.id}`}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group"
          >
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-brand-light-blue to-blue-100 rounded-full mb-4 text-brand-blue group-hover:bg-brand-blue group-hover:from-brand-blue group-hover:to-blue-600 group-hover:text-white transition-all duration-300">
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
