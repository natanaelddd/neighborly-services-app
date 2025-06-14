
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MenuItem {
  id: number;
  label: string;
  path: string;
  visible: boolean;
  display_order: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// Retorna todos do Supabase, ordenando por display_order
export function useSupabaseMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      setError(error.message);
      setMenuItems([]);
    } else {
      setMenuItems(data || []);
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  // CRUD helpers
  const addMenuItem = async (item: Omit<MenuItem, "id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        { ...item }
      ])
      .select()
      .single();

    if (!error && data) setMenuItems(items =>
      [...items, data].sort((a, b) => a.display_order - b.display_order)
    );
    return { data, error };
  };

  const updateMenuItem = async (id: number, patch: Partial<MenuItem>) => {
    const { data, error } = await supabase
      .from("menu_items")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) setMenuItems(items =>
      items.map(i => (i.id === id ? { ...i, ...patch } : i))
    );
    return { data, error };
  };

  const deleteMenuItem = async (id: number) => {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);
    if (!error) setMenuItems(items => items.filter(i => i.id !== id));
    return { error };
  };

  const reorderMenuItems = async (items: MenuItem[]) => {
    // Lote update do display_order
    const updates = items.map((item, i) => ({
      id: item.id,
      display_order: i
    }));
    const { error } = await supabase
      .from("menu_items")
      .upsert(updates, { onConflict: "id" });
    if (!error) setMenuItems(items.map((it, i) => ({ ...it, display_order: i })));
    return { error };
  };

  return {
    menuItems,
    isLoading,
    error,
    fetchMenuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
    setMenuItems // só para uso interno avançado
  };
}
