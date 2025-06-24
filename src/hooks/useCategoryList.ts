
import { useState, useEffect } from 'react';
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

export const useCategoryList = () => {
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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate(`/services?category=${categoryId}`);
  };

  return {
    categories,
    isLoading,
    error,
    selectedCategory,
    handleCategorySelect
  };
};
