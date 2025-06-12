
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { Home, Settings, Info, Edit, Search, Filter, Plus, User } from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Categorias - Condo Indico";
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao buscar categorias:', error);
        setCategories([]);
      } else {
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para obter o ícone baseado no nome do ícone ou emoji
  const getIcon = (iconName?: string) => {
    // Se for um emoji, retorna diretamente
    if (iconName && iconName.length <= 4 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(iconName)) {
      return <span className="text-2xl">{iconName}</span>;
    }

    // Fallback para ícones Lucide
    switch (iconName) {
      case 'home':
        return <Home size={24} />;
      case 'settings':
        return <Settings size={24} />;
      case 'info':
        return <Info size={24} />;
      case 'edit':
        return <Edit size={24} />;
      case 'search':
        return <Search size={24} />;
      case 'filter':
        return <Filter size={24} />;
      case 'plus':
        return <Plus size={24} />;
      case 'user':
        return <User size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16">
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Todas as Categorias</h1>
        
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada ainda.</p>
            <p className="text-sm text-gray-400">As categorias aparecerão aqui quando forem criadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="flex flex-col items-center justify-center p-6 glass-morphism rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group border border-gray-200"
              >
                <div className="w-16 h-16 flex items-center justify-center bg-blue-800/30 rounded-full mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {getIcon(category.icon)}
                </div>
                <span className="font-medium text-foreground">{category.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
