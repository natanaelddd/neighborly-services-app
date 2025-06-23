import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Home, Settings, Info, Edit, Search, Filter, Plus, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';

interface Category {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

const CategoryList = () => {
  const { isDemoMode, mockCategories } = useDemoMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (isDemoMode) {
          console.log('Carregando categorias em modo demo...');
          setCategories(mockCategories as Category[]);
          return;
        }
        
        console.log('Buscando categorias do banco de dados...');
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Erro ao buscar categorias:', error);
          setError(`Erro ao carregar categorias: ${error.message}`);
          setCategories([]);
          return;
        }

        console.log(`${categoriesData?.length || 0} categorias carregadas do banco`);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Erro inesperado ao carregar categorias:', error);
        setError('Erro inesperado ao carregar dados');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isDemoMode, mockCategories]);
  
  // Função para obter o ícone baseado no nome do ícone ou emoji
  const getIcon = (iconName?: string) => {
    if (iconName && iconName.length <= 4 && /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(iconName)) {
      return <span className="text-xl">{iconName}</span>;
    }

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
    navigate(`/services?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-3xl font-semibold mb-8 text-center text-foreground">Categorias de Serviços</h2>
        <div className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
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
  }

  return (
    <div className="py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-center text-foreground flex-1">Categorias de Serviços</h2>
        {error && (
          <div className="text-sm text-orange-500">⚠️ {error}</div>
        )}
      </div>
      
      {/* Select dropdown para dispositivos móveis */}
      <div className="block md:hidden mb-8">
        <Select value={selectedCategory} onValueChange={handleCategorySelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma categoria..." />
          </SelectTrigger>
          <SelectContent className="bg-white border shadow-lg z-[100] max-h-80">
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
            to={`/services?category=${category.id}`}
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
            to={`/services?category=${category.id}`}
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
