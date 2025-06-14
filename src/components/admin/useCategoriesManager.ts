
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types";
import { useDemoMode } from "@/hooks/useDemoMode";

export function useCategoriesManager() {
  const { isDemoMode } = useDemoMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const fetchCategories = async () => {
    if (isDemoMode) {
      setCategories([
        { id: 1, name: "Limpeza", icon: "🧹", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 2, name: "Reparos", icon: "🔧", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: 3, name: "Beleza", icon: "💄", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      setCategories(data || []);
    } catch {
      toast.error("Erro ao carregar categorias");
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async (name: string, icon: string) => {
    if (isDemoMode) {
      setCategories(prev => [
        ...prev,
        { id: Date.now(), name, icon, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]);
      toast.success("Categoria adicionada com sucesso!");
      return;
    }
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name, icon, display_order: categories.length })
        .select().single();
      if (error) throw error;
      setCategories(prev => [...prev, data]);
      toast.success("Categoria adicionada com sucesso!");
      fetchCategories();
    } catch {
      toast.error("Erro ao adicionar categoria");
    }
  };

  const updateCategory = async (id: number, name: string, icon: string) => {
    if (isDemoMode) {
      setCategories(prev => prev.map(
        cat => cat.id === id ? { ...cat, name, icon, updated_at: new Date().toISOString() } : cat
      ));
      toast.success("Categoria atualizada com sucesso!");
      return;
    }
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name, icon, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.map(
        cat => cat.id === id ? { ...cat, name, icon, updated_at: new Date().toISOString() } : cat
      ));
      toast.success("Categoria atualizada com sucesso!");
      fetchCategories();
    } catch {
      toast.error("Erro ao atualizar categoria");
    }
  };

  const deleteCategory = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    if (isDemoMode) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success("Categoria removida com sucesso!");
      return;
    }
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success("Categoria removida com sucesso!");
      fetchCategories();
    } catch {
      toast.error("Erro ao deletar categoria");
    }
  };

  const reorderCategories = async (ordered: Category[]) => {
    setCategories(ordered);
    if (isDemoMode) return;
    try {
      await Promise.all(ordered.map((category, index) =>
        supabase.from('categories').update({ display_order: index })
          .eq('id', category.id)
      ));
      toast.success("Ordem das categorias atualizada!");
      fetchCategories();
    } catch {
      toast.error("Erro ao atualizar ordem das categorias");
      fetchCategories();
    }
  };

  return {
    categories,
    isLoading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setCategories
  };
}
